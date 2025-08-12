// Store 관련 공통 타입들
export * from './auth';
export * from './places';
export * from './user';
export * from './ui';

// Store 상태 타입
export interface RootState {
  auth: import('./auth').AuthState;
  places: import('./places').PlacesState;
  user: import('./user').UserState;
  ui: import('./ui').UIState;
}
