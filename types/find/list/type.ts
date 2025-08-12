import { CardData } from '@/data';

// ImageCard 컴포넌트 props 타입
export interface ImageCardProps {
  /** 카드 이미지 */
  image: any;
  /** 카드 제목 */
  title: string;
  /** 카드 부제목 */
  subtitle: string;
  /** 이미지 위에 표시되는 오버레이 텍스트 */
  overlay: string;
  /** 카드 터치 시 실행될 함수 (선택사항) */
  onPress?: () => void;
}

// ImageCardSection 컴포넌트 props 타입
export interface ImageCardSectionProps {
  /** 섹션 제목 */
  title: string;
  /** 카드 데이터 배열 */
  cards: CardData[];
}

// CardData 타입을 다시 export (기존 코드와의 호환성을 위해)
export { CardData };
