import { supabase } from './client';

// Apple 로그인 (Identity Token 방식)
export const signInWithApple = async (identityToken: string) => {
  try {
    console.log('Apple Identity Token으로 Supabase 인증 시작');
    
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: identityToken,
    });
    
    if (error) {
      console.error('Apple Supabase 인증 오류:', error);
      throw error;
    }
    
    console.log('Apple 로그인 성공:', data.user?.email);
    return data;
  } catch (error) {
    console.error('signInWithApple 오류:', error);
    throw error;
  }
};

export const signInWithGoogle = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: 'kogem://auth/callback', // 올바른 딥링크로 변경
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      }
    },
  });
  
  if (error) {
    console.error('Supabase OAuth 오류:', error);
    throw error;
  }
  
  return data;
};

// OAuth 콜백에서 받은 토큰으로 세션 설정
export const setSessionFromUrl = async (url: string) => {
  try {
    console.log('URL에서 세션 설정 시도:', url);
    console.log('🔍 Supabase URL:', process.env.EXPO_PUBLIC_SUPABASE_URL);
    console.log('🔍 Supabase Key 앞부분:', process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 30) + '...');
    
    // URL에서 파라미터 추출
    const urlObj = new URL(url);
    let params: URLSearchParams;
    
    if (urlObj.hash) {
      // # 형태의 파라미터 처리
      params = new URLSearchParams(urlObj.hash.substring(1));
    } else {
      // ? 형태의 파라미터 처리
      params = new URLSearchParams(urlObj.search);
    }
    
    const accessToken = params.get('access_token');
    const refreshToken = params.get('refresh_token');
    const expiresIn = params.get('expires_in');
    
    if (accessToken && refreshToken) {
      console.log('토큰으로 세션 설정 중...');
      console.log('🔍 Access Token 앞부분:', accessToken.substring(0, 50) + '...');
      console.log('🔍 Refresh Token:', refreshToken);
      
      // 먼저 간단한 API 호출로 클라이언트 테스트
      console.log('🧪 클라이언트 기본 테스트 시작...');
      try {
        const { data: testData, error: testError } = await supabase.auth.getSession();
        console.log('🧪 getSession 결과:', { 
          hasData: !!testData, 
          hasUser: !!testData?.session?.user,
          error: testError 
        });
      } catch (testErr) {
        console.log('🧪 getSession 오류:', testErr);
      }
      
      // setSession 시도
      console.log('🧪 setSession 시도...');
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (error) {
        console.error('🧪 setSession 오류 상세:', {
          message: error.message,
          status: error.status,
          statusText: error.statusText,
          name: error.name,
          stack: error.stack
        });
        throw error;
      }
      
      console.log('✅ setSession 성공!', data.user?.email);
      return data;
      
    } else {
      throw new Error('토큰을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('setSessionFromUrl 오류:', error);
    throw error;
  }
};