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

// 카테고리별 아이콘 매핑
export const CATEGORY_ICONS = {
  [PLACE_CATEGORIES.RESTAURANT]: 'fork.knife',
  [PLACE_CATEGORIES.CAFE]: 'cup.and.saucer.fill',
  [PLACE_CATEGORIES.TOURIST]: 'camera.fill',
  [PLACE_CATEGORIES.CULTURE]: 'building.columns.fill',
  [PLACE_CATEGORIES.SHOPPING]: 'bag.fill',
  [PLACE_CATEGORIES.ENTERTAINMENT]: 'gamecontroller.fill',
  [PLACE_CATEGORIES.OUTDOOR]: 'leaf.fill',
  [PLACE_CATEGORIES.TRANSPORT]: 'car.fill',
  [PLACE_CATEGORIES.ACCOMMODATION]: 'bed.double.fill',
  [PLACE_CATEGORIES.OTHER]: 'ellipsis.circle.fill'
} as const;
