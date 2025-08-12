import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { Header } from './Header';

interface IconTitleHeaderProps {
  /** 헤더 제목 */
  title: string;
  /** 왼쪽 아이콘 */
  leftIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 오른쪽 아이콘 */
  rightIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 제목 스타일 */
  titleStyle?: any;
  /** SafeAreaView 사용 여부 */
  useSafeArea?: boolean;
}

/**
 * 아이콘과 제목이 있는 헤더 컴포넌트
 */
export function IconTitleHeader({ 
  title, 
  leftIcon, 
  rightIcon, 
  titleStyle, 
  useSafeArea = true 
}: IconTitleHeaderProps) {
  const leftComponent = (
    <View style={styles.leftContainer}>
      {leftIcon && (
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
      )}
      
      <ThemedText 
        style={[
          styles.title, 
          titleStyle,
          { marginLeft: leftIcon ? 16 : 0 }
        ]} 
        numberOfLines={1}
      >
        {title}
      </ThemedText>
    </View>
  );

  const rightComponent = rightIcon ? (
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
  ) : undefined;

  return (
    <Header
      useSafeArea={useSafeArea}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
    />
  );
}

const styles = StyleSheet.create({
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    flex: 0,
    textAlign: 'left',
    maxWidth: '60%',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
