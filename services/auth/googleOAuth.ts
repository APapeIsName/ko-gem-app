import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { Platform } from 'react-native';

// WebBrowser 설정
WebBrowser.maybeCompleteAuthSession();

const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export const googleOAuthConfig = {
  clientId: GOOGLE_CLIENT_ID!,
  scopes: ['openid', 'profile', 'email'],
  additionalParameters: {},
  customParameters: {},
};

export const signInWithGoogleOAuth = async () => {
  try {
    console.log('Google OAuth 시작');
    
    // 리다이렉트 URI 생성
    const redirectUri = AuthSession.makeRedirectUri({
      useProxy: true, // Expo 프록시 사용
    });
    
    console.log('리다이렉트 URI:', redirectUri);

    // Google OAuth 요청
    const request = new AuthSession.AuthRequest({
      clientId: googleOAuthConfig.clientId,
      scopes: googleOAuthConfig.scopes,
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      state: AuthSession.AuthRequest.createRandomCodeChallenge(),
    });

    // Google 디스커버리 문서
    const discovery = AuthSession.useAutoDiscovery(
      'https://accounts.google.com'
    );

    // OAuth 프롬프트 실행
    const result = await request.promptAsync(discovery);
    
    console.log('OAuth 결과:', result);

    if (result.type === 'success') {
      console.log('Google OAuth 성공');
      return {
        success: true,
        code: result.params.code,
        state: result.params.state,
      };
    } else if (result.type === 'cancel') {
      console.log('사용자가 OAuth 취소');
      return { success: false, error: 'cancelled' };
    } else {
      console.error('OAuth 실패:', result);
      return { success: false, error: 'failed' };
    }

  } catch (error) {
    console.error('Google OAuth 오류:', error);
    throw error;
  }
};

// 간단한 테스트용 함수
export const testGoogleLogin = async () => {
  console.log('Google 로그인 테스트 시작');
  
  // 2초 후 성공 시뮬레이션
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('테스트 로그인 성공');
      resolve({ success: true, user: { email: 'test@gmail.com', name: '테스트 사용자' } });
    }, 2000);
  });
};
