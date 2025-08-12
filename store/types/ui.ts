// UI 상태 타입
export interface UIState {
  /** 현재 테마 */
  theme: 'light' | 'dark';
  /** 사이드바 열림 상태 */
  isSidebarOpen: boolean;
  /** 모달 열림 상태 */
  isModalOpen: boolean;
  /** 로딩 오버레이 표시 여부 */
  showLoadingOverlay: boolean;
  /** 토스트 메시지 */
  toast: ToastMessage | null;
  /** 현재 활성 탭 */
  activeTab: string;
  /** 헤더 표시 여부 */
  showHeader: boolean;
  /** 하단 탭 표시 여부 */
  showBottomTabs: boolean;
}

// 토스트 메시지
export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  duration?: number;
}

// 모달 상태
export interface ModalState {
  isOpen: boolean;
  type: string;
  data?: any;
}
