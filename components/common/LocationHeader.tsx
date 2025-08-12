import { LOCATION_ICONS, UI_ICONS } from '@/data';
import { PlaceCity } from '@/store/types/places';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';
import { Header } from './Header';

interface LocationHeaderProps {
  location?: PlaceCity;
  onLocationPress?: () => void;
  onMapPress?: () => void;
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
  useSafeArea = true
}: LocationHeaderProps) {
  // 왼쪽 영역: 위치 정보
  const leftComponent = (
    <View style={styles.locationContainer}>
      <TouchableOpacity 
        style={styles.locationButton} 
        onPress={onLocationPress || (() => console.log('위치 선택'))}
        activeOpacity={0.7}
      >
        <IconSymbol name={LOCATION_ICONS.LOCATION_ON} size={20} color="#687076" />
        <ThemedText style={styles.locationText}>{location.toString()}</ThemedText>
        <IconSymbol name="keyboard-arrow-down" size={18} color="#687076" />
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
    <Header
      useSafeArea={useSafeArea}
      leftComponent={leftComponent}
      rightComponent={rightComponent}
    />
  );
}

const styles = StyleSheet.create({
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
