import { Platform } from 'react-native';

// 고유 ID 생성
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// UUID 생성 (v4)
export function generateUUID(): string {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// 날짜 포맷팅
export function formatDate(date: Date | string, format: 'YYYY-MM-DD' | 'MM/DD' | 'MM월 DD일' | 'relative' = 'YYYY-MM-DD'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Date';
  }

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');

  switch (format) {
    case 'YYYY-MM-DD':
      return `${year}-${month}-${day}`;
    case 'MM/DD':
      return `${month}/${day}`;
    case 'MM월 DD일':
      return `${month}월 ${day}일`;
    case 'relative':
      return getRelativeDate(dateObj);
    default:
      return `${year}-${month}-${day}`;
  }
}

// 상대적 날짜 표시 (예: 오늘, 어제, 3일 전)
function getRelativeDate(date: Date): string {
  const now = new Date();
  const diffTime = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return '오늘';
  if (diffDays === 1) return '어제';
  if (diffDays === -1) return '내일';
  if (diffDays > 0) return `${diffDays}일 전`;
  if (diffDays < 0) return `${Math.abs(diffDays)}일 후`;

  return formatDate(date, 'MM월 DD일');
}

// 시간 포맷팅
export function formatTime(date: Date | string, format: 'HH:mm' | 'HH:mm:ss' | 'AM/PM' = 'HH:mm'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return 'Invalid Time';
  }

  const hours = dateObj.getHours();
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');

  switch (format) {
    case 'HH:mm':
      return `${String(hours).padStart(2, '0')}:${minutes}`;
    case 'HH:mm:ss':
      return `${String(hours).padStart(2, '0')}:${minutes}:${seconds}`;
    case 'AM/PM':
      const ampm = hours >= 12 ? 'PM' : 'AM';
      const displayHours = hours % 12 || 12;
      return `${displayHours}:${minutes} ${ampm}`;
    default:
      return `${String(hours).padStart(2, '0')}:${minutes}`;
  }
}

// 날짜 파싱
export function parseDate(dateString: string): Date {
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    throw new Error(`Invalid date string: ${dateString}`);
  }
  return date;
}

// 날짜 유효성 검사
export function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}

// 요일 이름 가져오기
export function getDayName(date: Date | string, format: 'short' | 'long' | 'number' = 'short'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const day = dateObj.getDay();
  
  const dayNames = {
    short: ['일', '월', '화', '수', '목', '금', '토'],
    long: ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'],
    number: ['0', '1', '2', '3', '4', '5', '6']
  };

  return dayNames[format][day];
}

// 현재 날짜를 YYYY-MM-DD 형식으로 반환
export function getCurrentDate(): string {
  return formatDate(new Date(), 'YYYY-MM-DD');
}

// 한국 시간대 기준 현재 날짜 가져오기
export function getKoreanDate(): string {
  const now = new Date();
  // 한국 시간대 (UTC+9)로 정확하게 변환
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const koreanTime = new Date(utc + (9 * 60 * 60 * 1000));
  return koreanTime.toISOString().split('T')[0];
}

// UTC 날짜를 한국 시간대로 변환
export function convertUTCToKoreanDate(utcDateString: string): string {
  const utcDate = new Date(utcDateString);
  const koreanDate = new Date(utcDate.getTime() + (9 * 60 * 60 * 1000));
  return koreanDate.toISOString().split('T')[0];
}

// 한국 시간대 날짜를 UTC로 변환하여 저장용 ISO 문자열 생성
export function createKoreanDateTime(
  dateStr: string, 
  timeStr: string, 
  isAllDay: boolean, 
  isEndOfDay: boolean = false
): string {
  if (isAllDay) {
    // 종일 일정의 경우 UTC 기준으로 해당 날짜의 시작/끝 시간 설정
    // 날짜가 바뀌지 않도록 UTC 기준으로 직접 설정
    const utcDate = new Date(`${dateStr}T${isEndOfDay ? '23:59:59.000Z' : '00:00:00.000Z'}`);
    return utcDate.toISOString();
  } else {
    // 시간이 지정된 일정의 경우 한국 시간을 UTC로 변환
    const koreanDateTime = new Date(`${dateStr}T${timeStr}:00`);
    // 한국 시간을 UTC로 변환 (9시간 빼기)
    const utcDateTime = new Date(koreanDateTime.getTime() - (9 * 60 * 60 * 1000));
    return utcDateTime.toISOString();
  }
}

