import { ThemedText } from '@/components/ThemedText';
import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

interface AuthPlatformButtonProps {
  platform: 'google' | 'apple';
  onPress: () => void;
  logoImage?: any; // 이미지 소스 (require() 또는 uri)
  platformName?: string; // 플랫폼 이름 (기본값: platform에 따라 자동 설정)
  backgroundColor?: string; // 버튼 배경색 (기본값: '#FFFFFF')
  textColor?: string; // 글자색 (기본값: '#11181C')
}

export function AuthPlatformButton({ 
  platform, 
  onPress, 
  logoImage, 
  platformName, 
  backgroundColor = '#FFFFFF', 
  textColor = '#11181C' 
}: AuthPlatformButtonProps) {
  const getPlatformInfo = () => {
    const getDefaultPlatformName = () => {
      switch (platform) {
        case 'google':
          return 'Google';
        case 'apple':
          return 'Apple';
        default:
          return '';
      }
    };

    const name = platformName || getDefaultPlatformName();
    const text = `${name} (으)로 로그인하기`;

    switch (platform) {
      case 'google':
        return {
          logo: 'G', // 기본값: Google 로고 텍스트
          text,
        };
      case 'apple':
        return {
          logo: '🍎', // 기본값: Apple 로고 이모지
          text,
        };
      default:
        return {
          logo: '',
          text: '',
        };
    }
  };

  const { logo, text } = getPlatformInfo();

  return (
    <TouchableOpacity 
      style={[styles.loginButton, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <View style={styles.buttonContent}>
        {/* 플랫폼 로고 자리 */}
        <View style={styles.logoPlaceholder}>
          {logoImage ? (
            <Image source={logoImage} style={styles.logoImage} resizeMode="cover" />
          ) : (
            <ThemedText style={styles.logoPlaceholderText}>{logo}</ThemedText>
          )}
        </View>
        {/* 텍스트는 가운데 정렬 */}
        <View style={styles.textContainer}>
          <ThemedText style={[styles.buttonText, { color: textColor }]}>{text}</ThemedText>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  loginButton: {
    width: '100%',
    height: 56,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  buttonContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logoPlaceholder: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    // TODO: 실제 로고 이미지로 교체 예정
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: -24, // 로고 너비만큼 왼쪽으로 이동하여 가운데 정렬
  },
  logoPlaceholderText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoImage: {
    width: 24,
    height: 24,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});