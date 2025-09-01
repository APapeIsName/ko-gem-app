import { loadFromStorage, loadPlansBatch, savePlansBatch, STORAGE_KEYS, storageService } from '@/services/storage/asyncStorage';
import {
    Plan,
    PlanFilterOptions,
    PlanFormData,
    PlanSortOptions,
    PlanStats,
    PlanStatus,
    PlanSyncState,
    PlanUpdateData,
} from '@/types/plan/type';
import { generateId, parseDate } from '@/utils/helpers';

// 계획 서비스 클래스
export class PlanService {
  private static instance: PlanService;
  private storage: typeof storageService;

  private constructor() {
    this.storage = storageService;
  }

  public static getInstance(): PlanService {
    if (!PlanService.instance) {
      PlanService.instance = new PlanService();
    }
    return PlanService.instance;
  }

  // 계획 생성
  async createPlan(planData: PlanFormData): Promise<Plan> {
    console.log('createPlan 호출됨, 입력 데이터:', planData);
    
    const now = new Date().toISOString();
    
    const plan: Plan = {
      id: generateId(),
      ...planData,
      status: PlanStatus.ACTIVE,
      allDay: planData.allDay || false,
      tags: planData.tags || [],
      attachments: [],
      notifications: [],
      metadata: {
        createdAt: now,
        updatedAt: now,
        version: 1,
        isDeleted: false,
        syncStatus: 'local',
      },
    };

    console.log('생성된 계획 객체:', plan);

    // 로컬 저장
    console.log('savePlan 호출 시작...');
    await this.savePlan(plan);
    console.log('savePlan 완료');
    
    // TODO: 서버 동기화 로직 추가
    // await this.syncToServer(plan);
    
    return plan;
  }

  // 계획 조회 (ID로)
  async getPlanById(id: string): Promise<Plan | null> {
    const plans = await this.getAllPlans();
    return plans.find(plan => plan.id === id) || null;
  }

  // 모든 계획 조회
  async getAllPlans(): Promise<Plan[]> {
    const plans = await loadPlansBatch();
    return plans.filter(plan => !plan.metadata.isDeleted);
  }

  // 계획 필터링 및 정렬
  async getPlans(
    filterOptions?: PlanFilterOptions,
    sortOptions?: PlanSortOptions
  ): Promise<Plan[]> {
    let plans = await this.getAllPlans();

    // 필터링
    if (filterOptions) {
      plans = this.filterPlans(plans, filterOptions);
    }

    // 정렬
    if (sortOptions) {
      plans = this.sortPlans(plans, sortOptions);
    }

    return plans;
  }

  // 계획 업데이트
  async updatePlan(id: string, updateData: PlanUpdateData): Promise<Plan | null> {
    const plan = await this.getPlanById(id);
    if (!plan) return null;

    const updatedPlan: Plan = {
      ...plan,
      ...updateData,
      tags: updateData.tags ? updateData.tags.map(tag => ({
        id: generateId(),
        name: tag,
        color: '#3B82F6',
        createdAt: new Date().toISOString(),
      })) : plan.tags,
      metadata: {
        ...plan.metadata,
        updatedAt: new Date().toISOString(),
        version: plan.metadata.version + 1,
        syncStatus: 'pending',
      },
    };

    await this.savePlan(updatedPlan);
    
    // TODO: 서버 동기화 로직 추가
    // await this.syncToServer(updatedPlan);
    
    return updatedPlan;
  }

  // 계획 삭제 (소프트 삭제)
  async deletePlan(id: string): Promise<boolean> {
    const plan = await this.getPlanById(id);
    if (!plan) return false;

    const deletedPlan: Plan = {
      ...plan,
      metadata: {
        ...plan.metadata,
        isDeleted: true,
        updatedAt: new Date().toISOString(),
        version: plan.metadata.version + 1,
        syncStatus: 'pending',
      },
    };

    await this.savePlan(deletedPlan);
    
    // TODO: 서버 동기화 로직 추가
    // await this.syncToServer(deletedPlan);
    
    return true;
  }

  // 계획 완료 처리
  async completePlan(id: string): Promise<Plan | null> {
    return this.updatePlan(id, { status: PlanStatus.COMPLETED });
  }

  // 계획 취소 처리
  async cancelPlan(id: string): Promise<Plan | null> {
    return this.updatePlan(id, { status: PlanStatus.CANCELLED });
  }

