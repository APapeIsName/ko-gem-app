import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/common/TimePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PLAN_DEFAULTS } from '@/data/constants/plans';
import { useCreatePlan } from '@/hooks/api/usePlans';
import { PlanFormData } from '@/types/plan/type';
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
  
  // 태그 입력 상태
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    description: '',
    category: PLAN_DEFAULTS.category,
    priority: PLAN_DEFAULTS.priority,
    startDate: date as string || getKoreanDate(),
    endDate: date as string || getKoreanDate(),
    startTime: PLAN_DEFAULTS.startTime,
    endTime: PLAN_DEFAULTS.endTime,
    allDay: true, // 기본값을 true로 설정
    location: '',
    tags: [],
    notes: '',
  });

  const handleBackPress = () => {
    router.back();
  };

  // 태그 추가
  const handleAddTag = () => {
    if (tagInput.trim() && !formData.tags?.includes(tagInput.trim())) {
      setFormData(prev => ({
        ...prev,
        tags: [...(prev.tags || []), tagInput.trim()]
      }));
      setTagInput('');
    }
  };

  // 태그 제거
  const handleRemoveTag = (index: number) => {
    setFormData(prev => ({
      ...prev,
      tags: prev.tags?.filter((_, i) => i !== index) || []
    }));
  };

  // 날짜 선택 핸들러
  const handleStartDateChange = (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // 시작일이 종료일보다 늦으면 종료일을 시작일로 설정
    if (formData.endDate && dateString > formData.endDate) {
      setFormData({ ...formData, startDate: dateString, endDate: dateString });
    } else {
      setFormData({ ...formData, startDate: dateString });
    }
  };

  const handleEndDateChange = (selectedDate: Date) => {
    const dateString = selectedDate.toISOString().split('T')[0];
    
    // 종료일이 시작일보다 이르면 시작일로 설정
    if (dateString < formData.startDate) {
      setFormData({ ...formData, endDate: formData.startDate });
    } else {
      setFormData({ ...formData, endDate: dateString });
    }
  };

  // 시간 선택 핸들러
  const handleStartTimeChange = (time: { hour: number; minute: number }) => {
    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    
    // 시작 시간이 종료 시간보다 늦으면 종료 시간을 시작 시간 + 1시간으로 설정
    if (formData.endTime && formData.startDate === formData.endDate) {
      const startMinutes = time.hour * 60 + time.minute;
      const endMinutes = parseInt(formData.endTime.split(':')[0]) * 60 + parseInt(formData.endTime.split(':')[1]);
      
      if (startMinutes >= endMinutes) {
        const newEndHour = (time.hour + 1) % 24;
        const newEndTime = `${newEndHour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
        setFormData({ ...formData, startTime: timeString, endTime: newEndTime });
        return;
      }
    }
    
    setFormData({ ...formData, startTime: timeString });
  };

  const handleEndTimeChange = (time: { hour: number; minute: number }) => {
    const timeString = `${time.hour.toString().padStart(2, '0')}:${time.minute.toString().padStart(2, '0')}`;
    
    // 종료 시간이 시작 시간보다 이르면 시작 시간으로 설정
    if (formData.startTime && formData.startDate === formData.endDate) {
      const startMinutes = parseInt(formData.startTime.split(':')[0]) * 60 + parseInt(formData.startTime.split(':')[1]);
      const endMinutes = time.hour * 60 + time.minute;
      
      if (endMinutes <= startMinutes) {
        setFormData({ ...formData, endTime: formData.startTime });
        return;
      }
    }
    
    setFormData({ ...formData, endTime: timeString });
  };

  const handleSave = async () => {
    try {
      // 날짜 검증
      if (formData.endDate && formData.startDate > formData.endDate) {
        Alert.alert('오류', '시작일은 종료일 이전이어야 합니다.');
        return;
      }
      
      console.log('계획 저장 시작:', formData);
      
      // startDate와 startTime을 결합하여 완전한 날짜시간 문자열 생성
      const planData = {
        ...formData,
        startDate: formData.allDay 
          ? `${formData.startDate}T00:00:00.000Z`
          : `${formData.startDate}T${formData.startTime}:00.000Z`,
        endDate: formData.allDay 
          ? `${formData.endDate || formData.startDate}T23:59:59.999Z`
          : `${formData.endDate || formData.startDate}T${formData.endTime}:00.000Z`,
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

          {/* 태그 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>태그</ThemedText>
            <View style={styles.tagInputContainer}>
              <TextInput
                style={styles.tagInput}
                placeholder="태그를 입력하고 + 버튼을 누르세요"
                placeholderTextColor="#9CA3AF"
                value={tagInput}
                onChangeText={setTagInput}
                onSubmitEditing={handleAddTag}
              />
              <TouchableOpacity
                style={styles.addTagButton}
                onPress={handleAddTag}
                activeOpacity={0.7}
              >
                <IconSymbol name="add" size={20} color="#10B981" />
              </TouchableOpacity>
            </View>
            {formData.tags && formData.tags.length > 0 && (
              <View style={styles.tagList}>
                {formData.tags.map((tag, index) => (
                  <View key={index} style={styles.tagItem}>
                    <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                    <TouchableOpacity
                      style={styles.removeTagButton}
                      onPress={() => handleRemoveTag(index)}
                      activeOpacity={0.7}
                    >
                      <IconSymbol name="close" size={16} color="#6B7280" />
                    </TouchableOpacity>
                  </View>
                ))}
              </View>
            )}
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

          {/* 날짜 선택 */}
          <ThemedView style={styles.inputSection}>
            <View style={styles.dateHeader}>
              <ThemedText style={styles.inputLabel}>날짜</ThemedText>
              <TouchableOpacity
                style={styles.allDayToggle}
                onPress={() => setFormData({ ...formData, allDay: !formData.allDay })}
                activeOpacity={0.7}
              >
                <IconSymbol 
                  name={formData.allDay ? "check-box" : "check-box-outline-blank"} 
                  size={20} 
                  color={formData.allDay ? "#10B981" : "#6B7280"} 
                />
                <ThemedText style={[
                  styles.allDayToggleText,
                  formData.allDay && styles.allDayToggleTextActive
                ]}>
                  종일
                </ThemedText>
              </TouchableOpacity>
            </View>
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

          {/* 시간 설정 - 종일이 체크되지 않았을 때만 표시 */}
          {!formData.allDay && (
            <ThemedView style={styles.inputSection}>
              <View style={styles.timeInputs}>
                <View style={styles.timeInput}>
                  <ThemedText style={styles.timeLabel}>시작 시간</ThemedText>
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
                  <ThemedText style={styles.timeLabel}>종료 시간</ThemedText>
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
            </ThemedView>
          )}

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
  timeSection: {
    gap: 16,
  },
  allDayToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    backgroundColor: '#fff',
    gap: 8,
  },
  allDayToggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  allDayToggleTextActive: {
    color: '#10B981',
    fontWeight: '700',
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
  // 태그 관련 스타일
  tagInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  tagInput: {
    flex: 1,
    fontSize: 14,
    color: '#11181C',
    paddingVertical: 0,
  },
  addTagButton: {
    padding: 8,
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginTop: 8,
  },
  tagItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  tagText: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '500',
  },
  removeTagButton: {
    padding: 4,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
});
