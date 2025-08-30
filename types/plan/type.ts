// 계획 상태 열거형
export enum PlanStatus {
  DRAFT = 'draft',           // 초안
  ACTIVE = 'active',         // 활성
  COMPLETED = 'completed',   // 완료
  CANCELLED = 'cancelled',   // 취소
  ARCHIVED = 'archived',     // 보관
}

// 계획 우선순위 열거형
export enum PlanPriority {
  LOW = 'low',           // 낮음
  MEDIUM = 'medium',     // 보통
  HIGH = 'high',         // 높음
  URGENT = 'urgent',     // 긴급
}

// 계획 카테고리 열거형
export enum PlanCategory {
  TRAVEL = 'travel',         // 여행
  WORK = 'work',            // 업무
  PERSONAL = 'personal',     // 개인
  HEALTH = 'health',        // 건강
  STUDY = 'study',          // 학습
  SHOPPING = 'shopping',    // 쇼핑
  ENTERTAINMENT = 'entertainment', // 엔터테인먼트
  OTHER = 'other',          // 기타
}

// 계획 반복 타입 열거형
export enum PlanRepeatType {
  NONE = 'none',         // 반복 없음
  DAILY = 'daily',       // 매일
  WEEKLY = 'weekly',     // 매주
  MONTHLY = 'monthly',   // 매월
  YEARLY = 'yearly',     // 매년
  CUSTOM = 'custom',     // 사용자 정의
}

// 계획 반복 설정
export interface PlanRepeatConfig {
  type: PlanRepeatType;
  interval?: number;           // 간격 (예: 2주마다)
  daysOfWeek?: number[];      // 요일 (0=일요일, 1=월요일, ...)
  endDate?: string;           // 반복 종료 날짜
  maxOccurrences?: number;    // 최대 반복 횟수
}

// 계획 알림 설정
export interface PlanNotification {
  id: string;
  type: 'push' | 'email' | 'sms';
  time: string;               // ISO 8601 형식
  offset?: number;            // 알림 시간 오프셋 (분)
  enabled: boolean;
}

// 계획 태그
export interface PlanTag {
  id: string;
  name: string;
  color: string;
  createdAt: string;
}

// 계획 첨부파일
export interface PlanAttachment {
  id: string;
  name: string;
  type: 'image' | 'document' | 'audio' | 'video' | 'other';
  url: string;
  size: number;
  createdAt: string;
}

// 계획 메타데이터
export interface PlanMetadata {
  createdAt: string;
  updatedAt: string;
  createdBy?: string;
  lastModifiedBy?: string;
  version: number;
  isDeleted: boolean;
  syncStatus: 'local' | 'synced' | 'pending' | 'conflict';
  lastSyncAt?: string;
}

// 계획 기본 인터페이스
export interface Plan {
  id: string;
  title: string;
  description?: string;
  category: PlanCategory;
  status: PlanStatus;
  priority: PlanPriority;
  
  // 시간 관련
  startDate: string;          // ISO 8601 형식
  endDate?: string;           // ISO 8601 형식
  startTime?: string;         // HH:mm 형식
  endTime?: string;           // HH:mm 형식
  allDay: boolean;
  
  // 위치 관련
  location?: string;
  latitude?: number;
  longitude?: number;
  address?: string;
  
  // 반복 및 알림
  repeat?: PlanRepeatConfig;
  notifications: PlanNotification[];
  
  // 추가 정보
  tags: PlanTag[];
  attachments: PlanAttachment[];
  notes?: string;
  
  // 메타데이터
  metadata: PlanMetadata;
}

// 계획 생성 시 사용할 데이터
export interface PlanFormData {
  title: string;
  description?: string;
  category: PlanCategory;
  priority: PlanPriority;
  startDate: string;
  endDate?: string;
  startTime?: string;
  endTime?: string;
  allDay: boolean;
  location?: string;
  tags?: string[];
  notes?: string;
}

// 계획 업데이트 시 사용할 데이터
export interface PlanUpdateData extends Partial<PlanFormData> {
  status?: PlanStatus;
  notifications?: PlanNotification[];
}

// 계획 필터 옵션
export interface PlanFilterOptions {
  status?: PlanStatus[];
  category?: PlanCategory[];
  priority?: PlanPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  tags?: string[];
  searchQuery?: string;
}

// 계획 정렬 옵션
export interface PlanSortOptions {
  field: 'title' | 'startDate' | 'priority' | 'createdAt' | 'updatedAt';
  direction: 'asc' | 'desc';
}

// 계획 통계
export interface PlanStats {
  total: number;
  byStatus: Record<PlanStatus, number>;
  byCategory: Record<PlanCategory, number>;
  byPriority: Record<PlanPriority, number>;
  upcoming: number;
  overdue: number;
  completed: number;
}

// 계획 동기화 상태
export interface PlanSyncState {
  lastSyncAt: string;
  pendingChanges: number;
  conflicts: number;
  isOnline: boolean;
  syncInProgress: boolean;
}

// 서버 연동을 위한 인터페이스 (확장성 고려)
export interface PlanServerData extends Plan {
  serverId?: string;
  revision?: number;
  conflicts?: Plan[];
}

// 계획 내보내기/가져오기 형식
export interface PlanExportData {
  version: string;
  exportedAt: string;
  plans: Plan[];
  metadata: {
    totalPlans: number;
    dateRange: {
      start: string;
      end: string;
    };
  };
}
