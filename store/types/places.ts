import { CardData } from '@/data';

// API에서 받아온 지역 코드 타입
export interface AreaCodeItem {
  rnum: number;
  code: string;
  name: string;
}

// 전국 옵션 (기본값)
export const ALL_AREA_CODE: AreaCodeItem = {
  rnum: 0,
  code: '',
  name: '전국',
};

// 장소 상태 타입
export interface PlacesState {
  /** 추천 장소들 */
  recommendedPlaces: CardData[];
  /** 인기 장소들 */
  popularPlaces: CardData[];
  /** 검색된 장소들 */
  searchResults: CardData[];
  /** 카테고리별 장소들 */
  placesByCategory: Record<string, CardData[]>;
  /** 현재 선택된 장소 */
  selectedPlace: CardData | null;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
  /** 검색 쿼리 */
  searchQuery: string;
  /** 선택된 카테고리 */
  selectedCategory: string | null;
  /** 위치 정보 */
  location: {
    latitude: number;
    longitude: number;
    address: string;
  } | null;
  /** 지역 코드 목록 */
  areaCodes: AreaCodeItem[];
  /** 현재 선택된 지역 */
  selectedAreaCode: AreaCodeItem | null;
}

// 장소 검색 파라미터
export interface PlaceSearchParams {
  query: string;
  category?: string;
  latitude?: number;
  longitude?: number;
  radius?: number;
  limit?: number;
  offset?: number;
}

// 기존 PlaceCity enum (하위 호환성을 위해 유지)
export enum PlaceCity {
  ALL = '전국',
  SEOUL = '서울',
  GYEONGGI = '경기',
  GANGWON = '강원',
  CHUNGCHEONG = '충청',
  JEOLLA = '전라',
  GYEONGSANG = '경상',
  JEJU = '제주',
  BUSAN = '부산',
  DAEGU = '대구',
  ULSAN = '울산',
  INCHEON = '인천',
  DAEJEON = '대전',
  GWANGJU = '광주',
}

// 장소 필터 옵션
export interface PlaceFilterOptions {
  city: PlaceCity;
  categories: string[];
  priceRange: [number, number];
  rating: number;
  distance: number;
}

export interface RecommendPlace {
  id: string;
  name: string;
  description: string;
  image: string;
}

export interface PopularPlace {
  id: string;
  name: string;
  description: string;
  image: string;
}