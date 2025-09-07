import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCancelPlan, useCompletePlan, useDeletePlan, usePlansByDate } from '@/hooks/api/usePlans';
import { Plan, PlanStatus } from '@/types/plan/type';
import { formatDate, normalizeTags } from '@/utils/helpers';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, FlatList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PlanScreen() {
  const router = useRouter();
  
  // 한국 시간대를 고려한 현재 날짜 가져오기
  const getKoreanDate = () => {
    const now = new Date();
    // 한국 시간대 (UTC+9)로 정확하게 변환
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const koreanTime = new Date(utc + (9 * 60000));
    return koreanTime.toISOString().split('T')[0];
  };
  
  const [selectedDate, setSelectedDate] = useState(getKoreanDate());

  // TanStack Query를 사용하여 계획 데이터 관리
  const { data: plans = [], isLoading, error, refetch } = usePlansByDate(selectedDate);
  const completePlanMutation = useCompletePlan();
  const cancelPlanMutation = useCancelPlan();
  const deletePlanMutation = useDeletePlan();

  const handleAddPlan = () => {
    router.push({
      pathname: '/plan-write',
      params: { date: selectedDate }
    });
  };

  const handlePlanPress = (plan: Plan) => {
    router.push({
      pathname: '/plan-detail',
      params: { id: plan.id }
    });
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

  // 모든 계획 삭제 함수
  const handleDeleteAllPlans = () => {
    if (plans.length === 0) {
      Alert.alert('알림', '삭제할 계획이 없습니다.');
      return;
    }

    Alert.alert(
      '경고',
      `현재 날짜의 모든 계획(${plans.length}개)을 삭제하시겠습니까?\n\n이 작업은 되돌릴 수 없습니다.`,
      [
        {
          text: '취소',
          style: 'cancel',
        },
        {
          text: '삭제',
          style: 'destructive',
          onPress: async () => {
            try {
              // 모든 계획을 순차적으로 삭제
              for (const plan of plans) {
                await deletePlanMutation.mutateAsync(plan.id);
              }
              Alert.alert('완료', '모든 계획이 삭제되었습니다.');
            } catch (error) {
              console.error('Failed to delete all plans:', error);
              Alert.alert('오류', '계획 삭제 중 오류가 발생했습니다.');
            }
          },
        },
      ]
    );
  };

  const renderPlanItem = ({ item }: { item: Plan }) => {
    // 태그 정규화
    const normalizedTags = normalizeTags(item.tags);
    
    // 태그 데이터 디버깅 (임시)
    // console.log('=== 태그 디버깅 ===');
    // console.log('계획 ID:', item.id);
    // console.log('원본 태그:', item.tags);
    // console.log('원본 태그 타입:', typeof item.tags);
    // console.log('원본 태그 길이:', item.tags ? item.tags.length : 'undefined');
    // if (item.tags && Array.isArray(item.tags)) {
    //   item.tags.forEach((tag, index) => {
    //     console.log(`태그 ${index}:`, tag, '타입:', typeof tag);
    //   });
    // }
    // console.log('정규화된 태그:', normalizedTags);
    // console.log('==================');
    
    return (
      <TouchableOpacity
        style={styles.planItem}
        onPress={() => handlePlanPress(item)}
        activeOpacity={0.7}
      >
        {/* 태그가 있을 때만 헤더 표시 */}
        {normalizedTags.length > 0 && (
          <View style={styles.planItemHeader}>
            <View style={styles.planItemLeft}>
              {/* 태그 표시 */}
              <View style={styles.tagsContainer}>
                {normalizedTags.slice(0, 3).map((tag, index) => (
                  <View key={index} style={styles.tagBadge}>
                    <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                  </View>
                ))}
                {normalizedTags.length > 3 && (
                  <ThemedText style={styles.moreTagsText}>+{normalizedTags.length - 3}</ThemedText>
                )}
              </View>
            </View>
          </View>
        )}
        
        <ThemedText style={styles.planTitle} numberOfLines={2}>
          {item.title}
        </ThemedText>
        
        {/* 태그 데이터 임시 표시 */}
        {/* <View style={styles.tempTagInfo}>
          <ThemedText style={styles.tempTagText}>
            원본 태그: {JSON.stringify(item.tags)}
          </ThemedText>
          <ThemedText style={styles.tempTagText}>
            정규화된 태그: {JSON.stringify(normalizedTags)}
          </ThemedText>
        </View> */}
        
        {item.description && (
          <ThemedText style={styles.planDescription} numberOfLines={2}>
            {item.description}
          </ThemedText>
        )}
        
        <View style={styles.planItemFooter}>
          <View style={styles.timeInfo}>
            <IconSymbol name="access-time" size={16} color="#687076" />
            <ThemedText style={styles.timeText}>
              {item.allDay ? '하루 종일' : `${item.startTime || '00:00'} - ${item.endTime || '00:00'}`}
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
  };

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
          <View style={styles.debugButtonsContainer}>
            <TouchableOpacity 
              style={styles.refreshButton}
              onPress={() => refetch()}
            >
              <ThemedText style={styles.refreshButtonText}>새로고침</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity 
              style={styles.deleteAllButton}
              onPress={handleDeleteAllPlans}
            >
              <ThemedText style={styles.deleteAllButtonText}>데이터 삭제</ThemedText>
            </TouchableOpacity>
          </View>
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
  debugButtonsContainer: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 5,
  },
  refreshButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  refreshButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  deleteAllButton: {
    backgroundColor: '#EF4444',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  deleteAllButtonText: {
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
    marginBottom: 6,
  },
  planItemLeft: {
    flex: 1,
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 4,
    marginBottom: 4,
  },
  tagBadge: {
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginRight: 6,
    marginBottom: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tagText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  moreTagsText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#10B981',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    marginLeft: 4,
  },
  statusButton: {
    padding: 8,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
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
  tempTagInfo: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#E0E7FF',
    borderRadius: 8,
  },
  tempTagText: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 4,
  },
});
