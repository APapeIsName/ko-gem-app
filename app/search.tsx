import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function SearchScreen() {
  const [searchText, setSearchText] = useState('');
  const router = useRouter();

  const handleBackPress = () => {
    router.back();
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
        
        <ThemedView style={styles.searchBar}>
          <IconSymbol name={NAVIGATION_ICONS.SEARCH} size={20} color="#687076" />
          <TextInput
            style={styles.searchInput}
            placeholder="장소, 키워드로 검색해보세요"
            placeholderTextColor="#687076"
            value={searchText}
            onChangeText={setSearchText}
            autoFocus={true}
          />
        </ThemedView>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 인기 검색어 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>인기 검색어</ThemedText>
            <ThemedView style={styles.tagsContainer}>
              <TouchableOpacity style={styles.tag}>
                <ThemedText style={styles.tagText}>#한강공원</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <ThemedText style={styles.tagText}>#남산타워</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <ThemedText style={styles.tagText}>#홍대거리</ThemedText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.tag}>
                <ThemedText style={styles.tagText}>#강남역</ThemedText>
              </TouchableOpacity>
            </ThemedView>
          </ThemedView>
          
          {/* 최근 검색 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>최근 검색</ThemedText>
            <TouchableOpacity style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>명동 거리</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>이태원</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.recentItem}>
              <IconSymbol name="history" size={16} color="#687076" />
              <ThemedText style={styles.recentText}>동대문 시장</ThemedText>
            </TouchableOpacity>
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
    paddingTop: 80, // SafeArea 대신 고정 패딩 (기존 60에서 80으로 증가)
    backgroundColor: '#fff',
    gap: 16, // 뒤로가기 버튼과 검색창 사이 거리
  },
  backButton: {
    padding: 8,
    marginLeft: 16, // 뒤로가기 버튼을 왼쪽에 붙임
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    paddingHorizontal: 16,
    paddingVertical: 8, // 세로 패딩 줄임 (기존 12에서 8로)
    borderRadius: 12,
    flex: 1,
    gap: 12,
    minHeight: 40, // 최소 높이 설정으로 일관된 크기 보장
    marginRight: 16, // 검색창을 오른쪽에 붙임
  },
  searchInput: {
    fontSize: 16,
    color: '#11181C',
    flex: 1,
    paddingVertical: 0, // TextInput 내부 세로 패딩 제거
    textAlignVertical: 'center', // Android에서 텍스트 세로 중앙 정렬
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20, // Adjusted padding for header
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
