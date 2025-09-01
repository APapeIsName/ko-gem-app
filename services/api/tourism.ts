import axios from 'axios';
import { Platform } from 'react-native';

// 환경변수에서 serviceKey 가져오기 (디코딩된 값 사용)
const TOURISM_SERVICE_KEY = decodeURIComponent(process.env.EXPO_PUBLIC_TOUR_API_KEY || '');

// API 기본 설정
const TOURISM_API_BASE_URL = 'http://apis.data.go.kr/B551011/KorService2';

// 관광 타입 상수
export const TOURISM_CONTENT_TYPES = {
  TOURIST_SPOT: 12,      // 관광지
  CULTURAL_FACILITY: 14, // 문화시설
  FESTIVAL_EVENT: 15,    // 축제공연행사
  TRAVEL_COURSE: 25,     // 여행코스
  LEISURE_SPORTS: 28,    // 레포츠
  ACCOMMODATION: 32,     // 숙박
  SHOPPING: 38,          // 쇼핑
  RESTAURANT: 39,        // 음식점
} as const;

export type TourismContentType = typeof TOURISM_CONTENT_TYPES[keyof typeof TOURISM_CONTENT_TYPES];

// 플랫폼별 MobileOS 값 설정
const getMobileOS = (): string => {
  switch (Platform.OS) {
    case 'ios':
      return 'IOS';
    case 'android':
      return 'AND';
    default:
      return 'ETC';
  }
};

// 공통 파라미터
const getCommonParams = () => ({
  MobileOS: getMobileOS(),
  MobileApp: 'KoGem',
  serviceKey: TOURISM_SERVICE_KEY,
  _type: 'json',
});

// 지역 코드 조회 응답 타입
interface AreaCodeItem {
  rnum: number;
  code: string;
  name: string;
}

interface AreaCodeResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: AreaCodeItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 관광지 정보 조회 응답 타입
interface TouristSpotItem {
  rnum: number;
  contentId: string;
  contentTypeId: string;
  title: string;
  addr1: string;
  addr2: string;
  zipcode: string;
  tel: string;
  firstimage: string;
  firstimage2: string;
  readcount: number;
  sidoCode: string;
  sigunguCode: string;
  cat1: string;
  cat2: string;
  cat3: string;
  createdTime: string;
  modifiedTime: string;
  booktour: string;
  mapX: string;
  mapY: string;
  mlevel: string;
  areacode: string;
  sigungucode: string;
}

interface TouristSpotResponse {
  response: {
    header: {
      resultCode: string;
      resultMsg: string;
    };
    body: {
      items: {
        item: TouristSpotItem[];
      };
      numOfRows: number;
      pageNo: number;
      totalCount: number;
    };
  };
}

