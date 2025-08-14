import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function EventDetailScreen() {
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

        {/* 행사 정보 */}
        <ThemedView style={styles.infoContainer}>
          <ThemedText style={styles.title}>{title}</ThemedText>
          <ThemedText style={styles.subtitle}>{subtitle}</ThemedText>
          <ThemedText style={styles.category}>{category}</ThemedText>
          
          {/* 행사 상세 정보 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>행사 소개</ThemedText>
            <ThemedText style={styles.description}>
              이 행사는 특별한 경험과 즐거움을 제공하는 이벤트입니다. 
              다양한 활동과 프로그램을 통해 참가자들에게 잊을 수 없는 추억을 선사합니다.
            </ThemedText>
          </ThemedView>

          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>행사 정보</ThemedText>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="schedule" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>일시: 2024년 4월 15일 - 4월 20일</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="location-on" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>장소: 서울특별시 강남구</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="person" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>참가비: 무료</ThemedText>
            </ThemedView>
            <ThemedView style={styles.infoItem}>
              <IconSymbol name="phone" size={20} color="#687076" />
              <ThemedText style={styles.infoText}>문의: 02-1234-5678</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* 행사 사진 섹션 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>행사 사진</ThemedText>
            <ThemedView style={styles.eventPhotosPlaceholder}>
              <IconSymbol name="photo-library" size={48} color="#E9ECEF" />
              <ThemedText style={styles.placeholderText}>행사 사진들이 여기에 표시됩니다</ThemedText>
            </ThemedView>
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
    height: 200,
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
    marginBottom: 8,
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
  eventPhotosPlaceholder: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  placeholderText: {
    marginTop: 10,
    color: '#687076',
    fontSize: 14,
  },
});
