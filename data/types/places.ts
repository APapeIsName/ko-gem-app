// 장소 데이터 타입 (UI와 API 공통 사용)
export interface PlaceData {
  id: string;
  image: any; // require()로 불러온 이미지
  title: string;
  subtitle: string;
  overlay: string;
  category: string;
  rating: number;
  reviewCount: number;
  isRecommended: boolean;
  location: {
    latitude: number;
    longitude: number;
    address: string;
  };
}

// 카드 데이터 타입 (UI 전용)
export interface CardData {
  image: any;
  title: string;
  subtitle: string;
  overlay: string;
}

// 장소 목업 데이터 타입
export interface MockPlacesData {
  kogemPicks: PlaceData[];
  popularPlaces: PlaceData[];
  categories: {
    [key: string]: PlaceData[];
  };
}
