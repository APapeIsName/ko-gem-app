import React from 'react';
import { StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedView } from '../ThemedView';

interface HeaderProps {
  /** 왼쪽 영역에 렌더링할 컴포넌트 */
  leftComponent?: React.ReactNode;
  /** 오른쪽 영역에 렌더링할 컴포넌트 */
  rightComponent?: React.ReactNode;
  /** 헤더 스타일 */
  style?: any;
  /** SafeAreaView 사용 여부 (기본값: true) */
  useSafeArea?: boolean;
}

/**
 * 완전히 유연한 헤더 컴포넌트
 * leftComponent와 rightComponent만을 사용하여 자유롭게 구성할 수 있습니다.
 * title은 외부에서 leftComponent나 rightComponent에 포함하여 사용합니다.
 */
export function Header({ 
  leftComponent,
  rightComponent,
  style, 
  useSafeArea = true
}: HeaderProps) {
  const insets = useSafeAreaInsets();
  
  // SafeAreaView 사용 여부에 따른 상단 여백 계산
  const topPadding = useSafeArea ? insets.top + 16 : 16;
  
  const containerStyle = [
    styles.container,
    { paddingTop: topPadding },
    style
  ];

  return (
    <ThemedView style={containerStyle}>
      {/* 왼쪽 영역 */}
      {leftComponent}

      {/* 오른쪽 영역 */}
      {rightComponent}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', 
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 56, 
  },
});
