import { Section } from '@/types/find/list/type';

// 장소 목업 데이터
export const mockPlaces = {
  // 코젬 픽 (추천 장소)
  kogemPicks: [
    {
      id: '1',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "도교먹 배재로",
      subtitle: "오펀리",
      overlay: "00",
      category: "음식점",
      rating: 4.5,
      reviewCount: 128,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '2',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "앤레이",
      subtitle: "이승비조정한",
      overlay: "00",
      category: "카페",
      rating: 4.3,
      reviewCount: 95,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '3',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "신청의문",
      subtitle: "언들졸라",
      overlay: "00",
      category: "음식점",
      rating: 4.7,
      reviewCount: 156,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '4',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "맛있는 한식집",
      subtitle: "전통 한식",
      overlay: "00",
      category: "음식점",
      rating: 4.8,
      reviewCount: 312,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '5',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "아늑한 카페",
      subtitle: "분위기 좋은",
      overlay: "00",
      category: "카페",
      rating: 4.5,
      reviewCount: 198,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    }
  ],

  // 인기 장소
  popularPlaces: [
    {
      id: '6',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "분석편유 히 견",
      subtitle: "교범학증",
      overlay: "00",
      category: "관광지",
      rating: 4.6,
      reviewCount: 234,
      isRecommended: false,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '7',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "조롱의보회노",
      subtitle: "문석 어메고",
      overlay: "00",
      category: "문화시설",
      rating: 4.4,
      reviewCount: 187,
      isRecommended: false,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '8',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "접심는일음",
      subtitle: "젼릉헌홰",
      overlay: "00",
      category: "음식점",
      rating: 4.2,
      reviewCount: 142,
      isRecommended: false,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '9',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "역사 박물관",
      subtitle: "문화 유산",
      overlay: "00",
      category: "문화시설",
      rating: 4.3,
      reviewCount: 165,
      isRecommended: false,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '10',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "자연 공원",
      subtitle: "휴식 공간",
      overlay: "00",
      category: "관광지",
      rating: 4.1,
      reviewCount: 98,
      isRecommended: false,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    }
  ],

  // 요즘 뜨는 행사
  trendingEvents: [
    {
      id: '11',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "봄맞이 꽃 축제",
      subtitle: "벚꽃 만개 시즌",
      overlay: "HOT",
      category: "축제",
      rating: 4.8,
      reviewCount: 456,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '12',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "야외 콘서트",
      subtitle: "라이브 음악",
      overlay: "NEW",
      category: "공연",
      rating: 4.7,
      reviewCount: 234,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '13',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "푸드 트럭 페스티벌",
      subtitle: "다양한 음식",
      overlay: "EVENT",
      category: "축제",
      rating: 4.5,
      reviewCount: 189,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '14',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "전통 문화 체험",
      subtitle: "한복 입기",
      overlay: "POP",
      category: "체험",
      rating: 4.6,
      reviewCount: 167,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    },
    {
      id: '15',
      image: require('@/assets/images/partial-react-logo.png'),
      title: "야간 불꽃 축제",
      subtitle: "밤하늘의 불꽃",
      overlay: "SPECIAL",
      category: "축제",
      rating: 4.9,
      reviewCount: 312,
      isRecommended: true,
      location: {
        latitude: 37.5665,
        longitude: 126.9780,
        address: "서울특별시 강남구"
      }
    }
  ],

  // 카테고리별 장소
  categories: {
    음식점: [
      {
        id: '7',
        image: require('@/assets/images/partial-react-logo.png'),
        title: "맛있는 한식집",
        subtitle: "전통 한식",
        overlay: "00",
        category: "음식점",
        rating: 4.8,
        reviewCount: 312,
        isRecommended: true,
        location: {
          latitude: 37.5665,
          longitude: 126.9780,
          address: "서울특별시 강남구"
        }
      }
    ],
    카페: [
      {
        id: '8',
        image: require('@/assets/images/partial-react-logo.png'),
        title: "아늑한 카페",
        subtitle: "분위기 좋은",
        overlay: "00",
        category: "카페",
        rating: 4.5,
        reviewCount: 198,
        isRecommended: true,
        location: {
          latitude: 37.5665,
          longitude: 126.9780,
          address: "서울특별시 강남구"
        }
      }
    ]
  }
};

// 섹션 기반 데이터 구조
export const homeSections: Section[] = [
  {
    id: 'kogem-picks',
    title: '코젬 추천 픽 👍',
    type: 'horizontal-scroll',
    items: mockPlaces.kogemPicks,
    maxItems: 5,
    moreButtonText: '더보기',
    onMorePress: () => console.log('코젬 추천 픽 더보기')
  },
  {
    id: 'popular-places',
    title: '지금 핫한 곳 🔥',
    type: 'horizontal-scroll',
    items: mockPlaces.popularPlaces,
    maxItems: 5,
    moreButtonText: '더보기',
    onMorePress: () => console.log('지금 핫한 곳 더보기')
  },
  {
    id: 'trending-events',
    title: '요즘 뜨는 행사 🎉',
    type: 'horizontal-scroll',
    items: mockPlaces.trendingEvents,
    maxItems: 5,
    moreButtonText: '더보기',
    onMorePress: () => console.log('요즘 뜨는 행사 더보기')
  }
];
