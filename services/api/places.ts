import apiClient from './client';
import { ApiParams, ApiResponse, PaginatedResponse } from './types';

// 장소 데이터 타입
export interface Place {
  id: string;
  name: string;
  description: string;
  image: string;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
  category: string;
  rating: number;
  reviewCount: number;
  isRecommended: boolean;
  createdAt: string;
  updatedAt: string;
}

// 장소 검색 파라미터
export interface PlaceSearchParams extends ApiParams {
  query?: string;
  category?: string;
  location?: {
    latitude: number;
    longitude: number;
    radius?: number; // km 단위
  };
  rating?: number;
  isRecommended?: boolean;
}

// 장소 API 서비스
export const placesApi = {
  // 장소 목록 조회
  getPlaces: async (params: PlaceSearchParams): Promise<PaginatedResponse<Place>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Place>>>('/places', { params });
    return response.data.data;
  },

  // 장소 상세 조회
  getPlaceById: async (id: string): Promise<Place> => {
    const response = await apiClient.get<ApiResponse<Place>>(`/places/${id}`);
    return response.data.data;
  },

  // 추천 장소 조회
  getRecommendedPlaces: async (limit: number = 10): Promise<Place[]> => {
    const response = await apiClient.get<ApiResponse<Place[]>>('/places/recommended', {
      params: { limit }
    });
    return response.data.data;
  },

  // 인기 장소 조회
  getPopularPlaces: async (limit: number = 10): Promise<Place[]> => {
    const response = await apiClient.get<ApiResponse<Place[]>>('/places/popular', {
      params: { limit }
    });
    return response.data.data;
  },

  // 카테고리별 장소 조회
  getPlacesByCategory: async (category: string, params: ApiParams): Promise<PaginatedResponse<Place>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Place>>>(`/places/category/${category}`, {
      params
    });
    return response.data.data;
  },

  // 위치 기반 장소 검색
  searchPlacesNearby: async (
    latitude: number,
    longitude: number,
    radius: number = 5,
    params: ApiParams
  ): Promise<PaginatedResponse<Place>> => {
    const response = await apiClient.get<ApiResponse<PaginatedResponse<Place>>>('/places/nearby', {
      params: {
        latitude,
        longitude,
        radius,
        ...params
      }
    });
    return response.data.data;
  }
};
