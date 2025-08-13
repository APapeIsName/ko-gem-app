import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCardSection } from '@/components/home/list/ImageCardSection';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { mockPlaces, NAVIGATION_ICONS } from '@/data';
import { usePlacesStore } from '@/store/slices/placesSlice';
import { PlaceCity } from '@/store/types/places';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { recommendedPlaces, popularPlaces, placeCity, setPlaceCity } = usePlacesStore();
  const router = useRouter();

  useEffect(() => {
    setPlaceCity(PlaceCity.ALL);
  }, []);

  const handleLocationChange = (city: PlaceCity) => {
    setPlaceCity(city);
    console.log('선택된 도시:', city.toString());
    // TODO: 선택된 도시에 따라 데이터 새로고침
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  return (
    <ThemedView style={styles.container}>
      <LocationHeader 
        location={placeCity}
        onLocationPress={() => console.log('위치 선택')}
        onMapPress={() => console.log('지도 열기')}
        onLocationChange={handleLocationChange}
        useSafeArea={true}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 검색 섹션 */}
          <ThemedView style={styles.searchSection}>
            <TouchableOpacity 
              style={styles.searchBar}
              onPress={handleSearchPress}
              activeOpacity={0.7}
            >
              <IconSymbol name={NAVIGATION_ICONS.SEARCH} size={20} color="#687076" />
              <ThemedText style={styles.searchPlaceholder}>장소, 키워드로 검색해보세요</ThemedText>
            </TouchableOpacity>
          </ThemedView>

          {/* 홈 메인 컨텐츠 */}
          <ImageCardSection title="코젬 추천 픽 👍" cards={mockPlaces.kogemPicks} />
          <ImageCardSection title="지금 핫한 곳 🔥" cards={mockPlaces.popularPlaces} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    zIndex: 1, // 낮은 zIndex로 설정
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    zIndex: 1, // 낮은 zIndex로 설정
  },
  searchSection: {
    marginBottom: 20,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
  searchPlaceholder: {
    marginLeft: 10,
    color: '#687076',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e0e0e0',
    borderRadius: 15,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#333',
  },
});
