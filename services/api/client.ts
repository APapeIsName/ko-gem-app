import axios, { AxiosInstance, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.kogem.com';
const API_TIMEOUT = 10000; // 10초

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 요청 인터셉터 (토큰 추가 등)
apiClient.interceptors.request.use(
  (config) => {
    // 토큰이 있다면 헤더에 추가
    const token = getAuthToken(); // 이 함수는 나중에 구현
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 (에러 처리 등)
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // 401 에러 시 토큰 만료 처리
    if (error.response?.status === 401) {
      // 토큰 만료 시 로그아웃 처리
      handleTokenExpired();
    }
    return Promise.reject(error);
  }
);

// 토큰 가져오기 (임시 구현)
function getAuthToken(): string | null {
      // AsyncStorage에서 토큰 가져오기
  return null;
}

// 토큰 만료 처리 (임시 구현)
function handleTokenExpired() {
  // 로그아웃 처리
  console.log('Token expired, redirecting to login');
}

export default apiClient;
