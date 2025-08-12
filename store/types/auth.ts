// 인증 상태 타입
export interface AuthState {
  /** 로그인 상태 */
  isAuthenticated: boolean;
  /** 로딩 상태 */
  isLoading: boolean;
  /** 액세스 토큰 */
  accessToken: string | null;
  /** 리프레시 토큰 */
  refreshToken: string | null;
  /** 사용자 ID */
  userId: string | null;
  /** 에러 메시지 */
  error: string | null;
}

// 로그인 요청 타입
export interface LoginRequest {
  email: string;
  password: string;
}

// 회원가입 요청 타입
export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

// 토큰 응답 타입
export interface TokenResponse {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}
