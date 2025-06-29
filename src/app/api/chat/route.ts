import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool, generateText } from 'ai';
import { z } from 'zod';

// Allow streaming responses up to 30 seconds
export const maxDuration = 30;

const openai = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  baseURL: process.env.AI_BASE_URL
});

// Pacagen知识库
const PACAGEN_KNOWLEDGE_BASE = {
  company: {
    name: "Pacagen",
    description: "专注于宠物健康和护理的专业品牌",
    mission: "为宠物提供安全、有效的健康解决方案",
    values: "天然、安全、有效、专业"
  },
  products: {
    "宠物过敏喷雾": {
      name: "Pacagen宠物过敏缓解喷雾",
      description: "专为过敏宠物设计的天然舒缓喷雾",
      features: [
        "天然成分，温和无刺激",
        "快速缓解皮肤瘙痒和红肿",
        "适用于猫咪和狗狗",
        "便携喷雾设计，使用方便"
      ],
      usage: "每日2-3次，直接喷洒在受影响区域，建议在清洁患处后使用",
      price: "¥128",
      ingredients: "芦荟提取物、洋甘菊精华、维生素E、天然保湿因子",
      safety: "通过宠物安全测试，3个月以上宠物可使用",
      effect_time: "通常24-48小时内可见明显改善"
    },
    "宠物食物": {
      name: "Pacagen营养配方宠物粮",
      description: "科学配比的全营养宠物食品",
      types: [
        "幼犬/幼猫成长配方 - 高蛋白，促进发育",
        "成犬/成猫维护配方 - 均衡营养，维持健康", 
        "老年宠物特护配方 - 易消化，关节保护",
        "敏感肠胃呵护配方 - 低敏配方，添加益生菌"
      ],
      features: [
        "优质蛋白质来源（鸡肉、鱼肉）",
        "均衡营养配比，符合AAFCO标准",
        "添加益生菌促进消化健康",
        "无人工色素、防腐剂和谷物填充",
        "富含Omega-3和Omega-6脂肪酸"
      ],
      price: "¥89-¥256（根据规格和配方不同）",
      feeding_guide: "根据宠物体重和年龄调整喂食量，建议分2-3次喂食"
    }
  },
  faq: [
    {
      category: "产品使用",
      question: "过敏喷雾适合什么年龄的宠物使用？",
      answer: "我们的过敏喷雾适合3个月以上的猫咪和狗狗使用，配方温和安全，对幼宠也很友好。使用前建议先在小面积测试。"
    },
    {
      category: "产品选择",
      question: "宠物食物如何选择合适的配方？",
      answer: "建议根据宠物年龄和健康状况选择：\n• 幼宠（12个月以下）选成长配方\n• 成年宠物选维护配方\n• 7岁以上选老年特护配方\n• 肠胃敏感选呵护配方"
    },
    {
      category: "服务政策",
      question: "产品的配送时间是多久？",
      answer: "我们承诺72小时内发货，一般3-5个工作日即可收到。紧急情况可选择次日达服务（加收费用）。"
    },
    {
      category: "售后服务",
      question: "如果宠物使用后不适应怎么办？",
      answer: "我们提供30天无条件退换货服务。如果宠物使用后有任何不适，请立即停止使用并联系我们的客服团队，我们会安排退款或换货。"
    }
  ]
};

// 意图识别的AI函数
async function analyzeUserIntent(userMessage: string): Promise<{
  isRelevant: boolean;
  intent: string;
  confidence: number;
  category?: string;
  keywords?: string[];
}> {
  try {
    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `你是一个专业的意图识别助手。请分析用户的问题是否与"Pacagen宠物品牌"相关。

Pacagen是专注于宠物健康护理的品牌，主要产品包括：
1. 宠物过敏缓解喷雾
2. 营养配方宠物食品

请严格按照以下JSON格式回复，不要添加任何额外文字：

{
  "isRelevant": boolean,
  "intent": "具体意图描述",
  "confidence": 0-100的数字,
  "category": "产品咨询|使用方法|价格询问|成分安全|售后服务|品牌介绍|其他",
  "keywords": ["相关关键词数组"]
}

判断规则：
- 只有明确提到宠物相关问题才算相关
- 提到过敏、喷雾、宠物食物、猫粮、狗粮等直接相关
- 提到Pacagen品牌直接相关
- 通用购物问题（如快递、支付）但未涉及宠物的不相关
- 完全无关的话题（天气、新闻等）不相关

分类说明：
- 产品咨询：询问产品功效、特点、适用性
- 使用方法：如何使用产品、用量、频率
- 价格询问：产品价格、优惠信息
- 成分安全：产品成分、安全性、副作用
- 售后服务：退换货、配送、客服
- 品牌介绍：公司背景、品牌故事、联系方式、官网
- 具体需求：根据宠物情况推荐产品`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      temperature: 0.1,
      maxTokens: 200
    });

    const response = JSON.parse(result.text);
    return response;
  } catch (error) {
    console.error('意图识别失败:', error);
    // 降级处理：使用简单关键词匹配
    const pacagenKeywords = ['过敏', '喷雾', '宠物', '猫', '狗', '食物', '猫粮', '狗粮', 'pacagen'];
    const isRelevant = pacagenKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    return {
      isRelevant,
      intent: isRelevant ? '产品咨询' : '无关询问',
      confidence: 60,
      category: isRelevant ? '产品咨询' : '其他'
    };
  }
}

