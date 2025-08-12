// 지역 관련 상수
export const REGIONS = {
  SEOUL: '서울',
  BUSAN: '부산',
  DAEGU: '대구',
  INCHEON: '인천',
  GWANGJU: '광주',
  DAEJEON: '대전',
  ULSAN: '울산',
  SEJONG: '세종',
  GYEONGGI: '경기',
  GANGWON: '강원',
  CHUNGCHEONG_NORTH: '충북',
  CHUNGCHEONG_SOUTH: '충남',
  JEOLLA_NORTH: '전북',
  JEOLLA_SOUTH: '전남',
  GYEONGSANG_NORTH: '경북',
  GYEONGSANG_SOUTH: '경남',
  JEJU: '제주'
} as const;

export type Region = typeof REGIONS[keyof typeof REGIONS];

// 지역별 좌표 (대표 좌표)
export const REGION_COORDINATES = {
  [REGIONS.SEOUL]: { latitude: 37.5665, longitude: 126.9780 },
  [REGIONS.BUSAN]: { latitude: 35.1796, longitude: 129.0756 },
  [REGIONS.DAEGU]: { latitude: 35.8714, longitude: 128.6014 },
  [REGIONS.INCHEON]: { latitude: 37.4563, longitude: 126.7052 },
  [REGIONS.GWANGJU]: { latitude: 35.1595, longitude: 126.8526 },
  [REGIONS.DAEJEON]: { latitude: 36.3504, longitude: 127.3845 },
  [REGIONS.ULSAN]: { latitude: 35.5384, longitude: 129.3114 },
  [REGIONS.SEJONG]: { latitude: 36.4870, longitude: 127.2820 },
  [REGIONS.GYEONGGI]: { latitude: 37.4138, longitude: 127.5183 },
  [REGIONS.GANGWON]: { latitude: 37.8228, longitude: 128.1555 },
  [REGIONS.CHUNGCHEONG_NORTH]: { latitude: 36.8000, longitude: 127.7000 },
  [REGIONS.CHUNGCHEONG_SOUTH]: { latitude: 36.5184, longitude: 126.8000 },
  [REGIONS.JEOLLA_NORTH]: { latitude: 35.7175, longitude: 127.1530 },
  [REGIONS.JEOLLA_SOUTH]: { latitude: 34.8679, longitude: 126.9910 },
  [REGIONS.GYEONGSANG_NORTH]: { latitude: 36.4919, longitude: 128.8889 },
  [REGIONS.GYEONGSANG_SOUTH]: { latitude: 35.4606, longitude: 128.2132 },
  [REGIONS.JEJU]: { latitude: 33.4996, longitude: 126.5312 }
} as const;
