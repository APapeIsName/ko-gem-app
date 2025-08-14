import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCard } from '@/components/home/list/ImageCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import { homeSections } from '@/data/mock/places';
import { usePlacesStore } from '@/store/slices/placesSlice';
import { PlaceCity } from '@/store/types/places';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { placeCity, setPlaceCity } = usePlacesStore();
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

  const handleItemPress = (item: any) => {
    console.log('아이템 선택:', item.title);
    
    // 카테고리에 따라 다른 상세 페이지로 이동
    if (item.category === '축제' || item.category === '공연' || item.category === '체험') {
      // 행사인 경우
      router.push({
        pathname: '/event-detail',
        params: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          overlay: item.overlay,
          category: item.category
        }
      });
    } else {
      // 장소인 경우
      router.push({
        pathname: '/place-detail',
        params: {
          id: item.id,
          title: item.title,
          subtitle: item.subtitle,
          image: item.image,
          overlay: item.overlay,
          category: item.category
        }
      });
    }
  };

  const handleMorePress = (sectionId: string) => {
    console.log('더보기:', sectionId);
    // TODO: 더보기 화면으로 이동
  };

  const renderImageCard = (item: any, index: number) => (
    <ImageCard 
      key={item.id || index}
      item={item}
      onPress={() => handleItemPress(item)}
    />
  );

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
          {homeSections.map((section) => (
            <HorizontalScrollSection
              key={section.id}
              section={section}
              renderItem={renderImageCard}
              onMorePress={() => handleMorePress(section.id)}
            />
          ))}

          {/* 바텀 내비게이션 바를 위한 여백 */}
          <ThemedView style={styles.bottomSpacer} />
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
  bottomSpacer: {
    height: 80, // 바텀 내비게이션 바의 높이에 맞춰 여백 추가
  },
});
