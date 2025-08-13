import { LOCATION_ICONS, UI_ICONS } from '@/data';
import { PlaceCity } from '@/store/types/places';
import React, { useRef, useState } from 'react';
import { Animated, Easing, StyleSheet, TouchableOpacity, View } from 'react-native';
import { HeaderDropdown } from '../home/list/HeaderDropdown';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { Header } from './Header';

// Android에서 LayoutAnimation 활성화
// if (Platform.OS === 'android') {
//   if (UIManager.setLayoutAnimationEnabledExperimental) {
//     UIManager.setLayoutAnimationEnabledExperimental(true);
//   }
// }

interface LocationHeaderProps {
  location?: PlaceCity;
  onLocationPress?: () => void;
  onMapPress?: () => void;
  onLocationChange?: (city: PlaceCity) => void;
  useSafeArea?: boolean;
}

/**
 * 위치 헤더 컴포넌트
 * Header 컴포넌트의 leftComponent와 rightComponent를 사용하여 구현합니다.
 */
export function LocationHeader({ 
  location = PlaceCity.ALL, 
  onLocationPress, 
  onMapPress,
  onLocationChange,
  useSafeArea = true
}: LocationHeaderProps) {
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;
  const isAnimating = useRef(false);

  const dropdownStyle = { 
    opacity: opacityAnim,
    transform: [
      {
        translateY: slideAnim.interpolate({
          inputRange: [0, 1],
          outputRange: [-30, 0],
        }),
      },
    ],
    zIndex: 1000,
  }

  const overlayStyle = {
    opacity: overlayAnim,
    zIndex: 999,
  }

  const onHeaderLayout = (event: any) => {
    const { height } = event.nativeEvent.layout;
    setHeaderHeight(height);
  };

  const handleLocationPress = () => {
    if (isAnimating.current) return;
    isAnimating.current = true;
    
    if (isDropdownVisible) {
      // 드롭다운을 숨기는 애니메이션
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 0,
          duration: 300,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        setIsDropdownVisible(false);
        isAnimating.current = false;
      });
    } else {
      // 드롭다운을 보이는 애니메이션
      setIsDropdownVisible(true);
      
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(overlayAnim, {
          toValue: 1,
          duration: 400,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start(() => {
        isAnimating.current = false;
      });
    }
  };

  const handleCitySelect = (city: PlaceCity) => {
    if (onLocationChange) {
      onLocationChange(city);
    }
    // 도시 선택 시 드롭다운을 숨기는 애니메이션
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0,
        duration: 300,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }),
    ]).start(() => {
      setIsDropdownVisible(false);
    });
  };

  // 왼쪽 영역: 위치 정보
  const leftComponent = (
    <View style={styles.locationContainer}>
      <TouchableOpacity 
        style={styles.locationButton} 
        onPress={handleLocationPress}
        activeOpacity={0.7}
      >
        <IconSymbol name={LOCATION_ICONS.LOCATION_ON} size={20} color="#687076" />
        <ThemedText style={styles.locationText}>{location.toString()}</ThemedText>
        <IconSymbol 
          name={isDropdownVisible ? "keyboard-arrow-up" : "keyboard-arrow-down"} 
          size={18} 
          color="#687076" 
        />
      </TouchableOpacity>
    </View>
  );

  // 오른쪽 영역: 지도 버튼
  const rightComponent = (
    <TouchableOpacity 
      style={styles.mapButton} 
      onPress={onMapPress || (() => console.log('지도 열기'))}
      activeOpacity={0.7}
    >
      <IconSymbol name={UI_ICONS.MAP} size={24} color="#687076" />
    </TouchableOpacity>
  );

  return (
    <>
      <Header
        useSafeArea={useSafeArea}
        leftComponent={leftComponent}
        rightComponent={rightComponent}
        style={styles.header} // 👈 zIndex 적용
        onLayout={onHeaderLayout}
      />
      
      {/* 도시 선택 드롭다운 */}
      {isDropdownVisible && (
        <Animated.View
          style={[styles.dropdown, dropdownStyle, { top: headerHeight }]} // 👈 zIndex 적용
        >
          <HeaderDropdown
            selectedCity={location}
            onCitySelect={handleCitySelect}
          />
        </Animated.View>
      )}
      
      {/* 반투명 배경 오버레이 */}
      {isDropdownVisible && (
        <Animated.View style={[styles.overlay, overlayStyle]}>
          <TouchableOpacity 
            style={styles.overlayTouchable}
            onPress={handleLocationPress}
            activeOpacity={1}
          />
        </Animated.View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    zIndex: 9999,
    elevation: 9999, // Android용
  },
  header: {
    zIndex: 10000, // 헤더를 가장 위에
    elevation: 10000, // Android용
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    zIndex: 9998,
    elevation: 9998, // Android용
  },
  overlayTouchable: {
    flex: 1,
  },
  dropdown: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 9999, // 헤더보다는 아래, 오버레이보다는 위
    elevation: 9999, // Android용
    // 그림자 효과 추가
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  locationText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#11181C',
  },
  mapButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
