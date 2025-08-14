import { SearchResultItem } from '@/components/search/SearchResultItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { searchKeywords, searchResults } from '@/data/mock/places';
import { SearchResult, SearchSuggestion } from '@/types/find/list/type';
import { useRouter } from 'expo-router';
import React, { useCallback, useEffect, useState } from 'react';
import { FlatList, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function SearchScreen() {
  const router = useRouter();
  const [searchText, setSearchText] = useState('');
  const [filteredResults, setFilteredResults] = useState<SearchResult[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(true);
  const [isSearching, setIsSearching] = useState(false);

  // debounce를 위한 타이머
  const [debounceTimer, setDebounceTimer] = useState<number | null>(null);

  // 검색어 변경 시 debounce 적용
  const handleSearchTextChange = useCallback((text: string) => {
    setSearchText(text);
    
    // 검색어가 비어있으면 제안 화면으로 돌아가기
    if (!text.trim()) {
      setFilteredResults([]);
      setShowSuggestions(true);
      setIsSearching(false);
      return;
    }

    // 검색어가 있으면 검색 상태로 전환하고 이전 결과 초기화
    setShowSuggestions(false);
    setIsSearching(true);
    setFilteredResults([]);

    // 기존 타이머 클리어
    if (debounceTimer) {
      clearTimeout(debounceTimer);
    }

    // 새로운 타이머 설정 (0.1초)
    const timer = setTimeout(() => {
      performSearch(text.trim());
    }, 100);

    setDebounceTimer(timer);
  }, [debounceTimer]);

  // 실제 검색 수행
  const performSearch = (query: string) => {
    // 검색어가 비어있으면 제안 화면으로 돌아가기
    if (!query.trim()) {
      setFilteredResults([]);
      setShowSuggestions(true);
      setIsSearching(false);
      return;
    }
    
    // 검색어가 포함된 결과 필터링
    const results = searchResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    // 결과 설정
    setFilteredResults(results);
    
    // 결과가 없으면 1초 후에 로딩 상태 해제
    if (results.length === 0) {
      setTimeout(() => {
        setIsSearching(false);
      }, 1000);
    } else {
      // 결과가 있으면 즉시 로딩 상태 해제
      setIsSearching(false);
    }
  };

  // 뒤로가기
  const handleBackPress = () => {
    router.back();
  };

  // 검색 제안 클릭
  const handleSuggestionPress = (suggestion: SearchSuggestion) => {
    setSearchText(suggestion.keyword);
    performSearch(suggestion.keyword);
  };

  // 검색 결과 클릭
  const handleResultPress = (result: SearchResult) => {
    if (result.type === 'event') {
      router.push({
        pathname: '/event-detail',
        params: {
          id: result.id,
          title: result.title,
          subtitle: result.subtitle,
          category: result.category,
          image: 'https://via.placeholder.com/300x200', // 임시 이미지
          overlay: '행사'
        }
      });
    } else {
      router.push({
        pathname: '/place-detail',
        params: {
          id: result.id,
          title: result.title,
          subtitle: result.subtitle,
          category: result.category,
          image: 'https://via.placeholder.com/300x200', // 임시 이미지
          overlay: result.category
        }
      });
    }
  };

  // 컴포넌트 언마운트 시 타이머 클리어
  useEffect(() => {
    return () => {
      if (debounceTimer) {
        clearTimeout(debounceTimer);
      }
    };
  }, [debounceTimer]);

  // 검색 제안 렌더링
  const renderSuggestion = ({ item }: { item: SearchSuggestion }) => (
    <TouchableOpacity
      style={styles.suggestionItem}
      onPress={() => handleSuggestionPress(item)}
      activeOpacity={0.7}
    >
      <IconSymbol 
        name={item.type === 'popular' ? 'trending-up' : 'history'} 
        size={20} 
        color="#687076" 
      />
      <ThemedText style={styles.suggestionText}>{item.keyword}</ThemedText>
    </TouchableOpacity>
  );

  // 검색 결과 렌더링
  const renderSearchResult = ({ item }: { item: SearchResult }) => (
    <SearchResultItem item={item} onPress={() => handleResultPress(item)} />
  );

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
        
        {/* 검색 입력창 */}
        <View style={styles.searchBar}>
          <IconSymbol name="search" size={20} color="#687076" />
          <TextInput
            style={styles.searchInput}
            placeholder="장소, 키워드로 검색해보세요"
            placeholderTextColor="#9CA3AF"
            value={searchText}
            onChangeText={handleSearchTextChange}
            autoFocus={true}
            returnKeyType="search"
            onSubmitEditing={() => searchText.trim() && performSearch(searchText.trim())}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              style={styles.clearButton}
              onPress={() => {
                setSearchText('');
                setFilteredResults([]);
                setShowSuggestions(true);
                setIsSearching(false);
              }}
              activeOpacity={0.7}
            >
              <IconSymbol name="close" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>
      </ThemedView>

      {/* 검색 결과 또는 제안 */}
      {showSuggestions ? (
        <FlatList
          data={searchKeywords}
          renderItem={renderSuggestion}
          keyExtractor={(item) => item.id}
          style={styles.suggestionsList}
          showsVerticalScrollIndicator={false}
        />
      ) : (
        // 첫 번째 분기: 결과가 있는지 확인
        filteredResults.length > 0 ? (
          <FlatList
            data={filteredResults}
            renderItem={renderSearchResult}
            keyExtractor={(item) => item.id}
            style={styles.resultsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          // 두 번째 분기: 결과가 없으면서 로딩 중인지 확인
          isSearching ? (
            <View style={styles.loadingContainer}>
              <IconSymbol name="hourglass-empty" size={48} color="#E9ECEF" />
              <ThemedText style={styles.loadingText}>검색 중...</ThemedText>
            </View>
          ) : (
            // 세 번째 분기: 위 두 조건 모두 만족하지 않음 (결과 없음)
            <View style={styles.emptyContainer}>
              <IconSymbol name="search-off" size={48} color="#E9ECEF" />
              <ThemedText style={styles.emptyText}>
                '{searchText}'에 대한 검색 결과가 없습니다
              </ThemedText>
            </View>
          )
        )
      )}
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
  clearButton: {
    padding: 8,
  },
  suggestionsList: {
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  suggestionText: {
    fontSize: 16,
    color: '#687076',
  },
  resultsList: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  emptyText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 50,
  },
  loadingText: {
    fontSize: 16,
    color: '#9CA3AF',
    marginTop: 10,
  },
});
