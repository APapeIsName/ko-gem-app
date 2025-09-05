import { DeepLinkHandler } from '@/components/auth/DeepLinkHandler';
import { AuthPlatformButton } from '@/components/auth/login/AuthPlatformButton';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { setSessionFromUrl, signInWithGoogle } from '@/services/api/supabase/auth';
import { useRouter } from 'expo-router';
import React, { useRef, useState } from 'react';
import { Alert, Dimensions, Modal, Platform, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';

const { height } = Dimensions.get('window');

// 플랫폼별 User-Agent 생성
const getUserAgent = () => {
  if (Platform.OS === 'ios') {
    return 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.0 Mobile/15E148 Safari/604.1';
  } else {
    return 'Mozilla/5.0 (Linux; Android 10; SM-G975F) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.120 Mobile Safari/537.36';
  }
};

// 인라인 OAuthWebView 컴포넌트
interface OAuthWebViewProps {
  url: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  onError: (error: string) => void;
}

function OAuthWebView({ url, visible, onClose, onSuccess, onError }: OAuthWebViewProps) {
  const webViewRef = useRef<WebView>(null);
  const [loading, setLoading] = useState(true);

  const handleNavigationStateChange = (navState: any) => {
    console.log('WebView 네비게이션:', navState.url);

    // 딥링크 콜백 URL 확인
    if (navState.url.includes('kogem://auth/callback')) {
      console.log('OAuth 콜백 감지:', navState.url);
      onSuccess(navState.url);
      onClose();
    }
  };

  const handleShouldStartLoadWithRequest = (request: any) => {
    console.log('WebView 로드 요청:', request.url);
    
    // 커스텀 스키마 URL은 WebView에서 로드하지 않고 직접 처리
    if (request.url.includes('kogem://auth/callback')) {
      console.log('커스텀 스키마 콜백 감지, 직접 처리');
      onSuccess(request.url);
      onClose();
      return false; // WebView에서 로드하지 않음
    }
    
    return true; // 다른 URL은 정상적으로 로드
  };

  const handleError = (error: any) => {
    // 커스텀 스키마 리다이렉트 오류는 정상적인 OAuth 플로우의 일부
    if (error.nativeEvent?.description?.includes('scheme that is not HTTP')) {
      console.log('OAuth 콜백 리다이렉트 완료 - WebView 닫는 중');
      // 오류로 처리하지 않고 WebView만 닫기
      onClose();
      return;
    }
    
    // 실제 오류인 경우에만 로그 출력
    console.error('WebView 실제 오류:', error);
    onError('로그인 중 오류가 발생했습니다.');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={webViewStyles.container}>
        <View style={webViewStyles.header}>
          <ThemedText style={webViewStyles.title}>Google 로그인</ThemedText>
          <ThemedText 
            style={webViewStyles.closeButton} 
            onPress={onClose}
          >
            닫기
          </ThemedText>
        </View>

        {loading && (
          <View style={webViewStyles.loadingContainer}>
            <ThemedText>로딩 중...</ThemedText>
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={webViewStyles.webview}
          onNavigationStateChange={handleNavigationStateChange}
          onShouldStartLoadWithRequest={handleShouldStartLoadWithRequest}
          onError={handleError}
          onLoadStart={() => setLoading(true)}
          onLoadEnd={() => setLoading(false)}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          userAgent={getUserAgent()}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
          allowsInlineMediaPlayback={true}
          mediaPlaybackRequiresUserAction={false}
          mixedContentMode="compatibility"
          originWhitelist={['*']}
          allowsBackForwardNavigationGestures={true}
        />
      </View>
    </Modal>
  );
}

export default function LoginScreen() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showWebView, setShowWebView] = useState(false);
  const [oauthUrl, setOauthUrl] = useState('');

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      console.log('Google OAuth WebView 로그인 시작');
      
      // Supabase OAuth URL 생성
      const result = await signInWithGoogle();
      console.log('OAuth 결과:', result);
      
      if (result && result.url) {
        console.log('WebView로 OAuth URL 열기:', result.url);
        
        // WebView로 OAuth URL 열기
        setOauthUrl(result.url);
        setShowWebView(true);
        setIsLoading(false);
      } else {
        console.error('OAuth URL을 받을 수 없음');
        Alert.alert('오류', 'OAuth URL을 생성할 수 없습니다.');
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google 로그인 오류:', error);
      Alert.alert('오류', `Google 로그인 중 오류: ${(error as Error).message || error}`);
      setIsLoading(false);
    }
  };

  const handleAppleLogin = () => {
    // TODO: Apple OAuth 로그인 구현
    console.log('Apple 로그인');
  };

  const handleDeepLinkSuccess = async (url: string) => {
    console.log('딥링크 OAuth 성공:', url);
    
    try {
      setIsLoading(true);
      
      // Supabase 세션 설정
      const sessionData = await setSessionFromUrl(url);
      console.log('세션 설정 완료:', sessionData.user?.email);
      
      setIsLoading(false);
      Alert.alert('로그인 성공', `${sessionData.user?.email}로 로그인되었습니다!`, [
        { text: '확인', onPress: () => router.replace('/(tabs)') }
      ]);
    } catch (error) {
      console.error('세션 설정 실패:', error);
      setIsLoading(false);
      Alert.alert('로그인 실패', `세션 설정 중 오류가 발생했습니다: ${(error as Error).message || error}`);
    }
  };

  const handleDeepLinkError = (error: string) => {
    console.error('딥링크 OAuth 오류:', error);
    setIsLoading(false);
    Alert.alert('로그인 실패', error);
  };

  const handleWebViewClose = () => {
    console.log('WebView 닫기');
    setShowWebView(false);
    setOauthUrl('');
  };

  const handleWebViewSuccess = (url: string) => {
    console.log('WebView OAuth 성공:', url);
    setShowWebView(false);
    setOauthUrl('');
    setIsLoading(false);
    
    // 수동으로 딥링크 핸들러 호출
    handleDeepLinkSuccess(url);
  };

  const handleWebViewError = (error: string) => {
    console.error('WebView OAuth 오류:', error);
    setShowWebView(false);
    setOauthUrl('');
    setIsLoading(false);
    // 커스텀 스키마 리다이렉트 오류가 아닌 경우에만 알림 표시
    if (!error.includes('커스텀 스키마 리다이렉트')) {
      Alert.alert('로그인 실패', error);
    }
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
          platformName={isLoading ? "로그인 중..." : "Google"}
          backgroundColor={isLoading ? "#E5E7EB" : "#FFFFFF"}
          textColor={isLoading ? "#9CA3AF" : "#000000"}
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

      {/* OAuth WebView */}
      <OAuthWebView
        url={oauthUrl}
        visible={showWebView}
        onClose={handleWebViewClose}
        onSuccess={handleWebViewSuccess}
        onError={handleWebViewError}
      />

      {/* 딥링크 핸들러 */}
      <DeepLinkHandler
        onAuthSuccess={handleDeepLinkSuccess}
        onAuthError={handleDeepLinkError}
      />
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

const webViewStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    paddingTop: 60, // 상태바 고려
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
  },
  closeButton: {
    fontSize: 16,
    color: '#007AFF',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -50 }, { translateY: -50 }],
    zIndex: 1,
  },
  webview: {
    flex: 1,
  },
});
