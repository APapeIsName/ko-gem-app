import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import { AuthState, LoginRequest, RegisterRequest, TokenResponse } from '../types/auth';

interface AuthActions {
  // 로그인
  login: (credentials: LoginRequest) => Promise<void>;
  // 회원가입
  register: (userData: RegisterRequest) => Promise<void>;
  // 로그아웃
  logout: () => void;
  // 토큰 갱신
  refreshAccessToken: () => Promise<void>;
  // 에러 초기화
  clearError: () => void;
  // 로딩 상태 설정
  setLoading: (loading: boolean) => void;
}

type AuthStore = AuthState & AuthActions;

const initialState: AuthState = {
  isAuthenticated: false,
  isLoading: false,
  accessToken: null,
  refreshToken: null,
  userId: null,
  error: null,
};

export const useAuthStore = create<AuthStore>()(
  devtools(
    persist(
      (set, get) => ({
        ...initialState,

        // 로그인
        login: async (credentials: LoginRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            // TODO: 실제 API 호출로 대체
            // const response = await authApi.login(credentials);
            
            // 임시 로그인 로직 (테스트용)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            const mockResponse: TokenResponse = {
              accessToken: 'mock_access_token',
              refreshToken: 'mock_refresh_token',
              expiresIn: 3600,
            };

            set({
              isAuthenticated: true,
              accessToken: mockResponse.accessToken,
              refreshToken: mockResponse.refreshToken,
              userId: 'mock_user_id',
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '로그인에 실패했습니다.',
            });
          }
        },

        // 회원가입
        register: async (userData: RegisterRequest) => {
          set({ isLoading: true, error: null });
          
          try {
            // TODO: 실제 API 호출로 대체
            // const response = await authApi.register(userData);
            
            // 임시 회원가입 로직 (테스트용)
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            set({
              isLoading: false,
              error: null,
            });
          } catch (error) {
            set({
              isLoading: false,
              error: error instanceof Error ? error.message : '회원가입에 실패했습니다.',
            });
          }
        },

        // 로그아웃
        logout: () => {
          set(initialState);
        },

        // 토큰 갱신
        refreshAccessToken: async () => {
          const currentState = get();
          
          if (!currentState.refreshToken) {
            set({ isAuthenticated: false });
            return;
          }

          try {
            // TODO: 실제 API 호출로 대체
            // const response = await authApi.refreshToken(currentState.refreshToken);
            
            // 임시 토큰 갱신 로직 (테스트용)
            await new Promise(resolve => setTimeout(resolve, 500));
            
            const mockResponse: TokenResponse = {
              accessToken: 'new_mock_access_token',
              refreshToken: 'new_mock_refresh_token',
              expiresIn: 3600,
            };

            set({
              accessToken: mockResponse.accessToken,
              refreshToken: mockResponse.refreshToken,
            });
          } catch (error) {
            set({ isAuthenticated: false });
          }
        },

        // 에러 초기화
        clearError: () => {
          set({ error: null });
        },

        // 로딩 상태 설정
        setLoading: (loading: boolean) => {
          set({ isLoading: loading });
        },
      }),
      {
        name: 'auth-storage',
        partialize: (state) => ({
          accessToken: state.accessToken,
          refreshToken: state.refreshToken,
          userId: state.userId,
          isAuthenticated: state.isAuthenticated,
        }),
      }
    ),
    {
      name: 'auth-store',
    }
  )
);
