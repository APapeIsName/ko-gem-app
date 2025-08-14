import { Plan } from '@/types/plan/type';

export const mockPlans: Plan[] = [
  {
    id: '1',
    date: '2024-04-15',
    items: [
      {
        id: '1-1',
        title: '한강공원 산책',
        description: '봄날 한강변에서 산책하기',
        time: '14:00',
        location: '한강공원',
        isCompleted: false,
      },
      {
        id: '1-2',
        title: '카페에서 독서',
        description: '새로 오픈한 카페에서 책 읽기',
        time: '16:00',
        location: '강남역 카페',
        isCompleted: true,
      },
    ],
    createdAt: '2024-04-14T10:00:00Z',
    updatedAt: '2024-04-14T10:00:00Z',
  },
  {
    id: '2',
    date: '2024-04-16',
    items: [
      {
        id: '2-1',
        title: '영화 보기',
        description: '새로 개봉한 영화 보기',
        time: '19:00',
        location: 'CGV 강남점',
        isCompleted: false,
      },
    ],
    createdAt: '2024-04-14T15:00:00Z',
    updatedAt: '2024-04-14T15:00:00Z',
  },
];
