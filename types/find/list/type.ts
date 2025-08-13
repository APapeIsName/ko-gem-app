// 장소 기본 타입
export interface Place {
  id: string;
  image: any; // expo-image source
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

// 섹션 타입
export interface Section {
  id: string;
  title: string;
  type: 'horizontal-scroll' | 'grid' | 'list';
  items: Place[];
  maxItems?: number;
  showMoreButton?: boolean;
  moreButtonText?: string;
  onMorePress?: () => void;
}

// 이미지 카드 섹션 Props
export interface ImageCardSectionProps {
  section: Section;
  onItemPress?: (item: Place) => void;
  onMorePress?: () => void;
}

// 이미지 카드 Props
export interface ImageCardProps {
  item: Place;
  onPress?: () => void;
}

// 더보기 버튼 Props
export interface MoreButtonProps {
  text?: string;
  onPress?: () => void;
  size?: 'small' | 'medium' | 'large';
}
