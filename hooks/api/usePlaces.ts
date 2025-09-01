import { ApiParams, placesApi, PlaceSearchParams } from '@/services/api';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

// 추천 장소 조회 훅
export const useRecommendedPlaces = (limit: number = 10) => {
  return useQuery({
    queryKey: ['places', 'recommended', limit],
    queryFn: () => placesApi.getRecommendedPlaces(limit),
    staleTime: 5 * 60 * 1000, // 5분
    gcTime: 10 * 60 * 1000,   // 10분
  });
};

// 인기 장소 조회 훅
export const usePopularPlaces = (limit: number = 10) => {
  return useQuery({
    queryKey: ['places', 'popular', limit],
    queryFn: () => placesApi.getPopularPlaces(limit),
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 장소 상세 조회 훅
export const usePlaceById = (id: string) => {
  return useQuery({
    queryKey: ['places', 'detail', id],
    queryFn: () => placesApi.getPlaceById(id),
    enabled: !!id, // id가 있을 때만 실행
    staleTime: 10 * 60 * 1000, // 10분
    gcTime: 20 * 60 * 1000,    // 20분
  });
};

// 장소 검색 훅 (무한 스크롤)
export const usePlacesSearch = (params: PlaceSearchParams) => {
  return useInfiniteQuery({
    queryKey: ['places', 'search', params],
    queryFn: ({ pageParam = 1 }) => 
      placesApi.getPlaces({ ...params, page: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.page < lastPage.pagination.totalPages) {
        return lastPage.pagination.page + 1;
      }
      return undefined;
    },
    initialPageParam: 1,
    staleTime: 2 * 60 * 1000, // 2분
    gcTime: 5 * 60 * 1000,    // 5분
  });
};

// 카테고리별 장소 조회 훅
export const usePlacesByCategory = (category: string, params: Omit<PlaceSearchParams, 'category'>) => {
  const apiParams: ApiParams = {
    page: 1,
    limit: 10,
    ...params,
  };
  
  return useQuery({
    queryKey: ['places', 'category', category, apiParams],
    queryFn: () => placesApi.getPlacesByCategory(category, apiParams),
    enabled: !!category,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
};

// 위치 기반 장소 검색 훅
export const usePlacesNearby = (
  latitude: number,
  longitude: number,
  radius: number = 5,
  params: Omit<PlaceSearchParams, 'location'>
) => {
  const apiParams: ApiParams = {
    page: 1,
    limit: 10,
    ...params,
  };
  
  return useQuery({
    queryKey: ['places', 'nearby', latitude, longitude, radius, apiParams],
    queryFn: () => placesApi.searchPlacesNearby(latitude, longitude, radius, apiParams),
    enabled: !!latitude && !!longitude,
    staleTime: 2 * 60 * 1000,
    gcTime: 5 * 60 * 1000,
  });
};