// 带上下文的意图识别
async function analyzeUserIntentWithContext(
  userMessage: string,
  conversationHistory: Array<{ role: string; content: string }>
): Promise<{
  isRelevant: boolean;
  intent: string;
  confidence: number;
  category?: string;
  keywords?: string[];
}> {
  try {
    // 构建对话上下文，只保留最近5轮对话避免token过多
    const recentHistory = conversationHistory.slice(-10);
    const contextMessages = recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `你是一个专业的意图识别助手。请分析用户的问题是否与"Pacagen宠物品牌"相关。

重要：请结合对话历史上下文来理解用户的问题。用户可能会使用指代词（如"这个"、"那个"、"129元的"）或简化表达，需要根据上下文判断。

Pacagen是专注于宠物健康护理的品牌，主要产品包括：
1. 宠物过敏缓解喷雾（价格：89-129元）
2. 营养配方宠物食品（价格：199-299元）

请严格按照以下JSON格式回复，不要添加任何额外文字：

{
  "isRelevant": boolean,
  "intent": "具体意图描述",
  "confidence": 0-100的数字,
  "category": "产品咨询|使用方法|价格询问|成分安全|售后服务|品牌介绍|上下文追问|其他",
  "keywords": ["相关关键词数组"]
}

判断规则：
- 结合对话历史理解指代关系和上下文
- 如果用户在追问之前提到的产品信息，应该算作相关
- 提到价格、具体型号、"这个产品"等都可能是上下文追问
- 只有完全无关的新话题才算不相关

分类说明：
- 产品咨询：询问产品功效、特点、适用性
- 使用方法：如何使用产品、用量、频率
- 价格询问：产品价格、优惠信息
- 成分安全：产品成分、安全性、副作用
- 售后服务：退换货、配送、客服
- 品牌介绍：公司背景、品牌故事、联系方式、官网
- 上下文追问：基于之前对话内容的追问
- 其他：完全无关的话题`
        },
        ...contextMessages
      ],
      temperature: 0.1,
      maxTokens: 200
    });

    const response = JSON.parse(result.text);
    return response;
  } catch (error) {
    console.error('上下文意图识别失败:', error);
    // 降级处理：使用简单关键词匹配，包含可能的上下文关键词
    const pacagenKeywords = ['过敏', '喷雾', '宠物', '猫', '狗', '食物', '猫粮', '狗粮', 'pacagen', '这个', '那个', '价格', '元', '款'];
    const isRelevant = pacagenKeywords.some(keyword => 
      userMessage.toLowerCase().includes(keyword)
    );
    
    return {
      isRelevant,
      intent: isRelevant ? '上下文追问' : '无关询问',
      confidence: isRelevant ? 70 : 30,
      category: isRelevant ? '上下文追问' : '其他'
    };
  }
}

