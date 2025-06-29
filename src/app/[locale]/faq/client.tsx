'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { 
  Send, 
  Bot,
  User,
  Sparkles,
  HelpCircle
} from 'lucide-react'

// 定义消息类型
interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
}

const translations = {
  zh: {
    chatTitle: '智能客服助手',
    chatSubtitle: '有任何问题都可以问我',
    placeholder: '请输入您的问题...',
    send: '发送',
    thinkingTitle: 'AI 正在思考...',
    welcomeMessage: '您好！我是Pacagen的专属客服助手 🐱🐶 我可以为您介绍我们的宠物过敏缓解喷雾和营养配方宠物食品，解答产品使用、成分、价格等任何相关问题。让我们一起为您的毛孩子提供最好的呵护！',
    commonQuestions: '常见问题',
    quickReplies: [
      '宠物过敏喷雾怎么使用？',
      'Pacagen的宠物食物有哪些配方？',
      '过敏喷雾适合幼宠使用吗？',
      'Pacagen产品的价格是多少？',
      '产品配送需要多长时间？'
    ],
    allQuestions: [
      '宠物过敏喷雾怎么使用？',
      'Pacagen的宠物食物有哪些配方？',
      '过敏喷雾适合幼宠使用吗？',
      'Pacagen产品的价格是多少？',
      '产品配送需要多长时间？',
      '过敏喷雾的成分是什么？',
      '宠物食物适合什么年龄的宠物？',
      '如果宠物使用后不适应怎么办？',
      'Pacagen是什么品牌？',
      '宠物过敏喷雾效果怎么样？',
      '敏感肠胃的宠物能吃哪款食物？',
      '产品是否天然无添加？',
      '老年宠物适合什么配方？',
      '过敏喷雾多久见效？',
      '宠物食物的营养成分如何？',
      '产品安全性怎么样？',
      '幼犬幼猫专用配方有什么特点？',
      '过敏喷雾可以天天使用吗？',
      '如何选择合适的宠物食物？',
      'Pacagen的售后服务政策？'
    ],
    newChat: '新对话'
  },
  en: {
    chatTitle: 'AI Customer Service',
    chatSubtitle: 'Feel free to ask me anything',
    placeholder: 'Type your question here...',
    send: 'Send',
    thinkingTitle: 'AI is thinking...',
    welcomeMessage: 'Hello! I\'m Pacagen\'s dedicated customer service assistant 🐱🐶 I can introduce you to our pet allergy relief spray and nutritional pet food formulas, answering any questions about usage, ingredients, pricing, and more. Let\'s work together to provide the best care for your furry friends!',
    commonQuestions: 'Common Questions',
    quickReplies: [
      'How to use pet allergy spray?',
      'What Pacagen pet food formulas are available?',
      'Is allergy spray safe for young pets?',
      'What are Pacagen product prices?',
      'How long does shipping take?'
    ],
    allQuestions: [
      'How to use pet allergy spray?',
      'What Pacagen pet food formulas are available?',
      'Is allergy spray safe for young pets?',
      'What are Pacagen product prices?',
      'How long does shipping take?',
      'What ingredients are in the allergy spray?',
      'What age pets can eat the food?',
      'What if my pet doesn\'t adapt to the product?',
      'What brand is Pacagen?',
      'How effective is the pet allergy spray?',
      'Which food is suitable for sensitive stomachs?',
      'Are products natural and additive-free?',
      'What formula is suitable for senior pets?',
      'How quickly does allergy spray work?',
      'What nutrients are in pet food?',
      'How safe are the products?',
      'What features do puppy/kitten formulas have?',
      'Can I use allergy spray daily?',
      'How to choose the right pet food?',
      'What is Pacagen\'s after-sales policy?'
    ],
    newChat: 'New Chat'
  },
  ja: {
    chatTitle: 'AIカスタマーサービス',
    chatSubtitle: 'お気軽に何でもお聞きください',
    placeholder: 'ご質問をこちらにご入力ください...',
    send: '送信',
    thinkingTitle: 'AIが考えています...',
    welcomeMessage: 'こんにちは！私はPacagenの専属カスタマーサービスアシスタントです 🐱🐶 ペットアレルギー緩和スプレーや栄養配合ペットフードについてご紹介し、使用方法、成分、価格などのご質問にお答えいたします。大切なペットちゃんに最高のケアを提供しましょう！',
    commonQuestions: 'よくある質問',
    quickReplies: [
      'ペットアレルギースプレーの使い方は？',
      'Pacagenのペットフードの種類は？',
      'アレルギースプレーは幼ペットに安全？',
      'Pacagen製品の価格はいくらですか？',
      '配送時間はどのくらいですか？'
    ],
    allQuestions: [
      'ペットアレルギースプレーの使い方は？',
      'Pacagenのペットフードの種類は？',
      'アレルギースプレーは幼ペットに安全？',
      'Pacagen製品の価格はいくらですか？',
      '配送時間はどのくらいですか？',
      'アレルギースプレーの成分は？',
      'ペットフードは何歳から食べられる？',
      'ペットが製品に合わない場合は？',
      'Pacagenはどんなブランド？',
      'ペットアレルギースプレーの効果は？',
      '敏感な胃腸のペットに適したフードは？',
      '製品は天然無添加ですか？',
      'シニアペット用配合はどんな特徴？',
      'アレルギースプレーはどのくらいで効く？',
      'ペットフードの栄養成分は？',
      '製品の安全性はどうですか？',
      '子犬子猫専用配合の特徴は？',
      'アレルギースプレーは毎日使える？',
      '適切なペットフードの選び方は？',
      'Pacagenのアフターサービスポリシーは？'
    ],
    newChat: '新しいチャット'
  }
}

