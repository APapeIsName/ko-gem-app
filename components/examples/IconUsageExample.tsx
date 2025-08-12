import { IconSymbol } from '@/components/ui/IconSymbol';
import { LOCATION_ICONS, NAVIGATION_ICONS, UI_ICONS } from '@/data';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

/**
 * IconSymbol 사용 예시 컴포넌트
 * 다양한 아이콘 세트와 아이콘들을 사용하는 방법을 보여줍니다.
 */
export function IconUsageExample() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>아이콘 사용 예시</Text>
      
      {/* 기본 MaterialIcons 사용 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>기본 아이콘들</Text>
        <View style={styles.iconRow}>
          <IconSymbol name={NAVIGATION_ICONS.HOME} size={24} color="#007AFF" />
          <IconSymbol name={NAVIGATION_ICONS.SEARCH} size={24} color="#007AFF" />
          <IconSymbol name={NAVIGATION_ICONS.SETTINGS} size={24} color="#007AFF" />
          <IconSymbol name={UI_ICONS.FAVORITE} size={24} color="#007AFF" />
        </View>
      </View>

      {/* 위치 권한 관련 아이콘들 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>위치 권한 아이콘들</Text>
        <View style={styles.iconRow}>
          <IconSymbol name={LOCATION_ICONS.LOCATION} size={24} color="#34C759" />
          <IconSymbol name={LOCATION_ICONS.LOCATION_ON} size={24} color="#34C759" />
          <IconSymbol name={LOCATION_ICONS.LOCATION_OFF} size={24} color="#FF3B30" />
          <IconSymbol name={LOCATION_ICONS.GPS_FIXED} size={24} color="#34C759" />
        </View>
      </View>

      {/* 다른 아이콘 세트 사용 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>다른 아이콘 세트</Text>
        <View style={styles.iconRow}>
          <IconSymbol iconSet="Ionicons" name="heart" size={24} color="#FF3B30" />
          <IconSymbol iconSet="FontAwesome" name="star" size={24} color="#FF9500" />
          <IconSymbol iconSet="Feather" name="map-pin" size={24} color="#007AFF" />
          <IconSymbol iconSet="AntDesign" name="like1" size={24} color="#34C759" />
        </View>
      </View>

      {/* 카테고리별 아이콘들 */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>카테고리 아이콘들</Text>
        <View style={styles.iconRow}>
          <IconSymbol name="restaurant" size={24} color="#FF6B6B" />
          <IconSymbol name="local-cafe" size={24} color="#4ECDC4" />
          <IconSymbol name="museum" size={24} color="#45B7D1" />
          <IconSymbol name="shopping-bag" size={24} color="#96CEB4" />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  iconRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 10,
  },
});