// 지역 코드 조회
export const getAreaCodes = async (
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<AreaCodeItem[]> => {
  try {
    const params = {
      MobileOS: getMobileOS(),
      MobileApp: 'KoGem',
      serviceKey: TOURISM_SERVICE_KEY,
      _type: 'json',
      numOfRows,
      pageNo,
    };

    const fullUrl = `${TOURISM_API_BASE_URL}/areaCode2`;
    console.log('요청 URL:', fullUrl);
    console.log('요청 파라미터:', params);
    console.log('MobileOS 값:', getMobileOS());

    const response = await axios.get(fullUrl, {
      params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('응답 상태:', response.status);
    console.log('응답 헤더:', response.headers);
    console.log('API 응답 전체:', JSON.stringify(response.data, null, 2));

    // 응답 구조 확인 및 안전한 처리
    const responseData = response.data;
    
    if (!responseData || !responseData.response) {
      console.error('응답 데이터가 없거나 response 필드가 없습니다:', responseData);
      return [];
    }

    if (!responseData.response.body || !responseData.response.body.items) {
      console.error('body 또는 items 필드가 없습니다:', responseData.response);
      return [];
    }

    const items = responseData.response.body.items;
    
    // item이 배열인지 확인
    if (Array.isArray(items.item)) {
      console.log('성공적으로 지역 코드 로드:', items.item.length, '개');
      return items.item;
    } else if (items.item) {
      // 단일 객체인 경우 배열로 변환
      console.log('단일 지역 코드 로드');
      return [items.item];
    } else {
      console.error('items.item이 없습니다:', items);
      return [];
    }
  } catch (error: any) {
    console.error('Failed to fetch area codes:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error status text:', error.response?.statusText);
    console.error('Error details:', error.response?.data);
    console.error('Error config:', error.config);
    throw error;
  }
};

// 관광지 정보 조회
export const getTouristSpots = async (
  contentTypeId: TourismContentType,
  areaCode?: string,
  numOfRows: number = 1000,
  pageNo: number = 1,
  arrange?: string
): Promise<TouristSpotItem[]> => {
  try {
    const params: any = {
      MobileOS: getMobileOS(),
      MobileApp: 'KoGem',
      serviceKey: TOURISM_SERVICE_KEY,
      _type: 'json',
      numOfRows,
      pageNo,
      contentTypeId,
    };

    // areaCode가 있을 때만 추가
    if (areaCode) {
      params.areaCode = areaCode;
    }

    // arrange가 있을 때만 추가
    if (arrange) {
      params.arrange = arrange;
    }

    const fullUrl = `${TOURISM_API_BASE_URL}/areaBasedList2`;
    console.log('관광지 조회 요청 URL:', fullUrl);
    console.log('관광지 조회 요청 파라미터:', params);

    const response = await axios.get(fullUrl, {
      params,
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      timeout: 10000,
    });

    console.log('관광지 조회 응답 상태:', response.status);
    console.log('관광지 조회 API 응답 전체:', JSON.stringify(response.data, null, 2));

    // 응답 구조 확인 및 안전한 처리
    const responseData = response.data;
    
    if (!responseData || !responseData.response) {
      console.error('관광지 응답 데이터가 없거나 response 필드가 없습니다:', responseData);
      return [];
    }

    if (!responseData.response.body || !responseData.response.body.items) {
      console.error('관광지 body 또는 items 필드가 없습니다:', responseData.response);
      return [];
    }

    const items = responseData.response.body.items;
    
    // item이 배열인지 확인
    if (Array.isArray(items.item)) {
      console.log('성공적으로 관광지 로드:', items.item.length, '개');
      return items.item;
    } else if (items.item) {
      // 단일 객체인 경우 배열로 변환
      console.log('단일 관광지 로드');
      return [items.item];
    } else {
      console.error('관광지 items.item이 없습니다:', items);
      return [];
    }
  } catch (error: any) {
    console.error('Failed to fetch tourist spots:', error);
    console.error('Error status:', error.response?.status);
    console.error('Error status text:', error.response?.statusText);
    console.error('Error details:', error.response?.data);
    console.error('Error config:', error.config);
    throw error;
  }
};

// 시군구 코드 조회
export const getSigunguCodes = async (
  areaCode: string,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<any> => {
  try {
    const params = {
      ...getCommonParams(),
      areaCode,
      numOfRows,
      pageNo,
    };

    const response = await axios.get(`${TOURISM_API_BASE_URL}/sigunguCode2`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch sigungu codes:', error);
    throw error;
  }
};

// 관광지 상세 정보 조회
export const getTouristSpotDetail = async (contentId: string): Promise<any> => {
  try {
    const params = {
      ...getCommonParams(),
      contentId,
    };

    const response = await axios.get(`${TOURISM_API_BASE_URL}/detailCommon2`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch tourist spot detail:', error);
    throw error;
  }
};

// 관광지 검색
export const searchTouristSpots = async (
  keyword: string,
  areaCode?: string,
  sigunguCode?: string,
  numOfRows: number = 20,
  pageNo: number = 1
): Promise<any> => {
  try {
    const params: any = {
      ...getCommonParams(),
      keyword,
      numOfRows,
      pageNo,
    };

    if (areaCode) {
      params.areaCode = areaCode;
    }

    if (sigunguCode) {
      params.sigunguCode = sigunguCode;
    }

    const response = await axios.get(`${TOURISM_API_BASE_URL}/searchKeyword2`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to search tourist spots:', error);
    throw error;
  }
};

// 관광지 이미지 조회
export const getTouristSpotImages = async (contentId: string): Promise<any> => {
  try {
    const params = {
      ...getCommonParams(),
      contentId,
    };

    const response = await axios.get(`${TOURISM_API_BASE_URL}/detailImage2`, {
      params,
    });

    return response.data;
  } catch (error) {
    console.error('Failed to fetch tourist spot images:', error);
    throw error;
  }
};
