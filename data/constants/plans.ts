import { PlanStatus } from '@/types/plan/type';

// 계획 상태 정보
export const PLAN_STATUSES = {
  [PlanStatus.DRAFT]: {
    name: '초안',
    color: '#6B7280',
    icon: 'edit',
    description: '작성 중인 계획',
  },
  [PlanStatus.ACTIVE]: {
    name: '활성',
    color: '#10B981',
    icon: 'play-arrow',
    description: '진행 중인 계획',
  },
  [PlanStatus.COMPLETED]: {
    name: '완료',
    color: '#3B82F6',
    icon: 'check-circle',
    description: '완료된 계획',
  },
  [PlanStatus.CANCELLED]: {
    name: '취소',
    color: '#EF4444',
    icon: 'cancel',
    description: '취소된 계획',
  },
  [PlanStatus.ARCHIVED]: {
    name: '보관',
    color: '#8B5CF6',
    icon: 'archive',
    description: '보관된 계획',
  },
} as const;

// 기본 태그 색상
export const DEFAULT_TAG_COLORS = [
  '#EF4444', // 빨강
  '#F59E0B', // 주황
  '#10B981', // 초록
  '#3B82F6', // 파랑
  '#8B5CF6', // 보라
  '#EC4899', // 분홍
  '#06B6D4', // 청록
  '#84CC16', // 연두
  '#F97316', // 주황
  '#6366F1', // 인디고
] as const;

// 기본 알림 시간 (분 단위)
export const DEFAULT_NOTIFICATION_OFFSETS = [
  0,      // 정시
  15,     // 15분 전
  30,     // 30분 전
  60,     // 1시간 전
  1440,   // 1일 전
  10080,  // 1주일 전
] as const;

// 계획 정렬 옵션
export const PLAN_SORT_OPTIONS = [
  { value: 'startDate', label: '시작일', icon: 'event' },
  { value: 'title', label: '제목', icon: 'sort-by-alpha' },
  { value: 'createdAt', label: '생성일', icon: 'add-circle' },
  { value: 'updatedAt', label: '수정일', icon: 'edit' },
] as const;

// 계획 필터 옵션
export const PLAN_FILTER_OPTIONS = {
  status: Object.entries(PLAN_STATUSES).map(([value, status]) => ({
    value,
    label: status.name,
    color: status.color,
  })),
} as const;

// 계획 제한사항
export const PLAN_LIMITS = {
  MAX_TITLE_LENGTH: 100,
  MAX_DESCRIPTION_LENGTH: 1000,
  MAX_TAGS_COUNT: 10,
  MAX_NOTIFICATIONS_COUNT: 5,
  MAX_ATTACHMENTS_COUNT: 10,
  MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024, // 10MB
} as const;

// 계획 기본값
export const PLAN_DEFAULTS = {
  allDay: false,
  startTime: '09:00',
  endTime: '10:00',
} as const;
