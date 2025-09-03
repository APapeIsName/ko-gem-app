import { AuthPlatformButton } from '@/components/auth/login/AuthPlatformButton';
import { OAuthWebView } from '@/components/auth/OAuthWebView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { AuthService } from '@/services/auth/authService';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { height } = Dimensions.get('window');

export default function LoginScreen() {
  const router = useRouter();
  const [oauthUrl, setOauthUrl] = useState<string>('');

  const handleGoogleLogin = async () => {
    try {
      console.log('Google 로그인 시작');
      const result = await AuthService.signInWithGoogle();
      console.log('OAuth URL:', result.url);
      
      if (result.url) {
        setOauthUrl(result.url);
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);
    }
  };

  const handleAppleLogin = () => {
    // TODO: Apple OAuth 로그인 구현
    console.log('Apple 로그인');
  };

  const handleOAuthSuccess = (result: any) => {
    console.log('OAuth 성공:', result);
    // 로그인 성공 후 메인 화면으로 이동
    router.replace('/(tabs)');
  };

  const handleOAuthError = (error: any) => {
    console.error('OAuth 오류:', error);
    setOauthUrl('');
  };

  const handleOAuthClose = () => {
    console.log('OAuth 취소됨');
    setOauthUrl('');
  };

  return (
    <ThemedView style={styles.container}>
      {/* KoGem 로고 */}
      <View style={styles.logoContainer}>
        <ThemedText style={styles.logoText}>KoGem</ThemedText>
      </View>

      {/* 로그인 버튼들 */}
      <View style={styles.buttonContainer}>
        <AuthPlatformButton 
          platform="google" 
          onPress={handleGoogleLogin} 
          platformName="Google"
          backgroundColor="#FFFFFF"
          textColor="#000000"
          logoImage={require('@/assets/images/logo-google.png')}
        />
        {/* <AuthPlatformButton 
          platform="apple" 
          onPress={handleAppleLogin} 
          platformName="Apple"
          backgroundColor="#000000"
          textColor="#FFFFFF"
          logoImage={require('@/assets/images/logo-apple.png')}
        /> */}
      </View>

      {/* OAuth 웹뷰 */}
      {oauthUrl && (
        <OAuthWebView
          url={oauthUrl}
          onSuccess={handleOAuthSuccess}
          onError={handleOAuthError}
          onClose={handleOAuthClose}
        />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  logoContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 48,
    fontWeight: '700',
    color: '#10B981', // 초록색
    letterSpacing: 2,
  },
  buttonContainer: {
    width: '100%',
    paddingBottom: 50, // 하단 여백
    gap: 16, // 버튼 간격
  },
});
