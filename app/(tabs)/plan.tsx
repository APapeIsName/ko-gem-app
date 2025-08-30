import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PLAN_CATEGORIES, PLAN_PRIORITIES, PLAN_STATUSES } from '@/data/constants/plans';
import { useCancelPlan, useCompletePlan, usePlansByDate } from '@/hooks/api/usePlans';
import { Plan, PlanStatus } from '@/types/plan/type';
import { formatDate, getCurrentDate } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PlanScreen() {
  const router = useRouter();
  const [selectedDate, setSelectedDate] = useState(getCurrentDate());

  // TanStack Query를 사용하여 계획 데이터 관리
  const { data: plans = [], isLoading, error, refetch } = usePlansByDate(selectedDate);
  const completePlanMutation = useCompletePlan();
  const cancelPlanMutation = useCancelPlan();

  const handleAddPlan = () => {
    router.push({
      pathname: '/plan-write',
      params: { date: selectedDate }
    });
  };

  const handlePlanPress = (plan: Plan) => {
    // TODO: 계획 상세 보기 또는 편집 화면으로 이동
    console.log('계획 선택:', plan);
  };

  const handleToggleComplete = async (planId: string) => {
    try {
      const plan = plans.find(p => p.id === planId);
      if (plan) {
        const newStatus = plan.status === PlanStatus.COMPLETED 
          ? PlanStatus.ACTIVE 
          : PlanStatus.COMPLETED;
        
        if (newStatus === PlanStatus.COMPLETED) {
          await completePlanMutation.mutateAsync(planId);
        } else {
          await cancelPlanMutation.mutateAsync(planId);
        }
      }
    } catch (error) {
      console.error('Failed to toggle plan status:', error);
    }
  };

  const renderPlanItem = ({ item }: { item: Plan }) => (
    <TouchableOpacity
      style={styles.planItem}
      onPress={() => handlePlanPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.planItemHeader}>
        <View style={styles.planItemLeft}>
          <View style={[
            styles.categoryBadge,
            { backgroundColor: PLAN_CATEGORIES[item.category].color }
          ]}>
            <ThemedText style={styles.categoryText}>
              {PLAN_CATEGORIES[item.category].name}
            </ThemedText>
          </View>
          <View style={[
            styles.priorityBadge,
            { backgroundColor: PLAN_PRIORITIES[item.priority].color }
          ]}>
            <ThemedText style={styles.priorityText}>
              {PLAN_PRIORITIES[item.priority].name}
            </ThemedText>
          </View>
        </View>
        <TouchableOpacity
          style={[
            styles.statusButton,
            { backgroundColor: PLAN_STATUSES[item.status].color }
          ]}
          onPress={() => handleToggleComplete(item.id)}
        >
          <IconSymbol 
            name={item.status === PlanStatus.COMPLETED ? 'check' : 'play-arrow'} 
            size={16} 
            color="#fff" 
          />
        </TouchableOpacity>
      </View>
      
      <ThemedText style={styles.planTitle} numberOfLines={2}>
        {item.title}
      </ThemedText>
      
      {item.description && (
        <ThemedText style={styles.planDescription} numberOfLines={2}>
          {item.description}
        </ThemedText>
      )}
      
      <View style={styles.planItemFooter}>
        <View style={styles.timeInfo}>
          <IconSymbol name="access-time" size={16} color="#687076" />
          <ThemedText style={styles.timeText}>
            {item.allDay ? '하루 종일' : `${item.startTime || '00:00'}`}
          </ThemedText>
        </View>
        
        {item.location && (
          <View style={styles.locationInfo}>
            <IconSymbol name="place" size={16} color="#687076" />
            <ThemedText style={styles.locationText} numberOfLines={1}>
              {item.location}
            </ThemedText>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <IconSymbol name="event" size={64} color="#D1D5DB" />
      <ThemedText style={styles.emptyStateTitle}>계획이 없습니다</ThemedText>
      <ThemedText style={styles.emptyStateDescription}>
        새로운 계획을 추가해보세요
      </ThemedText>
    </View>
  );

  const renderLoadingState = () => (
    <View style={styles.loadingState}>
      <IconSymbol name="refresh" size={64} color="#D1D5DB" />
      <ThemedText style={styles.loadingStateTitle}>계획을 불러오는 중...</ThemedText>
    </View>
  );

  const renderErrorState = () => (
    <View style={styles.errorState}>
      <IconSymbol name="error" size={64} color="#EF4444" />
      <ThemedText style={styles.errorStateTitle}>계획을 불러오는데 실패했습니다</ThemedText>
      <TouchableOpacity style={styles.retryButton} onPress={() => refetch()}>
        <ThemedText style={styles.retryButtonText}>다시 시도</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      {/* 상단 헤더 */}
      <ThemedView style={styles.header}>
        <ThemedText style={styles.headerTitle}>계획</ThemedText>
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAddPlan}
          activeOpacity={0.7}
        >
          <IconSymbol name="add" size={24} color="#11181C" />
        </TouchableOpacity>
      </ThemedView>

      {/* 날짜 표시 */}
      <ThemedView style={styles.dateSection}>
        <ThemedText style={styles.dateText}>
          {formatDate(selectedDate, 'MM월 DD일')} ({formatDate(selectedDate, 'relative')})
        </ThemedText>
        
        {/* 디버그 정보 */}
        {/* <ThemedView style={styles.debugSection}>
          <ThemedText style={styles.debugText}>
            선택된 날짜: {selectedDate}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            총 계획 수: {plans.length}
          </ThemedText>
          <ThemedText style={styles.debugText}>
            로딩 상태: {isLoading ? '로딩 중' : '완료'}
          </ThemedText>
          {error && (
            <ThemedText style={[styles.debugText, { color: '#EF4444' }]}>
              오류: {error.message}
            </ThemedText>
          )}
          <TouchableOpacity 
            style={styles.refreshButton}
            onPress={() => refetch()}
          >
            <ThemedText style={styles.refreshButtonText}>새로고침</ThemedText>
          </TouchableOpacity>
        </ThemedView> */}
      </ThemedView>

      {/* 계획 리스트 */}
      <FlatList
        data={plans}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        style={styles.planList}
        contentContainerStyle={[
          styles.planListContent,
          plans.length === 0 && styles.emptyListContent
        ]}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          isLoading 
            ? renderLoadingState 
            : error 
            ? renderErrorState 
            : renderEmptyState
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 60,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#11181C',
  },
  addButton: {
    padding: 8,
  },
  dateSection: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 10,
  },
  debugSection: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  debugText: {
    fontSize: 12,
    color: '#666',
    marginBottom: 5,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
    marginTop: 5,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  planList: {
    flex: 1,
  },
  planListContent: {
    padding: 16,
    paddingBottom: 32,
  },
  emptyListContent: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planItem: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  planItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  planItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  priorityBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  priorityText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  statusButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  planTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 12,
    lineHeight: 20,
  },
  planItemFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  timeText: {
    fontSize: 14,
    color: '#687076',
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    marginLeft: 16,
  },
  locationText: {
    fontSize: 14,
    color: '#687076',
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateDescription: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
  loadingState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  loadingStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 16,
  },
  errorState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 64,
  },
  errorStateTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#EF4444',
    marginTop: 16,
    marginBottom: 16,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
