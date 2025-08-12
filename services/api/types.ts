// API 응답 기본 타입
export interface ApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// API 에러 타입
export interface ApiError {
  status: number;
  message: string;
  errors?: Record<string, string[]>;
}

// 페이지네이션 타입
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// 정렬 타입
export interface SortParams {
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// 필터 타입
export interface FilterParams {
  [key: string]: any;
}

// API 요청 파라미터 (페이지네이션 + 정렬 + 필터)
export interface ApiParams extends PaginationParams, SortParams, FilterParams {}

// HTTP 메서드
export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
