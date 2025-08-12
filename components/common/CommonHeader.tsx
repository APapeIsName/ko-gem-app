import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';

interface CommonHeaderProps {
  /** 헤더 제목 */
  title: string;
  /** 왼쪽 아이콘 (선택사항) */
  leftIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 오른쪽 아이콘 (선택사항) */
  rightIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 헤더 스타일 */
  style?: any;
  /** 제목 스타일 */
  titleStyle?: any;
}

/**
 * 공통 헤더 컴포넌트
 * 각 탭에서 사용할 수 있는 일관된 헤더 디자인을 제공합니다.
 */
export function CommonHeader({ 
  title, 
  leftIcon, 
  rightIcon, 
  style, 
  titleStyle 
}: CommonHeaderProps) {
  return (
    <ThemedView style={[styles.container, style]}>
      {/* 왼쪽 아이콘 */}
      {leftIcon ? (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={leftIcon.onPress}
          activeOpacity={0.7}
        >
          <IconSymbol 
            name={leftIcon.name} 
            size={24} 
            color={leftIcon.color || '#687076'} 
          />
        </TouchableOpacity>
      ) : (
        <ThemedView style={styles.iconButton} />
      )}

      {/* 제목 */}
      <ThemedText style={[styles.title, titleStyle]} numberOfLines={1}>
        {title}
      </ThemedText>

      {/* 오른쪽 아이콘 */}
      {rightIcon ? (
        <TouchableOpacity 
          style={styles.iconButton} 
          onPress={rightIcon.onPress}
          activeOpacity={0.7}
        >
          <IconSymbol 
            name={rightIcon.name} 
            size={24} 
            color={rightIcon.color || '#687076'} 
          />
        </TouchableOpacity>
      ) : (
        <ThemedView style={styles.iconButton} />
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingTop: 20, // LocationHeader 아래 여백
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    flex: 1,
    textAlign: 'center',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
