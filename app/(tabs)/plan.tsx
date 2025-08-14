import { AddPlanButton } from '@/components/plans/AddPlanButton';
import { PlanItem } from '@/components/plans/PlanItem';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { mockPlans } from '@/data/mock/plans';
import { Plan, PlanItem as PlanItemType } from '@/types/plan/type';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { FlatList, StyleSheet, TouchableOpacity } from 'react-native';

export default function PlanScreen() {
  const router = useRouter();
  const [plans] = useState<Plan[]>(mockPlans);

  // 현재 날짜를 YYYY-MM-DD 형식으로 가져오기
  const getCurrentDate = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const currentDate = getCurrentDate();

  // 현재 날짜의 계획이 있는지 확인
  const currentPlan = plans.find(plan => plan.date === currentDate);
  const hasCurrentPlan = currentPlan && currentPlan.items.length > 0;

  const handleAddPlan = () => {
    router.push({
      pathname: '/plan-write',
      params: { date: currentDate }
    });
  };

  const handlePlanItemPress = (item: PlanItemType) => {
    // TODO: 계획 상세 보기 또는 편집 화면으로 이동
    console.log('계획 아이템 선택:', item);
  };

  const handleToggleComplete = (itemId: string) => {
    // TODO: 계획 완료 상태 토글 로직 구현
    console.log('계획 완료 토글:', itemId);
  };

  const renderPlanItem = ({ item }: { item: PlanItemType }) => (
    <PlanItem
      item={item}
      onPress={() => handlePlanItemPress(item)}
      onToggleComplete={() => handleToggleComplete(item.id)}
    />
  );

  const renderAddButton = () => (
    <AddPlanButton onPress={handleAddPlan} />
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

      {/* 날짜 표시 (계획이 있을 때만) */}
      {hasCurrentPlan && (
        <ThemedView style={styles.dateSection}>
          <ThemedText style={styles.dateText}>{currentDate}</ThemedText>
        </ThemedView>
      )}

      {/* 계획 리스트 */}
      <FlatList
        data={currentPlan?.items || []}
        renderItem={renderPlanItem}
        keyExtractor={(item) => item.id}
        style={styles.planList}
        contentContainerStyle={styles.planListContent}
        showsVerticalScrollIndicator={false}
        ListFooterComponent={renderAddButton}
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
  },
  planList: {
    flex: 1,
  },
  planListContent: {
    padding: 16,
    paddingBottom: 32,
  },
});
