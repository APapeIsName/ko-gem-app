import { TimePicker } from '@/components/plans/TimePicker';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlanFormData } from '@/types/plan/type';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, TextInput, TouchableOpacity } from 'react-native';

export default function PlanWriteScreen() {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  
  const [formData, setFormData] = useState<PlanFormData>({
    title: '',
    description: '',
    time: '',
    location: '',
  });

  const handleBackPress = () => {
    router.back();
  };

  const handleSave = () => {
    // TODO: 계획 저장 로직 구현
    console.log('계획 저장:', { date, ...formData });
    router.back();
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
          style={[styles.saveButton, !isFormValid && styles.saveButtonDisabled]}
          onPress={handleSave}
          disabled={!isFormValid}
          activeOpacity={0.7}
        >
          <ThemedText style={[styles.saveButtonText, !isFormValid && styles.saveButtonTextDisabled]}>
            저장
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 날짜 표시 */}
          <ThemedView style={styles.dateSection}>
            <ThemedText style={styles.dateLabel}>날짜</ThemedText>
            <ThemedText style={styles.dateText}>{date || '날짜 미설정'}</ThemedText>
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
            />
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
            />
          </ThemedView>

          {/* 시간 입력 */}
          <ThemedView style={styles.inputSection}>
            <ThemedText style={styles.inputLabel}>시간</ThemedText>
            <TimePicker
              value={formData.time}
              onChange={(time) => setFormData({ ...formData, time: time })}
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
});
