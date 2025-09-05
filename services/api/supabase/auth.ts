import { supabase } from './client';

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
      
      const { data, error } = await supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken,
      });
      
      if (error) {
        console.error('세션 설정 오류:', error);
        throw error;
      }
      
      console.log('세션 설정 성공:', data.user?.email);
      return data;
    } else {
      throw new Error('토큰을 찾을 수 없습니다.');
    }
  } catch (error) {
    console.error('setSessionFromUrl 오류:', error);
    throw error;
  }
};