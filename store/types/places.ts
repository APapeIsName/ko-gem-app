import { CardData } from '@/data';

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

// 장소 필터 옵션
export interface PlaceFilterOptions {
  categories: string[];
  priceRange: [number, number];
  rating: number;
  distance: number;
}
