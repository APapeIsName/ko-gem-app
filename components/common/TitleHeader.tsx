import React from 'react';
import { StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { Header } from './Header';

interface TitleHeaderProps {
  /** 헤더 제목 */
  title: string;
  /** 제목 스타일 */
  titleStyle?: any;
  /** SafeAreaView 사용 여부 */
  useSafeArea?: boolean;
}

/**
 * 제목만 있는 기본 헤더 컴포넌트
 */
export function TitleHeader({ 
  title, 
  titleStyle, 
  useSafeArea = true 
}: TitleHeaderProps) {
  const leftComponent = (
    <ThemedText 
      style={[styles.title, titleStyle]} 
      numberOfLines={1}
    >
      {title}
    </ThemedText>
  );

  return (
    <Header
      useSafeArea={useSafeArea}
      leftComponent={leftComponent}
    />
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    flex: 1,
    textAlign: 'left',
  },
});
