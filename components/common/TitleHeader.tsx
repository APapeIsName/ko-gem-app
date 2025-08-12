import React from 'react';
import { StyleSheet, View } from 'react-native';
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
    <View style={styles.titleContainer}>
      <ThemedText 
        style={[styles.title, titleStyle]} 
        numberOfLines={1}
      >
        {title}
      </ThemedText>
    </View>
  );

  return (
    <Header
      useSafeArea={useSafeArea}
      leftComponent={leftComponent}
    />
  );
}

const styles = StyleSheet.create({
  titleContainer: {
    flex: 1,
    justifyContent: 'center',
    minHeight: 40, // LocationHeader의 아이콘 버튼 높이와 맞춤
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#11181C',
    textAlign: 'left',
  },
});