  // 계획 복원
  async restorePlan(id: string): Promise<Plan | null> {
    const plan = await this.getPlanById(id);
    if (!plan) return null;

    const restoredPlan: Plan = {
      ...plan,
      metadata: {
        ...plan.metadata,
        isDeleted: false,
        updatedAt: new Date().toISOString(),
        version: plan.metadata.version + 1,
        syncStatus: 'pending',
      },
    };

    await this.savePlan(restoredPlan);
    return restoredPlan;
  }

  // 계획 통계
  async getPlanStats(): Promise<PlanStats> {
    const plans = await this.getAllPlans();
    const now = new Date();
    
    const stats: PlanStats = {
      total: plans.length,
      byStatus: {
        [PlanStatus.DRAFT]: 0,
        [PlanStatus.ACTIVE]: 0,
        [PlanStatus.COMPLETED]: 0,
        [PlanStatus.CANCELLED]: 0,
        [PlanStatus.ARCHIVED]: 0,
      },
      byCategory: {} as Record<string, number>, // 카테고리 제거
      byPriority: {} as Record<string, number>, // 우선순위 제거
      upcoming: 0,
      overdue: 0,
      completed: 0,
    };

    plans.forEach(plan => {
      // 상태별 카운트
      stats.byStatus[plan.status]++;
      
      // 시간별 카운트
      if (plan.status === PlanStatus.COMPLETED) {
        stats.completed++;
      } else if (plan.status === PlanStatus.ACTIVE) {
        const startDate = parseDate(plan.startDate);
        if (startDate > now) {
          stats.upcoming++;
        } else if (startDate < now) {
          stats.overdue++;
        }
      }
    });

    return stats;
  }

  // 날짜별 계획 조회
  async getPlansByDate(date: string): Promise<Plan[]> {
    console.log('getPlansByDate 호출, 요청 날짜:', date);
    
    const plans = await this.getAllPlans();
    console.log('전체 계획 수:', plans.length);
    
    const filteredPlans = plans.filter(plan => {
      // 저장된 날짜를 한국 시간대로 변환하여 비교
      const planDate = new Date(plan.startDate);
      const koreanDate = new Date(planDate.getTime() + (9 * 60 * 60 * 1000));
      const planDateString = koreanDate.toISOString().split('T')[0];
      
      const matches = planDateString === date;
      console.log(`계획 ${plan.id}: ${planDateString} === ${date} = ${matches}`);
      return matches;
    });
    
    console.log('필터링된 계획 수:', filteredPlans.length);
    return filteredPlans;
  }

  // 기간별 계획 조회
  async getPlansByDateRange(startDate: string, endDate: string): Promise<Plan[]> {
    const plans = await this.getAllPlans();
    return plans.filter(plan => {
      // 저장된 날짜를 한국 시간대로 변환하여 비교
      const planDate = new Date(plan.startDate);
      const koreanDate = new Date(planDate.getTime() + (9 * 60 * 60 * 1000));
      const planDateString = koreanDate.toISOString().split('T')[0];
      
      return planDateString >= startDate && planDateString <= endDate;
    });
  }

  // 검색
  async searchPlans(query: string): Promise<Plan[]> {
    const plans = await this.getAllPlans();
    const lowerQuery = query.toLowerCase();
    
    return plans.filter(plan => 
      plan.title.toLowerCase().includes(lowerQuery) ||
      plan.description?.toLowerCase().includes(lowerQuery) ||
      plan.location?.toLowerCase().includes(lowerQuery) ||
      plan.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
    );
  }

  // 태그별 계획 조회
  async getPlansByTag(tagName: string): Promise<Plan[]> {
    const plans = await this.getAllPlans();
    return plans.filter(plan => 
      plan.tags.some(tag => tag.toLowerCase() === tagName.toLowerCase())
    );
  }

  // 계획 내보내기
  async exportPlans(): Promise<string> {
    const plans = await this.getAllPlans();
    const exportData = {
      version: '1.0.0',
      exportedAt: new Date().toISOString(),
      plans,
      metadata: {
        totalPlans: plans.length,
        dateRange: {
          start: plans.length > 0 ? plans[0].startDate : '',
          end: plans.length > 0 ? plans[plans.length - 1].startDate : '',
        },
      },
    };

    return JSON.stringify(exportData, null, 2);
  }

