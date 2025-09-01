import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCard } from '@/components/home/list/ImageCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import { homeSections } from '@/data/mock/places';
import { getAreaCodes } from '@/services/api/tourism';
import { usePlacesStore } from '@/store/slices/placesSlice';
import { ALL_AREA_CODE, AreaCodeItem } from '@/store/types/places';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { 
    areaCodes, 
    setAreaCodes, 
    selectedAreaCode, 
    setSelectedAreaCode 
  } = usePlacesStore();
  const router = useRouter();

  useEffect(() => {
    // 기본값으로 전국 설정
    setSelectedAreaCode(ALL_AREA_CODE);
    
    // 지역 코드 API 호출
    const fetchAreaCodes = async () => {
      try {
        const codes = await getAreaCodes(20, 1);
        setAreaCodes(codes);
        console.log('지역 코드 로드 완료:', codes);
      } catch (error) {
        console.error('지역 코드 로드 실패:', error);
      }
    };

    fetchAreaCodes();
  }, []);

  const handleAreaSelect = (areaCode: AreaCodeItem) => {
    setSelectedAreaCode(areaCode);
    console.log('선택된 지역:', areaCode.name, areaCode.code);
    // TODO: 선택된 지역에 따라 데이터 새로고침
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleMapPress = () => {
    router.push('/map');
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
        selectedAreaCode={selectedAreaCode}
        onLocationPress={() => console.log('위치 선택')}
        onMapPress={handleMapPress}
        onAreaSelect={handleAreaSelect}
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

          {/* AsyncStorage 테스트 섹션 */}
          {/* <ThemedView style={styles.testSection}>
            <ThemedText style={styles.testSectionTitle}>AsyncStorage 테스트</ThemedText>
            <AsyncStorageTest />
          </ThemedView> */}

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
  testSection: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: '#f8f9fa',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e9ecef',
  },
  testSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
    color: '#495057',
    textAlign: 'center',
  },
  bottomSpacer: {
    height: 80, // 바텀 내비게이션 바의 높이에 맞춰 여백 추가
  },
});
