// 사용자 상태 타입
export interface UserState {
  /** 사용자 프로필 정보 */
  profile: UserProfile | null;
  /** 사용자 설정 */
  preferences: UserPreferences;
  /** 즐겨찾기한 장소들 */
  favorites: string[];
  /** 방문한 장소들 */
  visitedPlaces: string[];
  /** 로딩 상태 */
  isLoading: boolean;
  /** 에러 메시지 */
  error: string | null;
}

// 사용자 프로필
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  bio?: string;
  createdAt: string;
  updatedAt: string;
}

// 사용자 설정
export interface UserPreferences {
  /** 알림 설정 */
  notifications: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  /** 언어 설정 */
  language: 'ko' | 'en' | 'ja' | 'zh';
  /** 테마 설정 */
  theme: 'light' | 'dark' | 'auto';
  /** 위치 권한 */
  locationPermission: boolean;
  /** 검색 히스토리 저장 */
  saveSearchHistory: boolean;
}
