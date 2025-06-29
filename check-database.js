const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// 简单的环境变量读取函数
function loadEnvFile() {
  try {
    const envPath = path.join(__dirname, '.env.local');
    const envContent = fs.readFileSync(envPath, 'utf8');
    const lines = envContent.split('\n');
    
    lines.forEach(line => {
      const [key, value] = line.split('=');
      if (key && value && !key.startsWith('#')) {
        process.env[key.trim()] = value.trim();
      }
    });
  } catch (error) {
    console.log('⚠️  无法读取 .env.local 文件');
  }
}

async function checkDatabase() {
  loadEnvFile();
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    console.error('❌ Supabase 环境变量未配置');
    console.log('请确保 .env.local 文件中包含:');
    console.log('SUPABASE_URL=your_supabase_url');
    console.log('SUPABASE_ANON_KEY=your_supabase_anon_key');
    return;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  console.log('🔍 检查数据库配置...\n');

  // 检查 pgvector 扩展
  try {
    const { data: extensions, error: extError } = await supabase
      .from('pg_extension')
      .select('extname')
      .eq('extname', 'vector');
    
    if (extError) {
      console.log('⚠️  无法检查 pgvector 扩展 (这可能是正常的权限限制)');
    } else if (extensions && extensions.length > 0) {
      console.log('✅ pgvector 扩展已安装');
    } else {
      console.log('❌ pgvector 扩展未安装');
    }
  } catch (error) {
    console.log('⚠️  无法检查 pgvector 扩展:', error.message);
  }

  // 检查 resources 表
  try {
    const { data, error } = await supabase
      .from('resources')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ resources 表不存在:', error.message);
    } else {
      console.log('✅ resources 表存在');
    }
  } catch (error) {
    console.log('❌ resources 表检查失败:', error.message);
  }

  // 检查 embeddings 表
  try {
    const { data, error } = await supabase
      .from('embeddings')
      .select('count')
      .limit(1);
    
    if (error) {
      console.log('❌ embeddings 表不存在:', error.message);
    } else {
      console.log('✅ embeddings 表存在');
    }
  } catch (error) {
    console.log('❌ embeddings 表检查失败:', error.message);
  }

  // 检查 match_embeddings 函数
  try {
    const { data, error } = await supabase.rpc('match_embeddings', {
      query_embedding: new Array(1536).fill(0),
      match_threshold: 0.5,
      match_count: 1,
    });
    
    if (error) {
      console.log('❌ match_embeddings 函数不存在:', error.message);
      console.log('\n📝 需要运行数据库迁移:');
      console.log('1. 登录 Supabase Dashboard');
      console.log('2. 转到 SQL Editor');
      console.log('3. 依次执行以下文件中的 SQL:');
      console.log('   - supabase/migrations/001_create_rag_tables.sql');
      console.log('   - supabase/migrations/002_create_match_function.sql');
    } else {
      console.log('✅ match_embeddings 函数存在');
    }
  } catch (error) {
    console.log('❌ match_embeddings 函数检查失败:', error.message);
  }

  console.log('\n🔧 OpenAI API 配置检查:');
  if (process.env.OPENAI_API_KEY) {
    console.log('✅ OPENAI_API_KEY 已配置');
  } else {
    console.log('❌ OPENAI_API_KEY 未配置');
  }

  console.log('\n✨ 检查完成!');
}

checkDatabase().catch(console.error); 