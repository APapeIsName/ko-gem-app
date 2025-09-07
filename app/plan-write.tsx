import DatePicker from '@/components/common/DatePicker';
import TimePicker from '@/components/common/TimePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useCreatePlan, usePlanById, useUpdatePlan } from '@/hooks/api/usePlans';
import { PlanFormData } from '@/types/plan/type';
import { convertUTCToKoreanDate, createKoreanDateTime, formatDate, getKoreanDate, normalizeTags } from '@/utils/helpers';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

export default function PlanWriteScreen() {
  const router = useRouter();
  const { date, id, mode } = useLocalSearchParams();
  
  // 편집 모드 확인
  const isEditMode = mode === 'edit' && typeof id === 'string';
  
  // TanStack Query hooks
  const createPlanMutation = useCreatePlan();
  const updatePlanMutation = useUpdatePlan();
  const { data: existingPlan, isLoading: isLoadingPlan } = usePlanById(
    isEditMode ? id as string : ''
  );
  
  // 한국 시간대를 고려한 현재 날짜는 utils에서 가져옴
  
  // DatePicker와 TimePicker 상태 관리
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);
  
  // 태그 입력 상태
  const [tagInput, setTagInput] = useState('');
  
  const [formData, setFormData] = useState<PlanFormData>(() => ({
    title: '',
    description: '',
    startDate: date as string || getKoreanDate(),
    endDate: date as string || getKoreanDate(),
    startTime: '09:00',
    endTime: '10:00',
    allDay: true,
    location: '',
    tags: [],
    notes: '',
  }));

  // 편집 모드일 때 기존 계획 데이터로 폼 초기화
  useEffect(() => {
    if (isEditMode && existingPlan && !isLoadingPlan) {
      const startDate = convertUTCToKoreanDate(existingPlan.startDate);
      const endDate = existingPlan.endDate ? convertUTCToKoreanDate(existingPlan.endDate) : startDate;
      
      setFormData({
        title: existingPlan.title || '',
        description: existingPlan.description || '',
        startDate: startDate,
        endDate: endDate,
        startTime: existingPlan.startTime || '09:00',
        endTime: existingPlan.endTime || '10:00',
        allDay: existingPlan.allDay || false,
        location: existingPlan.location || '',
        tags: normalizeTags(existingPlan.tags),
        notes: existingPlan.notes || '',
      });
    }
  }, [isEditMode, existingPlan, isLoadingPlan]);

  const handleBackPress = () => {
    router.back();
  };

  // 태그 추가
  const handleAddTag = () => {
    const trimmedTag = tagInput.trim();
    if (trimmedTag) {
      const currentTags = normalizeTags(formData.tags);
      if (!currentTags.includes(trimmedTag)) {
        setFormData(prev => ({
          ...prev,
          tags: [...currentTags, trimmedTag]
        }));
      }
      setTagInput('');
    }
  };

  // 태그 제거
  const handleRemoveTag = (index: number) => {
    const currentTags = normalizeTags(formData.tags);
    const updatedTags = currentTags.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      tags: updatedTags
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
      
      const planData = {
        ...formData,
        tags: normalizeTags(formData.tags), // 태그 정규화
        startDate: createKoreanDateTime(formData.startDate, formData.startTime || '09:00', formData.allDay, false),
        endDate: createKoreanDateTime(
          formData.endDate || formData.startDate, 
          formData.endTime || '10:00', 
          formData.allDay, 
          true
        ),
      };
      
      console.log('수정된 계획 데이터:', planData);
      
      if (isEditMode) {
        // 편집 모드: 계획 업데이트
        await updatePlanMutation.mutateAsync({
          id: id as string,
          updateData: planData
        });
        console.log('계획 업데이트 완료');
      } else {
        // 새 계획 생성
        await createPlanMutation.mutateAsync(planData);
        console.log('계획 생성 완료');
      }
      
      // 저장 성공 후 뒤로 가기
      router.back();
    } catch (error) {
      console.error('Failed to save plan:', error);
      const errorMessage = isEditMode ? '계획 수정에 실패했습니다' : '계획 저장에 실패했습니다';
      Alert.alert('오류', `${errorMessage}: ` + (error instanceof Error ? error.message : String(error)));
    }
  };

  const isFormValid = formData.title.trim().length > 0;
  const isSaving = isEditMode ? updatePlanMutation.isPending : createPlanMutation.isPending;

  // 로딩 중인 경우 로딩 화면 표시
  if (isEditMode && isLoadingPlan) {
    return (
      <ThemedView style={styles.container}>
        <ThemedView style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <IconSymbol name="arrow-back" size={24} color="#11181C" />
          </TouchableOpacity>
          <ThemedText style={styles.headerTitle}>계획 수정</ThemedText>
          <View style={styles.saveButton} />
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>계획을 불러오는 중...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

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
        
        <ThemedText style={styles.headerTitle}>
          {isEditMode ? '계획 수정' : '새 계획 작성'}
        </ThemedText>
        
        <TouchableOpacity
          style={[styles.saveButton, (!isFormValid || isSaving) && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid || isSaving}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.saveButtonText, (!isFormValid || isSaving) && styles.saveButtonTextDisabled]}>
            {isSaving 
              ? (isEditMode ? '수정 중...' : '저장 중...') 
              : (isEditMode ? '수정' : '저장')
            }
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
            {(() => {
              const normalizedTags = normalizeTags(formData.tags);
              return normalizedTags.length > 0 && (
                <View style={styles.tagList}>
                  {normalizedTags.map((tag, index) => (
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
              );
            })()}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
