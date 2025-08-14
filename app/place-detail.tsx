import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function PlaceDetailScreen() {
  const router = useRouter();
  const { id, title, subtitle, image, overlay, category } = useLocalSearchParams();

  const handleBackPress = () => {
    router.back();
  };

  // 이미지 소스 처리
  const getImageSource = () => {
    if (typeof image === 'string') {
      return { uri: image };
    }
    return image;
  };

  return (
    <ThemedView style={styles.container}>
      {/* 상단 헤더 */}
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow-back" size={24} color="#11181C" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* 메인 이미지 */}
        <View style={styles.imageContainer}>
          <Image 
            source={getImageSource()} 
            style={styles.mainImage} 
            contentFit="cover" 
          />
          {overlay && (
            <View style={styles.overlay}>
              <ThemedText style={styles.overlayText}>{overlay}</ThemedText>
            </View>
          )}
        </View>

        {/* 장소 정보 */}
        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          <ThemedText style={styles.category}>{category}</ThemedText>
          
          {/* 추가 정보 섹션 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>장소 소개</ThemedText>
            <ThemedText style={styles.description}>
              이곳은 아름다운 경관과 함께 다양한 문화적 경험을 제공하는 특별한 장소입니다. 
              방문자들에게 잊을 수 없는 추억을 선사하며, 지역의 대표적인 명소로 자리잡고 있습니다.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>방문 정보</ThemedText>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="schedule" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>운영시간: 09:00 - 18:00</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="location-on" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>주소: 서울특별시 강남구</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="phone" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>전화: 02-1234-5678</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* 근처 행사 섹션 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>근처에서 진행되는 행사</ThemedText>
            <ThemedView style={styles.nearbyEventsPlaceholder}>
              <IconSymbol name="event" size={48} color="#E9ECEF" />
              <ThemedText style={styles.placeholderText}>근처 행사 정보가 여기에 표시됩니다</ThemedText>
            </ThemedView>
          </ThemedView>
        </ThemedView>

        {/* 맵 섹션 */}
        <ThemedView style={styles.mapSection}>
          <ThemedText style={styles.sectionTitle}>위치</ThemedText>
          <ThemedView style={styles.mapPlaceholder}>
            <IconSymbol name="map" size={48} color="#E9ECEF" />
            <ThemedText style={styles.placeholderText}>지도가 여기에 표시됩니다</ThemedText>
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    zIndex: 1000,
  },
  backButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200, // 300에서 200으로 줄임
  },
  mainImage: {
    width: '100%',
    height: '100%',
  },
  overlay: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  infoContainer: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    color: '#687076',
    marginBottom: 24,
  },
  category: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
  },
  description: {
    fontSize: 16,
    color: '#11181C',
    lineHeight: 24,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    gap: 12,
  },
  infoText: {
    fontSize: 16,
    color: '#11181C',
  },
  nearbyEventsPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  placeholderText: {
    marginTop: 10,
    color: '#687076',
    fontSize: 14,
  },
  mapSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 32,
  },
  mapPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
});
