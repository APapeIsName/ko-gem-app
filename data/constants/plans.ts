import { PlanCategory, PlanPriority, PlanStatus } from '@/types/plan/type';

// 계획 카테고리 정보
export const PLAN_CATEGORIES = {
  [PlanCategory.TRAVEL]: {
    name: '여행',
    icon: 'flight',
    color: '#10B981',
    description: '여행 및 휴가 계획',
  },
  [PlanCategory.WORK]: {
    name: '업무',
    icon: 'work',
    color: '#3B82F6',
    description: '업무 및 회의 계획',
  },
  [PlanCategory.PERSONAL]: {
    name: '개인',
    icon: 'person',
    color: '#8B5CF6',
    description: '개인적인 일정',
  },
  [PlanCategory.HEALTH]: {
    name: '건강',
    icon: 'favorite',
    color: '#EF4444',
    description: '운동 및 건강 관리',
  },
  [PlanCategory.STUDY]: {
    name: '학습',
    icon: 'school',
    color: '#F59E0B',
    description: '공부 및 교육',
  },
  [PlanCategory.SHOPPING]: {
    name: '쇼핑',
    icon: 'shopping-cart',
    color: '#EC4899',
    description: '쇼핑 및 구매',
  },
  [PlanCategory.ENTERTAINMENT]: {
    name: '엔터테인먼트',
    icon: 'movie',
    color: '#06B6D4',
    description: '영화, 게임, 취미',
  },
  [PlanCategory.OTHER]: {
    name: '기타',
    icon: 'more-horiz',
    color: '#6B7280',
    description: '기타 일정',
  },
} as const;

// 계획 우선순위 정보
export const PLAN_PRIORITIES = {
  [PlanPriority.LOW]: {
    name: '낮음',
    color: '#6B7280',
    icon: 'arrow-downward',
    description: '낮은 우선순위',
  },
  [PlanPriority.MEDIUM]: {
    name: '보통',
    color: '#3B82F6',
    icon: 'remove',
    description: '보통 우선순위',
  },
  [PlanPriority.HIGH]: {
    name: '높음',
    color: '#F59E0B',
    icon: 'arrow-upward',
    description: '높은 우선순위',
  },
  [PlanPriority.URGENT]: {
    name: '긴급',
    color: '#EF4444',
    icon: 'priority-high',
    description: '긴급한 일정',
  },
} as const;

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
  { value: 'priority', label: '우선순위', icon: 'priority-high' },
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
  category: Object.entries(PLAN_CATEGORIES).map(([value, category]) => ({
    value,
    label: category.name,
    color: category.color,
  })),
  priority: Object.entries(PLAN_PRIORITIES).map(([value, priority]) => ({
    value,
    label: priority.name,
    color: priority.color,
  })),
} as const;

// 계획 템플릿
export const PLAN_TEMPLATES = [
  {
    id: 'daily-routine',
    name: '일일 루틴',
    category: PlanCategory.PERSONAL,
    description: '매일 반복되는 일상적인 계획',
    template: {
      title: '일일 루틴',
      category: PlanCategory.PERSONAL,
      priority: PlanPriority.MEDIUM,
      allDay: true,
      repeat: {
        type: 'daily' as const,
        interval: 1,
      },
    },
  },
  {
    id: 'weekly-meeting',
    name: '주간 회의',
    category: PlanCategory.WORK,
    description: '매주 반복되는 회의',
    template: {
      title: '주간 회의',
      category: PlanCategory.WORK,
      priority: PlanPriority.HIGH,
      allDay: false,
      startTime: '09:00',
      endTime: '10:00',
      repeat: {
        type: 'weekly' as const,
        interval: 1,
        daysOfWeek: [1], // 월요일
      },
    },
  },
  {
    id: 'monthly-review',
    name: '월간 리뷰',
    category: PlanCategory.WORK,
    description: '매월 진행상황 점검',
    template: {
      title: '월간 리뷰',
      category: PlanCategory.WORK,
      priority: PlanPriority.MEDIUM,
      allDay: true,
      repeat: {
        type: 'monthly' as const,
        interval: 1,
      },
    },
  },
] as const;

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
  category: PlanCategory.PERSONAL,
  priority: PlanPriority.MEDIUM,
  allDay: false,
  startTime: '09:00',
  endTime: '10:00',
} as const;
