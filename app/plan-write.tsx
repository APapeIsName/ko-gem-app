import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PLAN_CATEGORIES, PLAN_DEFAULTS, PLAN_PRIORITIES } from '@/data/constants/plans';
import { useCreatePlan } from '@/hooks/api/usePlans';
import { PlanCategory, PlanFormData, PlanPriority } from '@/types/plan/type';
import { formatDate } from '@/utils/helpers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlanWriteScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  
  // TanStack Query mutation 사용
  const createPlanMutation = useCreatePlan();
  
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    description: '',
    category: PLAN_DEFAULTS.category,
    priority: PLAN_DEFAULTS.priority,
    startDate: date as string || new Date().toISOString().split('T')[0],
    endDate: date as string || new Date().toISOString().split('T')[0],
    startTime: PLAN_DEFAULTS.startTime,
    endTime: PLAN_DEFAULTS.endTime,
    allDay: PLAN_DEFAULTS.allDay,
    location: '',
    tags: [],
    notes: '',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSave = async () => {
    try {
      console.log('계획 저장 시작:', formData);
      
      // startDate와 startTime을 결합하여 완전한 날짜시간 문자열 생성
      const planData = {
        ...formData,
        startDate: formData.allDay 
          ? `${formData.startDate}T00:00:00.000Z`
          : `${formData.startDate}T${formData.startTime}:00.000Z`,
        endDate: formData.allDay 
          ? `${formData.endDate}T23:59:59.999Z`
          : `${formData.endDate}T${formData.endTime}:00.000Z`,
      };
      
      console.log('수정된 계획 데이터:', planData);
      
      // TanStack Query mutation 사용
      await createPlanMutation.mutateAsync(planData);
      console.log('계획 저장 완료');
      
      // 저장 성공 후 뒤로 가기
      router.back();
    } catch (error) {
      console.error('Failed to save plan:', error);
      Alert.alert('오류', '계획 저장에 실패했습니다: ' + (error instanceof Error ? error.message : String(error)));
    }
  };

  const isFormValid = formData.title.trim().length > 0;

  return (
    <ThemedView style={styles.container}>
      {/* 상단 헤더 */}
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton} 
          onPress={handleBackPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="arrow-back" size={24} color="#11181C" />
        </TouchableOpacity>
        
        <ThemedText style={styles.headerTitle}>새 계획 작성</ThemedText>
        
        <TouchableOpacity
          style={[styles.saveButton, (!isFormValid || createPlanMutation.isPending) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || createPlanMutation.isPending}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.saveButtonText, (!isFormValid || createPlanMutation.isPending) && styles.saveButtonTextDisabled]}>
            {createPlanMutation.isPending ? '저장 중...' : '저장'}
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 날짜 표시 */}
          <ThemedView style={styles.dateSection}>
            <ThemedText style={styles.dateLabel}>날짜</ThemedText>
            <ThemedText style={styles.dateText}>
              {formatDate(formData.startDate, 'MM월 DD일')} ({formatDate(formData.startDate, 'relative')})
            </ThemedText>
          </ThemedView>

          {/* 제목 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>제목 *</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="계획 제목을 입력하세요"
              placeholderTextColor="#9CA3AF"
              value={formData.title}
              onChangeText={(text) => setFormData({ ...formData, title: text })}
              maxLength={100}
            />
          </ThemedView>

          {/* 카테고리 선택 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>카테고리</ThemedText>
            <View style={styles.categoryGrid}>
              {Object.entries(PLAN_CATEGORIES).map(([key, category]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.categoryOption,
                    formData.category === key && styles.categoryOptionSelected,
                    { borderColor: category.color }
                  ]}
                  onPress={() => setFormData({ ...formData, category: key as PlanCategory })}
                >
                  <IconSymbol name={category.icon} size={20} color={category.color} />
                  <ThemedText style={[
                    styles.categoryOptionText,
                    formData.category === key && styles.categoryOptionTextSelected
                  ]}>
                    {category.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          {/* 우선순위 선택 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>우선순위</ThemedText>
            <View style={styles.priorityGrid}>
              {Object.entries(PLAN_PRIORITIES).map(([key, priority]) => (
                <TouchableOpacity
                  key={key}
                  style={[
                    styles.priorityOption,
                    formData.priority === key && styles.priorityOptionSelected,
                    { borderColor: priority.color }
                  ]}
                  onPress={() => setFormData({ ...formData, priority: key as PlanPriority })}
                >
                  <IconSymbol name={priority.icon} size={20} color={priority.color} />
                  <ThemedText style={[
                    styles.priorityOptionText,
                    formData.priority === key && styles.priorityOptionTextSelected
                  ]}>
                    {priority.name}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </ThemedView>

          {/* 설명 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>설명</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="계획에 대한 설명을 입력하세요"
              placeholderTextColor="#9CA3AF"
              value={formData.description}
              onChangeText={(text) => setFormData({ ...formData, description: text })}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              maxLength={1000}
            />
          </ThemedView>

          {/* 시간 설정 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>시간</ThemedText>
            <View style={styles.timeSection}>
              <TouchableOpacity
                style={[
                  styles.allDayToggle,
                  formData.allDay && styles.allDayToggleActive
                ]}
                onPress={() => setFormData({ ...formData, allDay: !formData.allDay })}
              >
                <ThemedText style={[
                  styles.allDayToggleText,
                  formData.allDay && styles.allDayToggleTextActive
                ]}>
                  하루 종일
                </ThemedText>
              </TouchableOpacity>
              
              {!formData.allDay && (
                <View style={styles.timeInputs}>
                  <View style={styles.timeInput}>
                    <ThemedText style={styles.timeLabel}>시작</ThemedText>
                    <TextInput
                      style={styles.timeTextInput}
                      value={formData.startTime}
                      onChangeText={(text) => setFormData({ ...formData, startTime: text })}
                      placeholder="09:00"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                  <View style={styles.timeInput}>
                    <ThemedText style={styles.timeLabel}>종료</ThemedText>
                    <TextInput
                      style={styles.timeTextInput}
                      value={formData.endTime}
                      onChangeText={(text) => setFormData({ ...formData, endTime: text })}
                      placeholder="10:00"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>
                </View>
              )}
            </View>
          </ThemedView>

          {/* 장소 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>장소</ThemedText>
            <TextInput
              style={styles.textInput}
              placeholder="예: 한강공원"
              placeholderTextColor="#9CA3AF"
              value={formData.location}
              onChangeText={(text) => setFormData({ ...formData, location: text })}
            />
          </ThemedView>

          {/* 메모 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>메모</ThemedText>
            <TextInput
              style={[styles.textInput, styles.textArea]}
              placeholder="추가 메모를 입력하세요"
              placeholderTextColor="#9CA3AF"
              value={formData.notes}
              onChangeText={(text) => setFormData({ ...formData, notes: text })}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </ThemedView>
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
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
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  saveButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  saveButtonDisabled: {
    backgroundColor: '#E5E7EB',
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  saveButtonTextDisabled: {
    color: '#9CA3AF',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  dateSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#F8F9FA',
    borderRadius: 12,
  },
  dateLabel: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 4,
  },
  dateText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  inputSection: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#11181C',
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  categoryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 6,
  },
  categoryOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
  },
  categoryOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  categoryOptionTextSelected: {
    color: '#11181C',
    fontWeight: '600',
  },
  priorityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  priorityOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 6,
  },
  priorityOptionSelected: {
    backgroundColor: '#F3F4F6',
    borderWidth: 2,
  },
  priorityOptionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  priorityOptionTextSelected: {
    color: '#11181C',
    fontWeight: '600',
  },
  timeSection: {
    gap: 16,
  },
  allDayToggle: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  allDayToggleActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  allDayToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  allDayToggleTextActive: {
    color: '#fff',
  },
  timeInputs: {
    flexDirection: 'row',
    gap: 16,
  },
  timeInput: {
    flex: 1,
  },
  timeLabel: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 4,
  },
  timeTextInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    color: '#11181C',
    backgroundColor: '#fff',
  },
});