  // 계획 가져오기
  async importPlans(importData: string): Promise<number> {
    try {
      const data = JSON.parse(importData);
      if (!data.plans || !Array.isArray(data.plans)) {
        throw new Error('Invalid import data format');
      }

      let importedCount = 0;
      for (const planData of data.plans) {
        // 기존 ID와 충돌 방지를 위해 새 ID 생성
        const newPlan = {
          ...planData,
          id: generateId(),
          metadata: {
            ...planData.metadata,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            syncStatus: 'local' as const,
          },
        };

        await this.savePlan(newPlan);
        importedCount++;
      }

      return importedCount;
    } catch (error) {
      console.error('Failed to import plans:', error);
      throw new Error('Import failed');
    }
  }

  // 동기화 상태 조회
  async getSyncState(): Promise<PlanSyncState> {
    const plans = await this.getAllPlans();
    const pendingChanges = plans.filter(p => p.metadata.syncStatus === 'pending').length;
    const conflicts = plans.filter(p => p.metadata.syncStatus === 'conflict').length;

    return {
      lastSyncAt: await loadFromStorage<string>(STORAGE_KEYS.LAST_SYNC, '') || '',
      pendingChanges,
      conflicts,
      isOnline: true, // TODO: 네트워크 상태 확인 로직 추가
      syncInProgress: false,
    };
  }

  // 로컬 저장
  private async savePlan(plan: Plan): Promise<void> {
    console.log('savePlan 시작, 저장할 계획:', plan);
    
    const plans = await this.getAllPlans();
    console.log('기존 계획들:', plans);
    
    const existingIndex = plans.findIndex(p => p.id === plan.id);
    console.log('기존 계획 인덱스:', existingIndex);
    
    if (existingIndex >= 0) {
      plans[existingIndex] = plan;
      console.log('기존 계획 업데이트');
    } else {
      plans.push(plan);
      console.log('새 계획 추가, 총 계획 수:', plans.length);
    }

    console.log('저장할 최종 계획 배열:', plans);
    
    await savePlansBatch(plans);
    console.log('계획 저장 완료');
  }

  // 계획 필터링
  private filterPlans(plans: Plan[], filterOptions: PlanFilterOptions): Plan[] {
    return plans.filter(plan => {
      // 상태 필터
      if (filterOptions.status && !filterOptions.status.includes(plan.status)) {
        return false;
      }

      // 날짜 범위 필터
      if (filterOptions.dateRange) {
        const planDate = plan.startDate.split('T')[0];
        if (planDate < filterOptions.dateRange.start || planDate > filterOptions.dateRange.end) {
          return false;
        }
      }

      // 태그 필터
      if (filterOptions.tags && filterOptions.tags.length > 0) {
        const hasMatchingTag = plan.tags.some(tag => 
          filterOptions.tags!.includes(tag)
        );
        if (!hasMatchingTag) return false;
      }

      // 검색 쿼리 필터
      if (filterOptions.searchQuery) {
        const query = filterOptions.searchQuery.toLowerCase();
        const matches = 
          plan.title.toLowerCase().includes(query) ||
          plan.description?.toLowerCase().includes(query) ||
          plan.location?.toLowerCase().includes(query) ||
          plan.tags.some(tag => tag.toLowerCase().includes(query));
        
        if (!matches) return false;
      }

      return true;
    });
  }

  // 계획 정렬
  private sortPlans(plans: Plan[], sortOptions: PlanSortOptions): Plan[] {
    return [...plans].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortOptions.field) {
        case 'title':
          aValue = a.title.toLowerCase();
          bValue = b.title.toLowerCase();
          break;
        case 'startDate':
          aValue = new Date(a.startDate);
          bValue = new Date(b.startDate);
          break;
        case 'createdAt':
          aValue = new Date(a.metadata.createdAt);
          bValue = new Date(b.metadata.createdAt);
          break;
        case 'updatedAt':
          aValue = new Date(a.metadata.updatedAt);
          bValue = new Date(b.metadata.updatedAt);
          break;
        default:
          return 0;
      }

      if (sortOptions.direction === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  }

  // TODO: 서버 동기화 메서드들 (확장성 고려)
  // private async syncToServer(plan: Plan): Promise<void> {}
  // private async syncFromServer(): Promise<void> {}
  // private async resolveConflicts(conflicts: Plan[]): Promise<void> {}
}

// 싱글톤 인스턴스
export const planService = PlanService.getInstance();
