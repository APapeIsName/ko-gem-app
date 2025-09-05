import { HorizontalScrollSection } from '@/components/common/HorizontalScrollSection';
import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCard } from '@/components/home/list/ImageCard';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { NAVIGATION_ICONS } from '@/data';
import { supabase } from '@/services/api/supabase/client';
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
  
  // 사용자 정보 상태
  const [user, setUser] = useState<any>(null);
  
  // 행사 데이터 상태
  const [festivalEvents, setFestivalEvents] = useState<any[]>([]);
  const [travelCourses, setTravelCourses] = useState<any[]>([]);
  const [culturalFacilities, setCulturalFacilities] = useState<any[]>([]);
  const [hiddenSpots, setHiddenSpots] = useState<any[]>([]);

  // 사용자 세션 확인
  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      if (user) {
        console.log('현재 로그인된 사용자:', user.email);
        console.log('사용자 메타데이터:', user.user_metadata);
      } else {
        console.log('로그인된 사용자 없음');
      }
    };
    
    checkUser();
    
    // 인증 상태 변경 리스너
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('인증 상태 변경:', event, session?.user?.email);
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    // 기본값으로 전국 설정
    setSelectedAreaCode(ALL_AREA_CODE);
    
    // 지역 코드 API 호출
    const fetchAreaCodes = async () => {
      try {
        const codes = await getAreaCodes(20, 1);
        setAreaCodes(codes);
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
        
        const events = await getTouristSpots(TOURISM_CONTENT_TYPES.FESTIVAL_EVENT, areaCode, 20, 1);
        
        // 생성일순으로 정렬 (createdtime 기준)
        const sortedEvents = events.sort((a: any, b: any) => {
          if (!a.createdtime || !b.createdtime) return 0;
          
          const dateA = new Date(
            parseInt(a.createdtime.substring(0, 4)),
            parseInt(a.createdtime.substring(4, 6)) - 1,
            parseInt(a.createdtime.substring(6, 8)),
            parseInt(a.createdtime.substring(8, 10)),
            parseInt(a.createdtime.substring(10, 12)),
            parseInt(a.createdtime.substring(12, 14))
          );
          
          const dateB = new Date(
            parseInt(b.createdtime.substring(0, 4)),
            parseInt(b.createdtime.substring(4, 6)) - 1,
            parseInt(b.createdtime.substring(6, 8)),
            parseInt(b.createdtime.substring(8, 10)),
            parseInt(b.createdtime.substring(10, 12)),
            parseInt(b.createdtime.substring(12, 14))
          );
          
          return dateB.getTime() - dateA.getTime(); // 최신순 (내림차순)
        });
        
        // 1개월 이내와 3개월 이내 날짜 계산
        const oneMonthAgo = new Date();
        oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
        
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
        
        // 1개월 이내 행사 (이미 생성일 순으로 정렬됨)
        const oneMonthEvents = sortedEvents.filter((event: any) => {
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
        const oneToThreeMonthsEvents = sortedEvents.filter((event: any) => {
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
        
        // 1개월 이내 행사는 그대로 사용 (이미 생성일 순으로 정렬됨)
        // 1개월~3개월 이내 행사는 랜덤 선택
        const randomOneToThreeMonthsEvents = getRandomItems(oneToThreeMonthsEvents, 5);
        
        // 최종 결과: 1개월 이내 행사 + 랜덤 선택된 1개월~3개월 이내 행사 (최대 5개)
        const finalEvents = [...oneMonthEvents, ...randomOneToThreeMonthsEvents].slice(0, 5);
        
        setFestivalEvents(finalEvents);
      } catch (error) {
        console.error('행사 데이터 로드 실패:', error);
      }
    };

    const fetchTravelCourses = async () => {
      try {
        // 전체(전국)인 경우 areaCode 생략, 특정 지역인 경우 areaCode 사용
        const areaCode = selectedAreaCode.code === '' ? undefined : selectedAreaCode.code;
        
        const courses = await getTouristSpots(TOURISM_CONTENT_TYPES.TRAVEL_COURSE, areaCode, 20, 1);
        
        // 완전히 랜덤하게 5개 선택
        const randomCourses = getRandomItems(courses, 5);
        
        setTravelCourses(randomCourses);
      } catch (error) {
        console.error('여행 코스 데이터 로드 실패:', error);
      }
    };

    const fetchCulturalFacilities = async () => {
      try {
        // 전체(전국)인 경우 areaCode 생략, 특정 지역인 경우 areaCode 사용
        const areaCode = selectedAreaCode.code === '' ? undefined : selectedAreaCode.code;
        
        const facilities = await getTouristSpots(TOURISM_CONTENT_TYPES.CULTURAL_FACILITY, areaCode, 20, 1);
        
        // 완전히 랜덤하게 5개 선택
        const randomFacilities = getRandomItems(facilities, 5);
        
        setCulturalFacilities(randomFacilities);
      } catch (error) {
        console.error('문화시설 데이터 로드 실패:', error);
      }
    };

    const fetchHiddenSpots = async () => {
      try {
        // 전체(전국)인 경우 areaCode 생략, 특정 지역인 경우 areaCode 사용
        const areaCode = selectedAreaCode.code === '' ? undefined : selectedAreaCode.code;
        
        const spots = await getTouristSpots(TOURISM_CONTENT_TYPES.TOURIST_SPOT, areaCode, 20, 1);
        
        // 완전히 랜덤하게 5개 선택
        const randomSpots = getRandomItems(spots, 5);
        
        setHiddenSpots(randomSpots);
      } catch (error) {
        console.error('숨겨진 관광명소 데이터 로드 실패:', error);
      }
    };

    fetchFestivalEvents();
    fetchTravelCourses();
    fetchCulturalFacilities();
    fetchHiddenSpots();
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
    location: {
      latitude: parseFloat(event.mapY) || 37.5665, // 기본값: 서울
      longitude: parseFloat(event.mapX) || 126.9780, // 기본값: 서울
      address: event.addr1 || '',
    },
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
    location: {
      latitude: parseFloat(course.mapY) || 37.5665, // 기본값: 서울
      longitude: parseFloat(course.mapX) || 126.9780, // 기본값: 서울
      address: course.addr1 || '',
    },
  });

  // 문화시설 데이터를 ImageCard 형식으로 변환하는 함수
  const convertCulturalFacilityToImageCardFormat = (facility: any) => ({
    id: facility.contentId,
    title: facility.title,
    subtitle: facility.addr1,
    image: facility.firstimage || facility.firstimage2 || 'https://via.placeholder.com/300x200',
    overlay: facility.title,
    category: '문화시설',
    rating: 4.4, // 기본값
    reviewCount: Math.floor(Math.random() * 150) + 15, // 랜덤 리뷰 수
    isRecommended: Math.random() > 0.4, // 랜덤 추천 여부
    location: {
      latitude: parseFloat(facility.mapY) || 37.5665, // 기본값: 서울
      longitude: parseFloat(facility.mapX) || 126.9780, // 기본값: 서울
      address: facility.addr1 || '',
    },
  });

  // 숨겨진 관광명소 데이터를 ImageCard 형식으로 변환하는 함수
  const convertHiddenSpotToImageCardFormat = (spot: any) => ({
    id: spot.contentId,
    title: spot.title,
    subtitle: spot.addr1,
    image: spot.firstimage || spot.firstimage2 || 'https://via.placeholder.com/300x200',
    overlay: spot.title,
    category: '관광지',
    rating: 4.6, // 기본값 (숨겨진 명소는 평점이 높을 것)
    reviewCount: Math.floor(Math.random() * 100) + 5, // 랜덤 리뷰 수 (적은 리뷰로 숨겨진 느낌)
    isRecommended: Math.random() > 0.2, // 랜덤 추천 여부 (숨겨진 명소는 추천 확률 높게)
    location: {
      latitude: parseFloat(spot.mapY) || 37.5665, // 기본값: 서울
      longitude: parseFloat(spot.mapX) || 126.9780, // 기본값: 서울
      address: spot.addr1 || '',
    },
  });

  const handleAreaSelect = (areaCode: AreaCodeItem) => {
    setSelectedAreaCode(areaCode);
  };

  const handleSearchPress = () => {
    router.push('/search');
  };

  const handleMapPress = () => {
    router.push('/map');
  };

  const handleItemPress = (item: any) => {
    
    // 카테고리에 따라 다른 상세 페이지로 이동
    if (item.category === '축제공연행사') {
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
      
      {/* 사용자 정보 표시 (개발용) */}
      {user && (
        <ThemedView style={styles.userInfo}>
          <ThemedText style={styles.userText}>
            🟢 로그인됨: {user.email} ({user.user_metadata?.full_name || '이름 없음'})
          </ThemedText>
        </ThemedView>
      )}
      
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

          {/* 요즘 핫한 플레이스 섹션 */}
          {culturalFacilities.length > 0 && (
            <HorizontalScrollSection
              section={{
                id: 'hot-places',
                title: '요즘 핫한 플레이스',
                type: 'horizontal-scroll',
                items: culturalFacilities.map(convertCulturalFacilityToImageCardFormat),
              }}
              renderItem={renderImageCard}
              onMorePress={() => handleMorePress('hot-places')}
            />
          )}

          {/* 숨겨진 관광명소 섹션 */}
          {hiddenSpots.length > 0 && (
            <HorizontalScrollSection
              section={{
                id: 'hidden-spots',
                title: '숨겨진 관광명소',
                type: 'horizontal-scroll',
                items: hiddenSpots.map(convertHiddenSpotToImageCardFormat),
              }}
              renderItem={renderImageCard}
              onMorePress={() => handleMorePress('hidden-spots')}
            />
          )}

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
  userInfo: {
    backgroundColor: '#e8f5e8',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#d4edda',
  },
  userText: {
    fontSize: 14,
    color: '#155724',
    textAlign: 'center',
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
