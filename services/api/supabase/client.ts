import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

console.log('🔧 Supabase 클라이언트 생성:', {
  url: supabaseUrl,
  keyPrefix: supabaseKey.substring(0, 30) + '...',
  hasUrl: !!supabaseUrl,
  hasKey: !!supabaseKey
});

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false // 중요: URL 자동 감지 비활성화
  }
});

export { supabase };

