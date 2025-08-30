import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/common/TimePicker';
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
  
  // 한국 시간대를 고려한 현재 날짜 가져오기
  const getKoreanDate = () => {
    const now = new Date();
    // 한국 시간대 (UTC+9)로 정확하게 변환
    const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
    const koreanTime = new Date(utc + (9 * 60000));
    return koreanTime.toISOString().split('T')[0];
  };
  
  // DatePicker와 TimePicker 상태 관리
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    description: '',
    category: PLAN_DEFAULTS.category,
    priority: PLAN_DEFAULTS.priority,
    startDate: date as string || getKoreanDate(),
    endDate: date as string || getKoreanDate(),
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

  // 날짜 선택 핸들러
  const handleStartDateChange = (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setFormData({ ...formData, startDate: dateString });
    // 시작 날짜가 변경되면 종료 날짜도 자동으로 업데이트
    if (formData.endDate && formData.endDate < dateString) {
      setFormData(prev => ({ ...prev, endDate: dateString }));
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    setFormData({ ...formData, endDate: dateString });
  };

  // 시간 선택 핸들러
  const handleStartTimeChange = (time: { hour: number; minute: number }) => {
    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    setFormData({ ...formData, startTime: timeString });
  };

  const handleEndTimeChange = (time: { hour: number; minute: number }) => {
    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    setFormData({ ...formData, endTime: timeString });
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
          {/* 날짜 선택 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>날짜</ThemedText>
            <View style={styles.dateRow}>
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowStartDatePicker(true)}
                activeOpacity={0.7}
              >
                <IconSymbol name="calendar-today" size={20} color="#10B981" />
                <ThemedText style={styles.dateButtonText}>
                  {formatDate(formData.startDate, 'MM월 DD일')} ({formatDate(formData.startDate, 'relative')})
                </ThemedText>
              </TouchableOpacity>
              
              <ThemedText style={styles.dateSeparator}>~</ThemedText>
              
              <TouchableOpacity
                style={styles.dateButton}
                onPress={() => setShowEndDatePicker(true)}
                activeOpacity={0.7}
              >
                <IconSymbol name="calendar-today" size={20} color="#10B981" />
                <ThemedText style={styles.dateButtonText}>
                  {formatDate(formData.endDate || formData.startDate, 'MM월 DD일')} ({formatDate(formData.endDate || formData.startDate, 'relative')})
                </ThemedText>
              </TouchableOpacity>
            </View>
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
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowStartTimePicker(true)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="access-time" size={20} color="#10B981" />
                      <ThemedText style={styles.timeButtonText}>
                        {formData.startTime}
                      </ThemedText>
                    </TouchableOpacity>
                  </View>
                  <View style={styles.timeInput}>
                    <ThemedText style={styles.timeLabel}>종료</ThemedText>
                    <TouchableOpacity
                      style={styles.timeButton}
                      onPress={() => setShowEndTimePicker(true)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="access-time" size={20} color="#10B981" />
                      <ThemedText style={styles.timeButtonText}>
                        {formData.endTime}
                      </ThemedText>
                    </TouchableOpacity>
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

      {/* DateTimePicker 컴포넌트들 */}
      {/* iOS용 커스텀 모달 */}
      {/* Android용 기본 DateTimePicker */}
      {/* DatePicker */}
      {showStartDatePicker && (
        <DatePicker
          visible={showStartDatePicker}
          onClose={() => setShowStartDatePicker(false)}
          onConfirm={handleStartDateChange}
          initialDate={new Date(formData.startDate)}
        />
      )}

      {showEndDatePicker && (
        <DatePicker
          visible={showEndDatePicker}
          onClose={() => setShowEndDatePicker(false)}
          onConfirm={handleEndDateChange}
          initialDate={new Date(formData.endDate || formData.startDate)}
        />
      )}

      {/* TimePicker */}
      {showStartTimePicker && (
        <TimePicker
          visible={showStartTimePicker}
          onClose={() => setShowStartTimePicker(false)}
          onConfirm={handleStartTimeChange}
          initialTime={{ 
            hour: parseInt(formData.startTime?.split(':')[0] || '9', 10), 
            minute: parseInt(formData.startTime?.split(':')[1] || '0', 10) 
          }}
        />
      )}

      {showEndTimePicker && (
        <TimePicker
          visible={showEndTimePicker}
          onClose={() => setShowEndTimePicker(false)}
          onConfirm={handleEndTimeChange}
          initialTime={{ 
            hour: parseInt(formData.endTime?.split(':')[0] || '10', 10), 
            minute: parseInt(formData.endTime?.split(':')[1] || '0', 10) 
          }}
        />
      )}
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
  // 날짜 선택 관련 스타일
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  dateButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  dateButtonText: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
  dateSeparator: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '600',
  },
  // 시간 선택 관련 스타일
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 8,
  },
  timeButtonText: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
});
