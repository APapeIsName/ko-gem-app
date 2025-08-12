import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { Header } from '@/components/common/Header';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';

export default function ExploreScreen() {
  return (
    <ThemedView style={styles.container}>
      <Header title="탐색" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedView style={styles.searchSection}>
            <ThemedView style={styles.searchBar}>
              <IconSymbol name={NAVIGATION_ICONS.SEARCH} size={20} color="#687076" />
              <ThemedText style={styles.searchPlaceholder}>장소, 키워드로 검색해보세요</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>인기 검색어</ThemedText>
            <ThemedView style={styles.tagsContainer}>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>#한강공원</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>#남산타워</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>#홍대거리</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>#강남역</ThemedText>
              </ThemedView>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>최근 검색</ThemedText>
            <ThemedView style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>명동 거리</ThemedText>
            </ThemedView>
            <ThemedView style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>이태원</ThemedText>
            </ThemedView>
            <ThemedView style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>동대문 시장</ThemedText>
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
  searchSection: {
    marginBottom: 30,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 12,
    gap: 12,
  },
  searchPlaceholder: {
    fontSize: 16,
    color: '#687076',
    flex: 1,
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#687076',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  recentText: {
    fontSize: 16,
    color: '#11181C',
  },
});
