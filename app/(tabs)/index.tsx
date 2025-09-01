import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCard } from '@/components/home/list/ImageCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import { homeSections } from '@/data/mock/places';
import { getAreaCodes, getTouristSpots, TOURISM_CONTENT_TYPES } from '@/services/api/tourism';
import { usePlacesStore } from '@/store/slices/placesSlice';
import { ALL_AREA_CODE, AreaCodeItem } from '@/store/types/places';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';

export default function HomeScreen() {
  const { 
    areaCodes, 
    setAreaCodes, 
    selectedAreaCode, 
    setSelectedAreaCode 
  } = usePlacesStore();
  const router = useRouter();
  
  // 행사 데이터 상태
  const [festivalEvents, setFestivalEvents] = useState<any[]>([]);
  const [travelCourses, setTravelCourses] = useState<any[]>([]);

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

  // 선택된 지역이 변경될 때마다 행사 데이터 새로고침
  useEffect(() => {
    if (!selectedAreaCode) return;

    const fetchFestivalEvents = async () => {
      try {
        // 전체(전국)인 경우 areaCode 생략, 특정 지역인 경우 areaCode 사용
        const areaCode = selectedAreaCode.code === '' ? undefined : selectedAreaCode.code;
        
        console.log('행사 데이터 요청:', {
          areaCode: areaCode || '전국',
          contentTypeId: TOURISM_CONTENT_TYPES.FESTIVAL_EVENT,
          arrange: 'D' // 생성일 순으로 정렬
        });

        const events = await getTouristSpots(TOURISM_CONTENT_TYPES.FESTIVAL_EVENT, areaCode, 1000, 1, 'D');
        console.log('행사 데이터 로드 완료:', events.length, '개');
        
        // 1개월 이내와 3개월 이내 날짜 계산
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        // 1개월 이내 행사 (생성일 순으로 정렬된 상태 유지)
        const oneMonthEvents = events.filter((event: any) => {
          if (!event.createdtime) return false;
          
          const year = parseInt(event.createdtime.substring(0, 4));
          const month = parseInt(event.createdtime.substring(4, 6)) - 1;
          const day = parseInt(event.createdtime.substring(6, 8));
          const hour = parseInt(event.createdtime.substring(8, 10));
          const minute = parseInt(event.createdtime.substring(10, 12));
          const second = parseInt(event.createdtime.substring(12, 14));
          
          const eventDate = new Date(year, month, day, hour, minute, second);
          
          return eventDate >= oneMonthAgo;
        });
        
        // 1개월~3개월 이내 행사 (랜덤 선택)
        const oneToThreeMonthsEvents = events.filter((event: any) => {
          if (!event.createdtime) return false;
          
          const year = parseInt(event.createdtime.substring(0, 4));
          const month = parseInt(event.createdtime.substring(4, 6)) - 1;
          const day = parseInt(event.createdtime.substring(6, 8));
          const hour = parseInt(event.createdtime.substring(8, 10));
          const minute = parseInt(event.createdtime.substring(10, 12));
          const second = parseInt(event.createdtime.substring(12, 14));
          
          const eventDate = new Date(year, month, day, hour, minute, second);
          
          return eventDate >= threeMonthsAgo && eventDate < oneMonthAgo;
        });
        
        console.log('1개월 이내 행사:', oneMonthEvents.length, '개');
        console.log('1개월~3개월 이내 행사:', oneToThreeMonthsEvents.length, '개');
        
        // 1개월 이내 행사는 그대로 사용 (이미 생성일 순으로 정렬됨)
        // 1개월~3개월 이내 행사는 랜덤 선택
        const randomOneToThreeMonthsEvents = getRandomItems(oneToThreeMonthsEvents, 5);
        
        // 최종 결과: 1개월 이내 행사 + 랜덤 선택된 1개월~3개월 이내 행사
        const finalEvents = [...oneMonthEvents, ...randomOneToThreeMonthsEvents];
        
        console.log('최종 선택된 행사:', finalEvents.length, '개');
        
        setFestivalEvents(finalEvents);
      } catch (error) {
        console.error('행사 데이터 로드 실패:', error);
      }
    };

    const fetchTravelCourses = async () => {
      try {
        // 전체(전국)인 경우 areaCode 생략, 특정 지역인 경우 areaCode 사용
        const areaCode = selectedAreaCode.code === '' ? undefined : selectedAreaCode.code;
        
        console.log('여행 코스 데이터 요청:', {
          areaCode: areaCode || '전국',
          contentTypeId: TOURISM_CONTENT_TYPES.TRAVEL_COURSE
        });

        const courses = await getTouristSpots(TOURISM_CONTENT_TYPES.TRAVEL_COURSE, areaCode, 1000, 1);
        console.log('여행 코스 데이터 로드 완료:', courses.length, '개');
        
        // 완전히 랜덤하게 8개 선택
        const randomCourses = getRandomItems(courses, 8);
        console.log('랜덤 선택된 여행 코스:', randomCourses.length, '개');
        
        setTravelCourses(randomCourses);
      } catch (error) {
        console.error('여행 코스 데이터 로드 실패:', error);
      }
    };

    fetchFestivalEvents();
    fetchTravelCourses();
  }, [selectedAreaCode]);

  // 배열에서 랜덤하게 n개 선택하는 함수
  const getRandomItems = (array: any[], n: number): any[] => {
    const shuffled = [...array].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, n);
  };

  // API 데이터를 ImageCard 형식으로 변환하는 함수
  const convertToImageCardFormat = (event: any) => ({
    id: event.contentId,
    title: event.title,
    subtitle: event.addr1,
    image: event.firstimage || event.firstimage2 || 'https://via.placeholder.com/300x200',
    overlay: event.title,
    category: '축제공연행사',
    rating: 4.5, // 기본값
    reviewCount: Math.floor(Math.random() * 100) + 10, // 랜덤 리뷰 수
    isRecommended: Math.random() > 0.5, // 랜덤 추천 여부
    location: event.addr1,
    // 추가 정보
    address: event.addr1,
    tel: event.tel,
    mapX: event.mapX,
    mapY: event.mapY,
  });

  // 여행 코스 데이터를 ImageCard 형식으로 변환하는 함수
  const convertTravelCourseToImageCardFormat = (course: any) => ({
    id: course.contentId,
    title: course.title,
    subtitle: course.addr1,
    image: course.firstimage || course.firstimage2 || 'https://via.placeholder.com/300x200',
    overlay: course.title,
    category: '여행코스',
    rating: 4.3, // 기본값
    reviewCount: Math.floor(Math.random() * 200) + 20, // 랜덤 리뷰 수
    isRecommended: Math.random() > 0.3, // 랜덤 추천 여부 (여행 코스는 추천 확률 높게)
    location: course.addr1,
    // 추가 정보
    address: course.addr1,
    tel: course.tel,
    mapX: course.mapX,
    mapY: course.mapY,
  });

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

          {/* 요즘 뜨는 행사 섹션 */}
          {festivalEvents.length > 0 && (
            <HorizontalScrollSection
              section={{
                id: 'trending-events',
                title: '요즘 뜨는 행사',
                type: 'horizontal-scroll',
                items: festivalEvents.map(convertToImageCardFormat),
              }}
              renderItem={renderImageCard}
              onMorePress={() => handleMorePress('trending-events')}
            />
          )}

          {/* 여행 코스 추천 섹션 */}
          {travelCourses.length > 0 && (
            <HorizontalScrollSection
              section={{
                id: 'travel-courses',
                title: '여행 코스 추천',
                type: 'horizontal-scroll',
                items: travelCourses.map(convertTravelCourseToImageCardFormat),
              }}
              renderItem={renderImageCard}
              onMorePress={() => handleMorePress('travel-courses')}
            />
          )}

          {/* 홈 메인 컨텐츠 (기존 섹션들) */}
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
