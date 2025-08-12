import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { IconSymbol } from '../ui/IconSymbol';

interface HeaderProps {
  /** 헤더 제목 (기존 호환성을 위해 유지) */
  title?: string;
  /** 왼쪽 아이콘 (기존 호환성을 위해 유지) */
  leftIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 오른쪽 아이콘 (기존 호환성을 위해 유지) */
  rightIcon?: {
    name: string;
    onPress: () => void;
    color?: string;
  };
  /** 왼쪽 영역에 렌더링할 컴포넌트 */
  leftComponent?: React.ReactNode;
  /** 오른쪽 영역에 렌더링할 컴포넌트 */
  rightComponent?: React.ReactNode;
  /** 헤더 스타일 */
  style?: any;
  /** 제목 스타일 */
  titleStyle?: any;
  /** SafeAreaView 사용 여부 (기본값: true) */
  useSafeArea?: boolean;
}

/**
 * 유연한 헤더 컴포넌트
 * children을 사용하여 왼쪽/오른쪽 컴포넌트를 자유롭게 구성할 수 있으며,
 * 기존 props도 지원하여 하위 호환성을 보장합니다.
 */
export function Header({ 
  title, 
  leftIcon, 
  rightIcon,
  leftComponent,
  rightComponent,
  style, 
  titleStyle,
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

  // 왼쪽 영역 렌더링 (leftComponent 우선, 없으면 기존 leftIcon + title)
  const renderLeftArea = () => {
    if (leftComponent) {
      return leftComponent;
    }
    
    return (
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
        
        {title && (
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
        )}
      </View>
    );
  };

  // 오른쪽 영역 렌더링 (rightComponent 우선, 없으면 기존 rightIcon)
  const renderRightArea = () => {
    if (rightComponent) {
      return rightComponent;
    }
    
    if (rightIcon) {
      return (
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
      );
    }
    
    return null;
  };

  return (
    <ThemedView style={containerStyle}>
      {/* 왼쪽 영역 */}
      {renderLeftArea()}

      {/* 오른쪽 영역 */}
      {renderRightArea()}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between', // space-between으로 변경하여 양쪽 끝에 배치
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    minHeight: 56, 
  },
  // 왼쪽 컨테이너: leftIcon과 title을 가로로 정렬
  leftContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1, // 남은 공간을 모두 차지
  },
  // 제목 스타일
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    flex: 0, // flex: 0으로 설정하여 필요한 만큼만 차지
    textAlign: 'left',  
    // 제목이 너무 길 경우를 대비한 최대 너비 설정
    maxWidth: '60%',
  },
  iconButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
