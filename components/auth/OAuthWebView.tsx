import React, { useRef, useState } from 'react';
import { Alert, Modal, StyleSheet, View } from 'react-native';
import { WebView } from 'react-native-webview';
import { ThemedText } from '../ThemedText';

interface OAuthWebViewProps {
  url: string;
  visible: boolean;
  onClose: () => void;
  onSuccess: (url: string) => void;
  onError: (error: string) => void;
}

export function OAuthWebView({ url, visible, onClose, onSuccess, onError }: OAuthWebViewProps) {
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

  const handleError = (error: any) => {
    console.error('WebView 오류:', error);
    onError('로그인 중 오류가 발생했습니다.');
    onClose();
  };

  const handleLoadStart = () => {
    console.log('WebView 로딩 시작');
    setLoading(true);
  };

  const handleLoadEnd = () => {
    console.log('WebView 로딩 완료');
    setLoading(false);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onClose}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <ThemedText style={styles.title}>Google 로그인</ThemedText>
          <ThemedText 
            style={styles.closeButton} 
            onPress={onClose}
          >
            닫기
          </ThemedText>
        </View>

        {loading && (
          <View style={styles.loadingContainer}>
            <ThemedText>로딩 중...</ThemedText>
          </View>
        )}

        <WebView
          ref={webViewRef}
          source={{ uri: url }}
          style={styles.webview}
          onNavigationStateChange={handleNavigationStateChange}
          onError={handleError}
          onLoadStart={handleLoadStart}
          onLoadEnd={handleLoadEnd}
          startInLoadingState={true}
          javaScriptEnabled={true}
          domStorageEnabled={true}
          sharedCookiesEnabled={true}
          thirdPartyCookiesEnabled={true}
        />
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
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