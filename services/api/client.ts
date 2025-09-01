import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

// API 기본 설정
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.kogem.com';
const API_TIMEOUT = 10000; // 10초

// 공통 body 값 타입 정의
interface CommonBodyData {
  deviceId?: string;
  appVersion?: string;
  platform?: 'ios' | 'android' | 'web';
  timestamp?: number;
  userId?: string;
}

// Axios 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// 공통 body 값 생성 함수
const getCommonBodyData = (): CommonBodyData => {
  return {
    deviceId: getDeviceId(),
    appVersion: getAppVersion(),
    platform: getPlatform(),
    timestamp: Date.now(),
    userId: getUserId(),
  };
};

// 요청 인터셉터 (토큰 추가 및 공통 body 값 추가)
apiClient.interceptors.request.use(
  (config: AxiosRequestConfig) => {
    // 토큰이 있다면 헤더에 추가
    const token = getAuthToken();
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    // POST, PUT, PATCH 요청에 공통 body 값 추가
    if (config.method && ['post', 'put', 'patch'].includes(config.method.toLowerCase())) {
      const commonData = getCommonBodyData();
      
      if (config.data) {
        // 기존 data가 있으면 공통 데이터와 병합
        config.data = {
          ...commonData,
          ...config.data,
        };
      } else {
        // 기존 data가 없으면 공통 데이터만 설정
        config.data = commonData;
      }
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

// 유틸리티 함수들
function getAuthToken(): string | null {
  // AsyncStorage에서 토큰 가져오기
  return null;
}

function getDeviceId(): string {
  // 디바이스 ID 가져오기 (Expo Device 또는 기타 방법)
  return 'device-id-placeholder';
}

function getAppVersion(): string {
  // 앱 버전 가져오기
  return '1.0.0';
}

function getPlatform(): 'ios' | 'android' | 'web' {
  // 플랫폼 감지
  return 'ios'; // 또는 'android', 'web'
}

function getUserId(): string | undefined {
  // 사용자 ID 가져오기 (로그인된 경우)
  return undefined;
}

function handleTokenExpired() {
  // 로그아웃 처리
  console.log('Token expired, redirecting to login');
}

export default apiClient;
