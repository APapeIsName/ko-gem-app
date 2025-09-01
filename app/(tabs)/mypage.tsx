import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React from 'react';
import { Dimensions, Image, ScrollView, StatusBar, StyleSheet } from 'react-native';

export default function MyPageScreen() {
  const { height } = Dimensions.get('window');
  const profileHeight = height * 0.33; // 화면 높이의 1/3

  return (
    <ThemedView style={styles.container}>
      {/* 상태바 설정 */}
      <StatusBar backgroundColor="#FFFFFF" barStyle="dark-content"/>
      
      {/* 프로필 섹션 */}
      <ThemedView style={[styles.profileSection, { height: profileHeight }]}>
        {/* 배경사진 영역 */}
        <ThemedView style={styles.backgroundImageContainer}>
          <Image 
            source={require('@/assets/images/splash-icon.png')} 
            style={styles.backgroundImage}
            resizeMode="cover"
          />
        </ThemedView>
        
        {/* 원형 프로필 사진 컨테이너 */}
        <ThemedView style={styles.profileImageContainer}>
          <ThemedView style={styles.profileImage}>
          <Image 
            source={require('@/assets/images/splash-icon.png')} 
            style={styles.backgroundImage}
            resizeMode="cover"
          />
          </ThemedView>
        </ThemedView>
        
        {/* 프로필 정보 */}
        <ThemedView style={styles.profileInfo}>
          <ThemedText style={styles.profileName}>사용자 이름</ThemedText>
        </ThemedView>
      </ThemedView>
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>앱</ThemedText>
            <ThemedView style={styles.menuItem}>
              <ThemedText style={styles.menuText}>언어 설정</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText style={styles.menuText}>알림 설정</ThemedText>
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
  profileSection: {
    backgroundColor: '#F8F9FA',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingTop: 50, // 상태바 높이 + 여유 공간
    position: 'relative',
  },
  backgroundImageContainer: {
    height: '100%',
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#D1D5DB',
    overflow: 'hidden', // 마진 문제 해결
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute', // 절대 위치로 설정
    top: 0,
    left: 0,
  },
  backgroundPlaceholder: {
    fontSize: 18,
    color: '#6B7280',
    fontWeight: '500',
  },
  profileImageContainer: {
    position: 'absolute',
    backgroundColor: 'transparent',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -40 }], // 원형 이미지 반지름만큼 왼쪽으로 이동
    zIndex: 10, // 맨 앞에 보이도록 높은 z-index 설정
  },
  profileImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#fff',
    borderWidth: 4,
    borderColor: '#10B981', // 약간 빛나는 연두색
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: 'hidden', // 원형 모양 완벽하게 만들기
  },
  profileImageText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontWeight: '500',
  },
  profileInfo: {
    position: 'absolute',
    bottom: -40, // 프로필 사진 아래로 이동
    left: 0,
    right: 0,
    alignItems: 'center',
    paddingTop: 50, // 원형 이미지 아래 여백
    zIndex: 2, // 프로필 이미지보다 위에 표시
  },
  profileName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  profileEmail: {
    fontSize: 14,
    color: '#6B7280',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
  },
  menuItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuText: {
    fontSize: 16,
    color: '#374151',
  },
});
