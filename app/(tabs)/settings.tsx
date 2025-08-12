import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/common/Header';

export default function SettingsScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header type="title" title="설정" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>계정</ThemedText>
            <ThemedView style={styles.menuItem}>
              <ThemedText>프로필 편집</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>알림 설정</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>개인정보 보호</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>앱</ThemedText>
            <ThemedView style={styles.menuItem}>
              <ThemedText>언어 설정</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>테마 설정</ThemedText>
            </ThemedView>
            <ThemedView style={styles.menuItem}>
              <ThemedText>버전 정보</ThemedText>
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
});
