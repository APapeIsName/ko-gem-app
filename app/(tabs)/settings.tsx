import React from 'react';
import { StyleSheet, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';

export default function SettingsScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <ThemedView style={styles.header}>
            <ThemedText style={styles.title}>설정</ThemedText>
          </ThemedView>
          
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
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    color: '#11181C',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  menuItem: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
});
