import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { planService } from '@/services/plans/planService';
import { Plan, PlanFormData, PlanUpdateData, PlanFilterOptions, PlanSortOptions } from '@/types/plan/type';

// Query Keys
export const planKeys = {
  all: ['plans'] as const,
  lists: () => [...planKeys.all, 'list'] as const,
  list: (filters: PlanFilterOptions | undefined, sort: PlanSortOptions | undefined) => 
    [...planKeys.lists(), { filters, sort }] as const,
  byDate: (date: string) => [...planKeys.all, 'byDate', date] as const,
  byId: (id: string) => [...planKeys.all, 'byId', id] as const,
  stats: () => [...planKeys.all, 'stats'] as const,
  syncState: () => [...planKeys.all, 'syncState'] as const,
};

// 계획 목록 조회
export function usePlans(filters?: PlanFilterOptions, sort?: PlanSortOptions) {
  return useQuery({
    queryKey: planKeys.list(filters, sort),
    queryFn: () => planService.getPlans(filters, sort),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 날짜별 계획 조회
export function usePlansByDate(date: string) {
  return useQuery({
    queryKey: planKeys.byDate(date),
    queryFn: () => planService.getPlansByDate(date),
    staleTime: 1000 * 60 * 2, // 2분
    gcTime: 1000 * 60 * 5, // 5분
  });
}

// 계획 상세 조회
export function usePlanById(id: string) {
  return useQuery({
    queryKey: planKeys.byId(id),
    queryFn: () => planService.getPlanById(id),
    enabled: !!id,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 계획 통계
export function usePlanStats() {
  return useQuery({
    queryKey: planKeys.stats(),
    queryFn: () => planService.getPlanStats(),
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}

// 동기화 상태
export function usePlanSyncState() {
  return useQuery({
    queryKey: planKeys.syncState(),
    queryFn: () => planService.getSyncState(),
    staleTime: 1000 * 30, // 30초
    gcTime: 1000 * 60 * 2, // 2분
  });
}

// 계획 생성
export function useCreatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (planData: PlanFormData) => planService.createPlan(planData),
    onSuccess: (newPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(newPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 새로 생성된 계획을 캐시에 추가
      queryClient.setQueryData(planKeys.byId(newPlan.id), newPlan);
    },
    onError: (error) => {
      console.error('Failed to create plan:', error);
    },
  });
}

// 계획 업데이트
export function useUpdatePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, updateData }: { id: string; updateData: PlanUpdateData }) =>
      planService.updatePlan(id, updateData),
    onSuccess: (updatedPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(updatedPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 업데이트된 계획을 캐시에 업데이트
      queryClient.setQueryData(planKeys.byId(updatedPlan.id), updatedPlan);
    },
    onError: (error) => {
      console.error('Failed to update plan:', error);
    },
  });
}

// 계획 삭제
export function useDeletePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => planService.deletePlan(id),
    onSuccess: (deletedPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(deletedPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 삭제된 계획을 캐시에서 제거
      queryClient.removeQueries({ queryKey: planKeys.byId(deletedPlan.id) });
    },
    onError: (error) => {
      console.error('Failed to delete plan:', error);
    },
  });
}

// 계획 완료 처리
export function useCompletePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => planService.completePlan(id),
    onSuccess: (completedPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(completedPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 완료된 계획을 캐시에 업데이트
      queryClient.setQueryData(planKeys.byId(completedPlan.id), completedPlan);
    },
    onError: (error) => {
      console.error('Failed to complete plan:', error);
    },
  });
}

// 계획 취소 처리
export function useCancelPlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => planService.cancelPlan(id),
    onSuccess: (cancelledPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(cancelledPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 취소된 계획을 캐시에 업데이트
      queryClient.setQueryData(planKeys.byId(cancelledPlan.id), cancelledPlan);
    },
    onError: (error) => {
      console.error('Failed to cancel plan:', error);
    },
  });
}

// 계획 복원
export function useRestorePlan() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id: string) => planService.restorePlan(id),
    onSuccess: (restoredPlan) => {
      // 관련된 모든 쿼리 무효화
      queryClient.invalidateQueries({ queryKey: planKeys.lists() });
      queryClient.invalidateQueries({ queryKey: planKeys.byDate(restoredPlan.startDate.split('T')[0]) });
      queryClient.invalidateQueries({ queryKey: planKeys.stats() });
      queryClient.invalidateQueries({ queryKey: planKeys.syncState() });
      
      // 복원된 계획을 캐시에 업데이트
      queryClient.setQueryData(planKeys.byId(restoredPlan.id), restoredPlan);
    },
    onError: (error) => {
      console.error('Failed to restore plan:', error);
    },
  });
}

// 계획 검색
export function useSearchPlans(query: string) {
  return useQuery({
    queryKey: [...planKeys.all, 'search', query],
    queryFn: () => planService.searchPlans(query),
    enabled: query.length > 0,
    staleTime: 1000 * 60 * 2, // 2분
    gcTime: 1000 * 60 * 5, // 5분
  });
}

// 태그별 계획 조회
export function usePlansByTag(tagName: string) {
  return useQuery({
    queryKey: [...planKeys.all, 'byTag', tagName],
    queryFn: () => planService.getPlansByTag(tagName),
    enabled: !!tagName,
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10, // 10분
  });
}
