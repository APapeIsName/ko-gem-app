import AsyncStorage from '@react-native-async-storage/async-storage';

// 메모리 캐시를 위한 Map
const memoryCache = new Map<string, any>();

// 기본 저장소 유틸리티 클래스
export class StorageService {
  private static instance: StorageService;

  private constructor() {}

  public static getInstance(): StorageService {
    if (!StorageService.instance) {
      StorageService.instance = new StorageService();
    }
    return StorageService.instance;
  }

  // 문자열 저장
  async setString(key: string, value: string): Promise<void> {
    try {
      // 메모리 캐시 업데이트
      memoryCache.set(key, value);
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error('Failed to save string:', error);
    }
  }

  // 문자열 조회
  async getString(key: string, defaultValue?: string): Promise<string | undefined> {
    try {
      // 메모리 캐시 확인
      if (memoryCache.has(key)) {
        return memoryCache.get(key);
      }

      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        // 메모리 캐시에 저장
        memoryCache.set(key, value);
        return value;
      }
      return defaultValue;
    } catch (error) {
      console.error('Failed to get string:', error);
      return defaultValue;
    }
  }

  // 숫자 저장
  async setNumber(key: string, value: number): Promise<void> {
    try {
      memoryCache.set(key, value);
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Failed to save number:', error);
    }
  }

  // 숫자 조회
  async getNumber(key: string, defaultValue?: number): Promise<number | undefined> {
    try {
      if (memoryCache.has(key)) {
        return memoryCache.get(key);
      }

      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const num = parseFloat(value);
        if (!isNaN(num)) {
          memoryCache.set(key, num);
          return num;
        }
      }
      return defaultValue;
    } catch (error) {
      console.error('Failed to get number:', error);
      return defaultValue;
    }
  }

  // 불린 저장
  async setBoolean(key: string, value: boolean): Promise<void> {
    try {
      memoryCache.set(key, value);
      await AsyncStorage.setItem(key, value.toString());
    } catch (error) {
      console.error('Failed to save boolean:', error);
    }
  }

  // 불린 조회
  async getBoolean(key: string, defaultValue?: boolean): Promise<boolean | undefined> {
    try {
      if (memoryCache.has(key)) {
        return memoryCache.get(key);
      }

      const value = await AsyncStorage.getItem(key);
      if (value !== null) {
        const boolValue = value === 'true';
        memoryCache.set(key, boolValue);
        return boolValue;
      }
      return defaultValue;
    } catch (error) {
      console.error('Failed to get boolean:', error);
      return defaultValue;
    }
  }

  // 객체 저장 (JSON 직렬화)
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      memoryCache.set(key, value);
      const serialized = JSON.stringify(value);
      await AsyncStorage.setItem(key, serialized);
    } catch (error) {
      console.error('Failed to serialize object:', error);
    }
  }

  // 객체 조회 (JSON 역직렬화)
  async getObject<T>(key: string, defaultValue?: T): Promise<T | undefined> {
    try {
      if (memoryCache.has(key)) {
        return memoryCache.get(key);
      }

      const serialized = await AsyncStorage.getItem(key);
      if (serialized) {
        const parsed = JSON.parse(serialized) as T;
        memoryCache.set(key, parsed);
        return parsed;
      }
      return defaultValue;
    } catch (error) {
      console.error('Failed to deserialize object:', error);
      return defaultValue;
    }
  }

  // 배열 저장
  async setArray<T>(key: string, value: T[]): Promise<void> {
    await this.setObject(key, value);
  }

  // 배열 조회
  async getArray<T>(key: string, defaultValue?: T[]): Promise<T[] | undefined> {
    return this.getObject<T[]>(key, defaultValue);
  }

  // 키 존재 여부 확인
  async contains(key: string): Promise<boolean> {
    try {
      if (memoryCache.has(key)) {
        return true;
      }
      const value = await AsyncStorage.getItem(key);
      return value !== null;
    } catch (error) {
      console.error('Failed to check key existence:', error);
      return false;
    }
  }

  // 키 삭제
  async delete(key: string): Promise<void> {
    try {
      memoryCache.delete(key);
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error('Failed to delete key:', error);
    }
  }

  // 모든 키 조회
  async getAllKeys(): Promise<string[]> {
    try {
      return await AsyncStorage.getAllKeys();
    } catch (error) {
      console.error('Failed to get all keys:', error);
      return [];
    }
  }

  // 특정 패턴의 키들 조회
  async getKeysByPattern(pattern: RegExp): Promise<string[]> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      return keys.filter(key => pattern.test(key));
    } catch (error) {
      console.error('Failed to get keys by pattern:', error);
      return [];
    }
  }

  // 저장소 초기화
  async clear(): Promise<void> {
    try {
      memoryCache.clear();
      await AsyncStorage.clear();
    } catch (error) {
      console.error('Failed to clear storage:', error);
    }
  }

  // 메모리 캐시 초기화
  clearCache(): void {
    memoryCache.clear();
  }

  // 특정 키의 캐시만 초기화
  clearCacheForKey(key: string): void {
    memoryCache.delete(key);
  }

  // 저장소 크기 조회 (AsyncStorage는 직접적인 크기 조회를 지원하지 않음)
  async getSize(): Promise<number> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      let totalSize = 0;
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        if (value) {
          totalSize += key.length + value.length;
        }
      }
      
      return totalSize;
    } catch (error) {
      console.error('Failed to get storage size:', error);
      return 0;
    }
  }
}