interface FAQClientProps {
  locale: 'zh' | 'en' | 'ja'
}

export default function FAQClient({ locale }: FAQClientProps) {
  const t = translations[locale]
  
  // 使用简单的状态管理，不需要useChat
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const [currentQuestions, setCurrentQuestions] = useState<string[]>(t.quickReplies)
  const [removingQuestionIndex, setRemovingQuestionIndex] = useState<number | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  // 处理输入变化
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInput(e.target.value)
  }

  // 发送消息的通用函数
  const sendMessage = async (messageContent: string) => {
    if (!messageContent.trim() || isLoading) return

    setIsLoading(true)

    // 添加用户消息
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: messageContent
    }
    
    // 更新消息历史
    const updatedMessages = await new Promise<Message[]>((resolve) => {
      setMessages(prev => {
        const newMessages = [...prev, userMessage]
        resolve(newMessages)
        return newMessages
      })
    })

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: updatedMessages.map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        })
      })

      if (response.ok) {
        const data = await response.json()
        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.content
        }
        setMessages(prev => [...prev, assistantMessage])
      } else {
        const errorMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: '抱歉，我现在遇到了一些技术问题，请稍后再试。'
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch (error) {
      console.error('发送消息失败:', error)
      const networkErrorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: '抱歉，网络连接出现问题，请检查网络后重试。'
      }
      setMessages(prev => [...prev, networkErrorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const messageContent = input.trim()
    if (messageContent) {
      setInput('')
      await sendMessage(messageContent)
    }
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  // 获取一个新的随机问题（不包括当前显示的问题）
  const getNewRandomQuestion = (): string => {
    const availableQuestions = t.allQuestions.filter(
      question => !currentQuestions.includes(question)
    )
    
    if (availableQuestions.length === 0) {
      // 如果没有可用问题，从全部问题中随机选择
      const randomIndex = Math.floor(Math.random() * t.allQuestions.length)
      return t.allQuestions[randomIndex]
    }
    
    const randomIndex = Math.floor(Math.random() * availableQuestions.length)
    return availableQuestions[randomIndex]
  }

  // 发送快速回复消息
  const sendQuickReply = async (message: string, index: number) => {
    setRemovingQuestionIndex(index)
    
    // 使用通用发送消息函数
    await sendMessage(message)
    
    // 延迟执行删除和添加新问题
    setTimeout(() => {
      const newQuestion = getNewRandomQuestion()
      const newQuestions = [...currentQuestions]
      newQuestions[index] = newQuestion
      
      setCurrentQuestions(newQuestions)
      setRemovingQuestionIndex(null)
    }, 400)
  }

  const handleClearChat = () => {
    const welcomeMessage: Message = {
      id: '1',
      role: 'assistant',
      content: t.welcomeMessage
    }
    setMessages([welcomeMessage])
    setCurrentQuestions(t.quickReplies)
    setRemovingQuestionIndex(null)
    setInput('')
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSubmit(e as React.FormEvent)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-card border rounded-2xl shadow-lg elite-shadow overflow-hidden">
        

        {/* Quick Replies */}
        <div className="p-4 border-b bg-muted/30">
          <p className="text-sm font-medium text-muted-foreground mb-3 flex items-center">
            <HelpCircle className="h-4 w-4 mr-2" />
            {t.commonQuestions}
          </p>
          <div className="flex flex-wrap gap-2">
            <AnimatePresence mode="popLayout">
              {currentQuestions.map((reply, index) => (
                <motion.div
                  key={`${reply}-${index}`}
                  initial={{ opacity: 0, y: -30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ 
                    opacity: 0, 
                    y: 30,
                    transition: { duration: 0.3 }
                  }}
                  transition={{ 
                    duration: 0.5,
                    delay: index * 0.1
                  }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => sendQuickReply(reply, index)}
                    className="text-xs hover:bg-primary hover:text-primary-foreground cursor-pointer"
                    disabled={isLoading || removingQuestionIndex === index}
                  >
                    {reply}
                  </Button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>

        {/* Messages */}
        <div className="h-96 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-muted scrollbar-track-background">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ 
                  opacity: 0, 
                  y: 30,
                  scale: 0.9
                }}
                animate={{ 
                  opacity: 1, 
                  y: 0,
                  scale: 1
                }}
                exit={{ 
                  opacity: 0, 
                  y: -30,
                  scale: 0.9
                }}
                transition={{ 
                  duration: 0.1,
                  ease: "easeInOut"
                }}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`flex max-w-xs lg:max-w-md ${
                    message.role === 'user' ? 'flex-row-reverse' : 'flex-row'
                  } space-x-2`}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.1, duration: 0.2 }}
                  >
                    <Avatar className={`h-8 w-8 flex-shrink-0 ${message.role === 'user' ? 'ml-2' : 'mr-2'}`}>
                      {message.role === 'user' ? (
                        <User className="h-4 w-4" />
                      ) : (
                        <Bot className="h-4 w-4 text-primary" />
                      )}
                    </Avatar>
                  </motion.div>
                  <motion.div
                    initial={{ 
                      opacity: 0, 
                      scale: 0.8,
                      x: message.role === 'user' ? 20 : -20
                    }}
                    animate={{ 
                      opacity: 1, 
                      scale: 1,
                      x: 0
                    }}
                    transition={{ 
                      delay: 0.1,
                      duration: 0.3,
                      ease: "easeOut"
                    }}
                    className={`px-4 py-2 rounded-2xl shadow-sm ${
                      message.role === 'user'
                        ? 'bg-primary text-primary-foreground rounded-br-sm'
                        : 'bg-muted rounded-bl-sm'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm leading-relaxed">{message.content}</div>
                    <div
                      className={`text-xs mt-1 ${
                        message.role === 'user'
                          ? 'text-primary-foreground/70'
                          : 'text-muted-foreground'
                      }`}
                    >
                      {new Date().toLocaleTimeString([], { 
                        hour: '2-digit', 
                        minute: '2-digit' 
                      })}
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          
          {isLoading && (
            <motion.div 
              className="flex justify-start"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex space-x-2 max-w-xs lg:max-w-md">
                <Avatar className="h-8 w-8 flex-shrink-0 mr-2">
                  <Bot className="h-4 w-4 text-primary" />
                </Avatar>
                <motion.div 
                  className="bg-muted rounded-2xl rounded-bl-sm px-4 py-2 shadow-sm"
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  <div className="flex items-center space-x-2">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    >
                      <Sparkles className="h-4 w-4 text-primary" />
                    </motion.div>
                    <span className="text-sm">{t.thinkingTitle}</span>
                  </div>
                  <div className="flex space-x-1 mt-2">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 bg-primary/60 rounded-full"
                        animate={{ y: [-4, 4, -4] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut"
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <motion.div 
          className="p-4 border-t bg-muted/30"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <form onSubmit={handleSubmit} className="flex space-x-2">
            <div className="flex-1 relative">
              <motion.textarea
                ref={inputRef}
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder={t.placeholder}
                className="w-full px-4 py-3 border rounded-xl resize-none bg-background focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all min-h-[48px] max-h-32"
                rows={1}
                disabled={isLoading}
                whileFocus={{ 
                  boxShadow: "0 0 0 3px rgba(59, 130, 246, 0.1)"
                }}
                transition={{ duration: 0.2 }}
              />
            </div>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              transition={{ duration: 0.1 }}
              className='flex items-center justify-center'
            >
              <Button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="px-6 py-3 rounded-full hover:shadow-lg transition-all cursor-pointer"
              >
                <Send className="h-4 w-4" />
                <span className="sr-only">{t.send}</span>
              </Button>
            </motion.div>
          </form>
          <div className="text-xs text-muted-foreground mt-2 text-center">
            按 Enter 发送，Shift + Enter 换行 • 点击上方问题会丝滑替换新问题 ✨
          </div>
        </motion.div>
      </div>
    </div>
  )
} 