// 현재 시간을 HH:mm 형식으로 반환
export function getCurrentTime(): string {
  return formatTime(new Date(), 'HH:mm');
}

// 날짜 범위 생성 (시작일부터 종료일까지)
export function generateDateRange(startDate: string, endDate: string): string[] {
  const dates: string[] = [];
  const current = new Date(startDate);
  const end = new Date(endDate);

  while (current <= end) {
    dates.push(formatDate(current, 'YYYY-MM-DD'));
    current.setDate(current.getDate() + 1);
  }

  return dates;
}

// 날짜 차이 계산 (일 단위)
export function getDaysDifference(date1: string | Date, date2: string | Date): number {
  const d1 = typeof date1 === 'string' ? new Date(date1) : date1;
  const d2 = typeof date2 === 'string' ? new Date(date2) : date2;
  
  const diffTime = Math.abs(d2.getTime() - d1.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 주차 계산
export function getWeekOfYear(date: Date | string): number {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const start = new Date(dateObj.getFullYear(), 0, 1);
  const days = Math.floor((dateObj.getTime() - start.getTime()) / (24 * 60 * 60 * 1000));
  return Math.ceil((days + start.getDay() + 1) / 7);
}

// 월의 마지막 날짜
export function getLastDayOfMonth(year: number, month: number): number {
  return new Date(year, month, 0).getDate();
}

// 문자열 유틸리티
export function truncateString(str: string, maxLength: number, suffix: string = '...'): string {
  if (str.length <= maxLength) return str;
  return str.substring(0, maxLength) + suffix;
}

export function capitalizeFirst(str: string): string {
  if (!str) return str;
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

// 배열 유틸리티
export function chunkArray<T>(array: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
}

export function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// 객체 유틸리티
export function deepClone<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') return obj;
  if (obj instanceof Date) return new Date(obj.getTime()) as T;
  if (obj instanceof Array) return obj.map(item => deepClone(item)) as T;
  if (typeof obj === 'object') {
    const cloned = {} as T;
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
  return obj;
}

// 디바운스 함수
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout>;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// 쓰로틀 함수
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// 플랫폼별 유틸리티
export function isIOS(): boolean {
  return Platform.OS === 'ios';
}

export function isAndroid(): boolean {
  return Platform.OS === 'android';
}

// 색상 유틸리티
export function hexToRgba(hex: string, alpha: number = 1): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// 랜덤 색상 생성
export function generateRandomColor(): string {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

// 파일 크기 포맷팅
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// 전화번호 포맷팅
export function formatPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{4})(\d{4})$/);
  if (match) {
    return `${match[1]}-${match[2]}-${match[3]}`;
  }
  return phoneNumber;
}

// 이메일 유효성 검사
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// 비밀번호 강도 검사
export function getPasswordStrength(password: string): 'weak' | 'medium' | 'strong' {
  let score = 0;
  
  if (password.length >= 8) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  
  if (score <= 2) return 'weak';
  if (score <= 4) return 'medium';
  return 'strong';
}

/**
 * 태그 데이터를 안전하게 처리하여 문자열 배열로 변환
 * @param tags - 원본 태그 데이터
 * @returns 정규화된 태그 문자열 배열
 */
export function normalizeTags(tags: any): string[] {
  if (!tags) return [];
  
  // 이미 문자열 배열인 경우
  if (Array.isArray(tags) && tags.every(tag => typeof tag === 'string')) {
    return tags;
  }
  
  // 배열이지만 문자열이 아닌 요소가 포함된 경우
  if (Array.isArray(tags)) {
    return tags
      .map(tag => {
        if (typeof tag === 'string') return tag;
        if (typeof tag === 'object' && tag !== null) {
          // 객체인 경우 name 속성이 있으면 사용, 없으면 JSON.stringify
          return tag.name || JSON.stringify(tag);
        }
        return String(tag);
      })
      .filter(tag => tag && tag.trim().length > 0); // 빈 문자열 제거
  }
  
  // 문자열인 경우 (단일 태그)
  if (typeof tags === 'string') {
    return tags.trim() ? [tags.trim()] : [];
  }
  
  // 기타 타입인 경우
  return [];
}

/**
 * 태그를 표시용 텍스트로 변환
 * @param tag - 태그 데이터
 * @returns 표시용 태그 텍스트
 */
export function formatTag(tag: any): string {
  if (typeof tag === 'string') return tag;
  if (typeof tag === 'object' && tag !== null) {
    return tag.name || JSON.stringify(tag);
  }
  return String(tag);
}