// 편의 함수들
export const storageService = StorageService.getInstance();

// 계획 관련 저장소 키 상수
export const STORAGE_KEYS = {
  PLANS: 'plans',
  PLAN_DRAFTS: 'plan_drafts',
  USER_PREFERENCES: 'user_preferences',
  LAST_SYNC: 'last_sync',
} as const;

// 타입 안전한 저장소 접근을 위한 제네릭 함수들
export async function saveToStorage<T>(key: string, value: T): Promise<void> {
  await storageService.setObject(key, value);
}

export async function loadFromStorage<T>(key: string, defaultValue?: T): Promise<T | undefined> {
  return await storageService.getObject<T>(key, defaultValue);
}

export async function removeFromStorage(key: string): Promise<void> {
  await storageService.delete(key);
}

export async function clearStorage(): Promise<void> {
  await storageService.clear();
}

// 캐시 관련 편의 함수들
export function clearStorageCache(): void {
  storageService.clearCache();
}

export function clearStorageCacheForKey(key: string): void {
  storageService.clearCacheForKey(key);
}

// 계획 데이터를 위한 최적화된 함수들
export async function savePlansBatch(plans: any[]): Promise<void> {
  try {
    // 계획 목록을 저장
    await storageService.setObject(STORAGE_KEYS.PLANS, plans);
    
    // 개별 계획도 별도 키로 저장 (빠른 접근을 위해)
    const batchPromises = plans.map(plan => 
      storageService.setObject(`plan_${plan.id}`, plan)
    );
    
    await Promise.all(batchPromises);
  } catch (error) {
    console.error('Failed to save plans batch:', error);
  }
}

export async function loadPlansBatch(): Promise<any[]> {
  try {
    // 먼저 메모리 캐시에서 확인
    if (memoryCache.has(STORAGE_KEYS.PLANS)) {
      const cached = memoryCache.get(STORAGE_KEYS.PLANS);
      return cached || [];
    }
    
    // 계획 목록을 불러옴
    const plans = await storageService.getObject<any[]>(STORAGE_KEYS.PLANS, []);
    return plans || [];
  } catch (error) {
    console.error('Failed to load plans batch:', error);
    return [];
  }
}

export async function getPlanById(id: string): Promise<any | null> {
  try {
    const cacheKey = `plan_${id}`;
    
    // 메모리 캐시에서 확인
    if (memoryCache.has(cacheKey)) {
      return memoryCache.get(cacheKey);
    }
    
    // 개별 계획 키에서 불러오기
    const plan = await storageService.getObject(cacheKey, null);
    return plan;
  } catch (error) {
    console.error('Failed to get plan by id:', error);
    return null;
  }
}
