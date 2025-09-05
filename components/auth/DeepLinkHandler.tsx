import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Linking, Platform } from 'react-native';

interface DeepLinkHandlerProps {
  onAuthSuccess?: (url: string) => void;
  onAuthError?: (error: string) => void;
}

export function DeepLinkHandler({ onAuthSuccess, onAuthError }: DeepLinkHandlerProps) {
  const router = useRouter();

  useEffect(() => {
    const handleDeepLink = (url: string) => {
      console.log('딥링크 수신:', url);
      console.log('딥링크 URL 타입:', typeof url);
      console.log('딥링크 URL 길이:', url.length);
      console.log('현재 플랫폼 (딥링크 핸들러):', Platform.OS);
      
      // 개발 서버 URL은 무시
      if (url.startsWith('exp://') || url.startsWith('exps://')) {
        console.log('개발 서버 딥링크 무시:', url);
        return;
      }
      
      console.log('딥링크 URL 포함 여부:', url.includes('kogem://auth/callback'));
      
      // OAuth 콜백 URL 확인
      if (url.includes('kogem://auth/callback')) {
        console.log('OAuth 콜백 딥링크 감지');
        try {
          // URL에서 파라미터 추출 (# 또는 ? 형태 모두 처리)
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
          const error = params.get('error');
          const errorDescription = params.get('error_description');

          console.log('파싱된 파라미터:', {
            accessToken: accessToken ? '있음' : '없음',
            refreshToken: refreshToken ? '있음' : '없음',
            error,
            errorDescription
          });

          if (error) {
            console.error('OAuth 오류:', error, errorDescription);
            onAuthError?.(errorDescription || error);
          } else if (accessToken) {
            console.log('OAuth 성공, 토큰 받음');
            console.log(`Platform: ${Platform.OS}, Access Token 길이: ${accessToken.length}`);
            onAuthSuccess?.(url);
            
            // 메인 화면으로 이동
            router.replace('/(tabs)');
          } else {
            console.log('토큰이 없음, URL 전체:', url);
            console.log('URL 구조 분석:', {
              hash: urlObj.hash,
              search: urlObj.search,
              pathname: urlObj.pathname
            });
            // 토큰이 없어도 성공으로 처리 (Supabase가 다른 방식으로 처리할 수 있음)
            onAuthSuccess?.(url);
          }
        } catch (err) {
          console.error('딥링크 파싱 오류:', err);
          onAuthError?.('URL 파싱 오류');
        }
      }
    };

    // 앱이 실행 중일 때 딥링크 처리
    const subscription = Linking.addEventListener('url', (event) => {
      handleDeepLink(event.url);
    });

    // 앱이 종료된 상태에서 딥링크로 실행된 경우
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url);
      }
    });

    return () => {
      subscription?.remove();
    };
  }, [onAuthSuccess, onAuthError, router]);

  return null; // UI를 렌더링하지 않음
}