// 智能知识库检索
function smartKnowledgeSearch(intent: string, category: string, keywords: string[] = []): string {
  let knowledge = '';
  
  // 根据分类检索
  switch (category) {
    case '产品咨询':
    case '成分安全':
      if (keywords.some(k => k.includes('过敏') || k.includes('喷雾'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
        knowledge = `【产品信息】\n${product.name}\n${product.description}\n\n【主要功效】\n${product.features.join('\n')}\n\n【安全性】\n${product.safety}\n\n【主要成分】\n${product.ingredients}`;
      } else if (keywords.some(k => k.includes('食物') || k.includes('粮'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
        knowledge = `【产品信息】\n${product.name}\n${product.description}\n\n【产品系列】\n${product.types.join('\n')}\n\n【产品特点】\n${product.features.join('\n')}`;
      }
      break;
      
    case '使用方法':
      if (keywords.some(k => k.includes('过敏') || k.includes('喷雾'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
        knowledge = `【使用方法】\n${product.usage}\n\n【见效时间】\n${product.effect_time}\n\n【适用对象】\n${product.safety}`;
      } else if (keywords.some(k => k.includes('食物') || k.includes('粮'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
        knowledge = `【喂食指南】\n${product.feeding_guide}\n\n【产品选择】\n${PACAGEN_KNOWLEDGE_BASE.faq[1].answer}`;
      }
      break;
      
    case '价格询问':
      const sprayProduct = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
      const foodProduct = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
      knowledge = `【产品价格】\n• ${sprayProduct.name}：${sprayProduct.price}\n• ${foodProduct.name}：${foodProduct.price}\n\n我们所有产品都包邮，并提供30天无条件退换货服务。`;
      break;
      
    case '售后服务':
      const faq = PACAGEN_KNOWLEDGE_BASE.faq.find(f => f.category === '售后服务');
      if (faq) {
        knowledge = `【售后服务】\n${faq.answer}\n\n【配送服务】\n${PACAGEN_KNOWLEDGE_BASE.faq.find(f => f.category === '服务政策')?.answer}`;
      }
      break;
      
    case '品牌介绍':
      const company = PACAGEN_KNOWLEDGE_BASE.company;
      knowledge = `【关于Pacagen】\n${company.description}\n\n【我们的使命】\n${company.mission}\n\n【品牌价值】\n${company.values}`;
      break;
  }
  
  // 如果没有找到特定信息，检索相关FAQ
  if (!knowledge) {
    const relatedFAQ = PACAGEN_KNOWLEDGE_BASE.faq.find(faq =>
      keywords.some(keyword => 
        faq.question.toLowerCase().includes(keyword.toLowerCase()) ||
        faq.answer.toLowerCase().includes(keyword.toLowerCase())
      )
    );
    
    if (relatedFAQ) {
      knowledge = `【常见问题】\n问：${relatedFAQ.question}\n答：${relatedFAQ.answer}`;
    }
  }
  
  return knowledge;
}

// 生成个性化回复
async function generatePersonalizedResponse(
  userMessage: string,
  intentAnalysis: {
    isRelevant: boolean;
    intent: string;
    confidence: number;
    category?: string;
    keywords?: string[];
  },
  conversationHistory: Array<{ role: string; content: string }> = []
): Promise<string> {
  // 收集相关的知识库信息
  const relevantKnowledge: string[] = [];
  
  // 根据意图分类收集相关信息
  switch (intentAnalysis.category) {
    case '产品咨询':
    case '成分安全':
      if (intentAnalysis.keywords?.some(k => k.includes('过敏') || k.includes('喷雾'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
        relevantKnowledge.push(`【宠物过敏喷雾】产品名称：${product.name}，描述：${product.description}，主要功效：${product.features.join('、')}，主要成分：${product.ingredients}，安全性：${product.safety}，价格：${product.price}`);
      }
      if (intentAnalysis.keywords?.some(k => k.includes('食物') || k.includes('粮'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
        relevantKnowledge.push(`【宠物食物】产品名称：${product.name}，描述：${product.description}，产品系列：${product.types.join('、')}，产品特点：${product.features.join('、')}，喂食指南：${product.feeding_guide}，价格：${product.price}`);
      }
      break;
      
    case '使用方法':
      if (intentAnalysis.keywords?.some(k => k.includes('过敏') || k.includes('喷雾'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
        relevantKnowledge.push(`【使用方法】${product.name}的使用方法：${product.usage}，见效时间：${product.effect_time}，适用对象：${product.safety}`);
      }
      if (intentAnalysis.keywords?.some(k => k.includes('食物') || k.includes('粮'))) {
        const product = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
        relevantKnowledge.push(`【喂食指南】${product.name}的喂食方法：${product.feeding_guide}`);
      }
      break;
      
    case '价格询问':
      const sprayProduct = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
      const foodProduct = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
      relevantKnowledge.push(`【产品价格】${sprayProduct.name}：${sprayProduct.price}，${foodProduct.name}：${foodProduct.price}。优惠政策：全国包邮配送、30天无条件退换货、72小时内发货`);
      break;
      
    case '售后服务':
      const serviceFaq = PACAGEN_KNOWLEDGE_BASE.faq.find(f => f.category === '售后服务');
      const shippingFaq = PACAGEN_KNOWLEDGE_BASE.faq.find(f => f.category === '服务政策');
      if (serviceFaq) relevantKnowledge.push(`【退换货政策】${serviceFaq.answer}`);
      if (shippingFaq) relevantKnowledge.push(`【配送服务】${shippingFaq.answer}`);
      break;
      
          case '品牌介绍':
        const company = PACAGEN_KNOWLEDGE_BASE.company;
        relevantKnowledge.push(`【公司信息】公司描述：${company.description}，使命：${company.mission}，品牌价值：${company.values}`);
        // 添加产品信息作为补充
        relevantKnowledge.push(`【核心产品】宠物过敏缓解喷雾 - 天然安全快速缓解；营养配方宠物食品 - 科学配比健康呵护`);
        break;
        
      case '上下文追问':
        // 对于上下文追问，添加所有产品信息以便AI参考
        const sprayInfo = PACAGEN_KNOWLEDGE_BASE.products["宠物过敏喷雾"];
        const foodInfo = PACAGEN_KNOWLEDGE_BASE.products["宠物食物"];
        relevantKnowledge.push(`【宠物过敏喷雾】产品名称：${sprayInfo.name}，价格：${sprayInfo.price}，描述：${sprayInfo.description}，功效：${sprayInfo.features.join('、')}`);
        relevantKnowledge.push(`【宠物食物】产品名称：${foodInfo.name}，价格：${foodInfo.price}，描述：${foodInfo.description}，系列：${foodInfo.types.join('、')}`);
        break;
    }
  
  // 添加相关FAQ
  const relatedFAQ = PACAGEN_KNOWLEDGE_BASE.faq.filter(faq =>
    intentAnalysis.keywords?.some(keyword => 
      faq.question.toLowerCase().includes(keyword.toLowerCase()) ||
      faq.answer.toLowerCase().includes(keyword.toLowerCase())
    )
  );
  relatedFAQ.forEach(faq => {
    relevantKnowledge.push(`【常见问题】问：${faq.question}，答：${faq.answer}`);
  });
  
  try {
    // 构建包含对话历史的消息
    const recentHistory = conversationHistory.slice(-8); // 最近4轮对话
    const contextMessages = recentHistory.map(msg => ({
      role: msg.role === 'user' ? 'user' as const : 'assistant' as const,
      content: msg.content
    }));

    const result = await generateText({
      model: openai('gpt-4o-mini'),
      messages: [
        {
          role: 'system',
          content: `你是Pacagen宠物品牌的专业客服助手。请根据用户的具体问题、对话历史上下文和提供的知识库信息，生成一个友好、专业、准确的回复。

重要：请仔细阅读对话历史，理解用户可能使用的指代词（如"这个"、"那个"、"129元的"、"哪一款"等），并结合上下文给出准确回复。

要求：
1. 结合对话历史理解用户的真实意图
2. 直接回答用户的具体问题
3. 使用提供的知识库信息，不要编造内容
4. 保持友好亲切的语调，使用适当的emoji
5. 如果问题涉及多个方面，可以提供相关的额外信息
6. 回复长度适中（100-300字）
7. 始终以Pacagen客服的身份回复

知识库信息：
${relevantKnowledge.join('\n')}

如果知识库中没有相关信息，请礼貌地表示可以为用户提供其他帮助。`
        },
        ...contextMessages
      ],
      temperature: 0.3,
      maxTokens: 500
    });

    return result.text;
  } catch (error) {
    console.error('生成个性化回复失败:', error);
    // 降级处理：返回基本信息
    if (relevantKnowledge.length > 0) {
      return `感谢您的咨询！🐾\n\n${relevantKnowledge[0]}\n\n如果您需要更详细的信息，请随时告诉我！😊`;
    } else {
      return `感谢您对Pacagen的关注！🐾 我可以为您介绍我们的宠物过敏缓解喷雾和营养配方宠物食品。请告诉我您想了解什么具体信息？😊`;
    }
  }
}

export async function POST(req: Request) {
  const { messages } = await req.json();
  
  // 获取最新的用户消息
  const lastMessage = messages[messages.length - 1];
  const userMessage = lastMessage?.content || '';
  
  console.log('用户消息:', userMessage);
  console.log('对话历史:', messages.length, '条消息');
  
  try {
    // 带上下文的AI意图识别
    const intentAnalysis = await analyzeUserIntentWithContext(userMessage, messages);
    
    console.log('意图识别结果:', intentAnalysis);
    
    // 如果不相关，快速回复
    if (!intentAnalysis.isRelevant || intentAnalysis.confidence < 50) {
      return new Response(
        JSON.stringify({
          content: `抱歉，我是Pacagen的专属客服助手，专门为您解答关于宠物健康护理的问题。

我可以帮您了解：
🐱 宠物过敏缓解喷雾的使用方法和效果
🐶 营养配方宠物食品的选择建议  
💊 产品成分安全性和适用性
📦 订购、配送和售后服务

如果您想了解我们的产品，请随时问我哦！😊`
        }),
        {
          headers: { 'Content-Type': 'application/json' }
        }
      );
    }
    
    // 根据意图和问题生成个性化回复
    const responseContent = await generatePersonalizedResponse(
      userMessage,
      intentAnalysis,
      messages
    );
    
    // 直接返回JSON响应，不使用流式
    return new Response(
      JSON.stringify({
        content: responseContent
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
    
  } catch (error) {
    console.error('AI处理错误:', error);
    
    // 降级处理
    return new Response(
      JSON.stringify({
        content: "抱歉，我现在遇到了一些技术问题。不过我还是很乐意为您介绍Pacagen的宠物产品！请告诉我您想了解哪方面的信息，比如产品功效、使用方法或者价格等，我会尽力为您解答。"
      }),
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }
}