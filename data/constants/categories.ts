// 장소 카테고리 상수
export const PLACE_CATEGORIES = {
  RESTAURANT: '음식점',
  CAFE: '카페',
  TOURIST: '관광지',
  CULTURE: '문화시설',
  SHOPPING: '쇼핑',
  ENTERTAINMENT: '엔터테인먼트',
  OUTDOOR: '야외활동',
  TRANSPORT: '교통',
  ACCOMMODATION: '숙박',
  OTHER: '기타'
} as const;

export type PlaceCategory = typeof PLACE_CATEGORIES[keyof typeof PLACE_CATEGORIES];

// 카테고리별 아이콘 매핑 (MaterialIcons 기준)
export const CATEGORY_ICONS = {
  [PLACE_CATEGORIES.RESTAURANT]: 'restaurant',
  [PLACE_CATEGORIES.CAFE]: 'local-cafe',
  [PLACE_CATEGORIES.TOURIST]: 'camera-alt',
  [PLACE_CATEGORIES.CULTURE]: 'museum',
  [PLACE_CATEGORIES.SHOPPING]: 'shopping-bag',
  [PLACE_CATEGORIES.ENTERTAINMENT]: 'sports-esports',
  [PLACE_CATEGORIES.OUTDOOR]: 'park',
  [PLACE_CATEGORIES.TRANSPORT]: 'directions-car',
  [PLACE_CATEGORIES.ACCOMMODATION]: 'hotel',
  [PLACE_CATEGORIES.OTHER]: 'more-horiz'
} as const;
