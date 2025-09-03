import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { WebView } from 'react-native-webview';
import * as WebBrowser from 'expo-web-browser';
import { useRouter } from 'expo-router';

interface OAuthWebViewProps {
  url: string;
  onSuccess?: (result: any) => void;
  onError?: (error: any) => void;
  onClose?: () => void;
}

export function OAuthWebView({ url, onSuccess, onError, onClose }: OAuthWebViewProps) {
  const [isVisible, setIsVisible] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (url) {
      openAuthSession();
    }
  }, [url]);

  const openAuthSession = async () => {
    try {
      setIsVisible(true);
      
      const result = await WebBrowser.openAuthSessionAsync(
        url,
        'kogem://auth/callback', // 리다이렉트 URL
        {
          showInRecents: false,
          preferEphemeralSession: true,
        }
      );

      if (result.type === 'success') {
        // URL에서 토큰 추출
        const urlParams = new URLSearchParams(result.url.split('?')[1]);
        const accessToken = urlParams.get('access_token');
        const refreshToken = urlParams.get('refresh_token');
        const error = urlParams.get('error');

        if (error) {
          onError?.(error);
          Alert.alert('로그인 실패', '인증 중 오류가 발생했습니다.');
        } else if (accessToken) {
          onSuccess?.({
            accessToken,
            refreshToken,
            provider: 'google'
          });
          Alert.alert('로그인 성공', 'Google 로그인이 완료되었습니다.');
        }
      } else if (result.type === 'cancel') {
        onClose?.();
      }
    } catch (error) {
      console.error('OAuth error:', error);
      onError?.(error);
      Alert.alert('오류', '로그인 중 오류가 발생했습니다.');
    } finally {
      setIsVisible(false);
    }
  };

  // WebView를 사용하는 대신 WebBrowser를 사용하므로 빈 View 반환
  return <View style={styles.container} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
