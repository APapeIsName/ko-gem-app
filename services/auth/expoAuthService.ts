import * as AuthSession from 'expo-auth-session';
import * as Crypto from 'expo-crypto';
import { supabase } from '../api/supabase/client';

// Google OAuth 설정
const GOOGLE_CLIENT_ID = process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID;

export const signInWithGoogleAuthSession = async () => {
  try {
    console.log('Expo AuthSession으로 Google 로그인 시작');

    // 리다이렉트 URI 생성 (더 안정적인 방식)
    const redirectUri = AuthSession.makeRedirectUri({
      scheme: 'kogem'
    });
    
    console.log('리다이렉트 URI:', redirectUri);

    // Google OAuth 요청 설정 (PKCE 없이 단순화)
    const request = new AuthSession.AuthRequest({
      clientId: GOOGLE_CLIENT_ID!,
      scopes: ['openid', 'profile', 'email'],
      redirectUri,
      responseType: AuthSession.ResponseType.Code,
      additionalParameters: {
        access_type: 'offline',
        prompt: 'consent',
      },
    });

    console.log('AuthSession 요청 설정 완료');

    // Google OAuth 서버 URL
    const discovery = {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
    };

    // OAuth 인증 시작
    const result = await request.promptAsync(discovery);
    
    console.log('OAuth 결과:', result);

    if (result.type === 'success') {
      console.log('OAuth 성공!');
      console.log('OAuth 파라미터:', result.params);
      
      // 성공으로 처리 (세션은 나중에 구현)
      return { success: true, params: result.params };
      
    } else if (result.type === 'cancel') {
      console.log('사용자가 OAuth 취소');
      return { success: false, error: 'cancelled' };
    } else {
      console.error('OAuth 실패:', result);
      return { success: false, error: 'failed' };
    }

  } catch (error) {
    console.error('Expo AuthSession 오류:', error);
    throw error;
  }
};
