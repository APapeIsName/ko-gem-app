import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { TitleHeader } from '@/components/common';
import React from 'react';
import { ScrollView, StyleSheet, Dimensions } from 'react-native';

export default function SettingsScreen() {
  const { height } = Dimensions.get('window');
  const profileHeight = height * 0.33; // 화면 높이의 1/3

  return (
    <ThemedView style={styles.container}>
      <TitleHeader title="설정" />
      
      {/* 프로필 섹션 */}
      <ThemedView style={[styles.profileSection, { height: profileHeight }]}>
        <ThemedText style={styles.profileText}>프로필</ThemedText>
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
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  profileText: {
    fontSize: 24,
    fontWeight: '600',
    color: '#374151',
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
