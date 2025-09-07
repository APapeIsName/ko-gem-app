import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { usePlanById } from '@/hooks/api/usePlans';
import { convertUTCToKoreanDate, formatDate, normalizeTags } from '@/utils/helpers';
import { useFocusEffect } from '@react-navigation/native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback } from 'react';
import { ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function PlanDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  
  // TanStack Query를 사용하여 계획 데이터 로드
  const { 
    data: plan, 
    isLoading: loading, 
    error,
    refetch 
  } = usePlanById(typeof id === 'string' ? id : '');

  // 화면이 포커스될 때마다 데이터 새로고침
  useFocusEffect(
    useCallback(() => {
      if (typeof id === 'string') {
        refetch();
      }
    }, [id, refetch])
  );

  const handleBackPress = () => {
    router.back();
  };

  const handleEditPress = () => {
    if (plan) {
      router.push({
        pathname: '/plan-write',
        params: {
          id: plan.id,
          mode: 'edit'
        }
      });
    }
  };

  if (loading) {
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
          <ThemedText style={styles.headerTitle}>계획 상세</ThemedText>
          <View style={styles.editButton} />
        </ThemedView>
        <ThemedView style={styles.loadingContainer}>
          <ThemedText style={styles.loadingText}>로딩 중...</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  if (error) {
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
          <ThemedText style={styles.headerTitle}>계획 상세</ThemedText>
          <TouchableOpacity
            style={styles.editButton}
            onPress={() => refetch()}
            activeOpacity={0.7}
          >
            <IconSymbol name="refresh" size={20} color="#10B981" />
          </TouchableOpacity>
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>계획을 불러오는데 실패했습니다.</ThemedText>
          <TouchableOpacity 
            style={styles.retryButton} 
            onPress={() => refetch()}
            activeOpacity={0.7}
          >
            <ThemedText style={styles.retryButtonText}>다시 시도</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    );
  }

  if (!plan) {
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
          <ThemedText style={styles.headerTitle}>계획 상세</ThemedText>
          <View style={styles.editButton} />
        </ThemedView>
        <ThemedView style={styles.errorContainer}>
          <ThemedText style={styles.errorText}>계획을 찾을 수 없습니다.</ThemedText>
        </ThemedView>
      </ThemedView>
    );
  }

  // 날짜 및 시간 포맷팅
  const formatDateTime = (dateString: string, timeString?: string, allDay?: boolean) => {
    const koreanDateString = convertUTCToKoreanDate(dateString);
    const dateFormatted = formatDate(koreanDateString, 'MM월 DD일');
    const dayFormatted = formatDate(koreanDateString, 'relative');
    
    if (allDay) {
      return `${dateFormatted} (${dayFormatted})`;
    } else if (timeString) {
      return `${dateFormatted} (${dayFormatted}) ${timeString}`;
    } else {
      return `${dateFormatted} (${dayFormatted})`;
    }
  };

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
        
        <ThemedText style={styles.headerTitle}>계획 상세</ThemedText>
        
        <TouchableOpacity
          style={styles.editButton}
          onPress={handleEditPress}
          activeOpacity={0.7}
        >
          <IconSymbol name="edit" size={20} color="#10B981" />
        </TouchableOpacity>
      </ThemedView>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          {/* 제목 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionLabel}>제목</ThemedText>
            <ThemedView style={styles.valueContainer}>
              <ThemedText style={styles.valueText}>{plan.title}</ThemedText>
            </ThemedView>
          </ThemedView>

          {/* 장소 */}
          {plan.location && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionLabel}>장소</ThemedText>
              <ThemedView style={styles.valueContainer}>
                <IconSymbol name="location-on" size={20} color="#6B7280" />
                <ThemedText style={styles.valueText}>{plan.location}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* 날짜 및 시간 */}
          <ThemedView style={styles.section}>
            <View style={styles.dateHeader}>
              <ThemedText style={styles.sectionLabel}>날짜</ThemedText>
              {plan.allDay && (
                <View style={styles.allDayBadge}>
                  <IconSymbol name="check-box" size={16} color="#10B981" />
                  <ThemedText style={styles.allDayBadgeText}>종일</ThemedText>
                </View>
              )}
            </View>
            
            <ThemedView style={styles.dateTimeContainer}>
              <View style={styles.dateTimeItem}>
                <IconSymbol name="calendar-today" size={20} color="#10B981" />
                <View style={styles.dateTimeTextContainer}>
                  <ThemedText style={styles.dateTimeLabel}>시작</ThemedText>
                  <ThemedText style={styles.dateTimeValue}>
                    {formatDateTime(plan.startDate, plan.startTime, plan.allDay)}
                  </ThemedText>
                </View>
              </View>
              
              {plan.endDate && plan.endDate !== plan.startDate && (
                <View style={styles.dateTimeItem}>
                  <IconSymbol name="calendar-today" size={20} color="#EF4444" />
                  <View style={styles.dateTimeTextContainer}>
                    <ThemedText style={styles.dateTimeLabel}>종료</ThemedText>
                    <ThemedText style={styles.dateTimeValue}>
                      {formatDateTime(plan.endDate, plan.endTime, plan.allDay)}
                    </ThemedText>
                  </View>
                </View>
              )}
            </ThemedView>
          </ThemedView>

          {/* 태그 */}
          {(() => {
            const normalizedTags = normalizeTags(plan.tags);
            return normalizedTags.length > 0 && (
              <ThemedView style={styles.section}>
                <ThemedText style={styles.sectionLabel}>태그</ThemedText>
                <View style={styles.tagList}>
                  {normalizedTags.map((tag, index) => (
                    <View key={index} style={styles.tagItem}>
                      <ThemedText style={styles.tagText}>#{tag}</ThemedText>
                    </View>
                  ))}
                </View>
              </ThemedView>
            );
          })()}

          {/* 설명 */}
          {plan.description && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionLabel}>설명</ThemedText>
              <ThemedView style={[styles.valueContainer, styles.descriptionContainer]}>
                <ThemedText style={styles.descriptionText}>{plan.description}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* 메모 */}
          {plan.notes && (
            <ThemedView style={styles.section}>
              <ThemedText style={styles.sectionLabel}>메모</ThemedText>
              <ThemedView style={[styles.valueContainer, styles.descriptionContainer]}>
                <ThemedText style={styles.descriptionText}>{plan.notes}</ThemedText>
              </ThemedView>
            </ThemedView>
          )}

          {/* 계획 정보 */}
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionLabel}>계획 정보</ThemedText>
            <ThemedView style={styles.metadataContainer}>
              <View style={styles.metadataItem}>
                <ThemedText style={styles.metadataLabel}>상태</ThemedText>
                <View style={[styles.statusBadge, getStatusBadgeStyle(plan.status)]}>
                  <ThemedText style={[styles.statusBadgeText, getStatusTextStyle(plan.status)]}>
                    {getStatusText(plan.status)}
                  </ThemedText>
                </View>
              </View>
              
              {plan.metadata && (
                <>
                  <View style={styles.metadataItem}>
                    <ThemedText style={styles.metadataLabel}>생성일</ThemedText>
                    <ThemedText style={styles.metadataValue}>
                      {new Date(plan.metadata.createdAt).toLocaleString('ko-KR')}
                    </ThemedText>
                  </View>
                  
                  <View style={styles.metadataItem}>
                    <ThemedText style={styles.metadataLabel}>수정일</ThemedText>
                    <ThemedText style={styles.metadataValue}>
                      {new Date(plan.metadata.updatedAt).toLocaleString('ko-KR')}
                    </ThemedText>
                  </View>
                </>
              )}
            </ThemedView>
          </ThemedView>

          {/* 바텀 여백 */}
          <View style={styles.bottomSpacer} />
        </ThemedView>
      </ScrollView>
    </ThemedView>
  );
}

// 상태에 따른 스타일 및 텍스트 함수들
const getStatusText = (status: string) => {
  switch (status) {
    case 'active':
      return '활성';
    case 'completed':
      return '완료';
    case 'cancelled':
      return '취소';
    default:
      return '알 수 없음';
  }
};

const getStatusBadgeStyle = (status: string) => {
  switch (status) {
    case 'active':
      return { backgroundColor: '#DBEAFE' };
    case 'completed':
      return { backgroundColor: '#D1FAE5' };
    case 'cancelled':
      return { backgroundColor: '#FEE2E2' };
    default:
      return { backgroundColor: '#F3F4F6' };
  }
};

const getStatusTextStyle = (status: string) => {
  switch (status) {
    case 'active':
      return { color: '#1D4ED8' };
    case 'completed':
      return { color: '#059669' };
    case 'cancelled':
      return { color: '#DC2626' };
    default:
      return { color: '#6B7280' };
  }
};

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
  editButton: {
    padding: 8,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
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
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 16,
    color: '#EF4444',
  },
  section: {
    marginBottom: 24,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 12,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 8,
  },
  valueText: {
    fontSize: 16,
    color: '#11181C',
    flex: 1,
  },
  descriptionContainer: {
    alignItems: 'flex-start',
    minHeight: 60,
  },
  descriptionText: {
    fontSize: 16,
    color: '#11181C',
    lineHeight: 24,
  },
  dateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  allDayBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  allDayBadgeText: {
    fontSize: 12,
    color: '#10B981',
    fontWeight: '600',
  },
  dateTimeContainer: {
    gap: 12,
  },
  dateTimeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    gap: 12,
  },
  dateTimeTextContainer: {
    flex: 1,
  },
  dateTimeLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
  dateTimeValue: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tagItem: {
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
  metadataContainer: {
    gap: 12,
  },
  metadataItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8F9FA',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
  },
  metadataLabel: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  metadataValue: {
    fontSize: 14,
    color: '#11181C',
    fontWeight: '500',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
  bottomSpacer: {
    height: 40,
  },
  retryButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    marginTop: 16,
  },
  retryButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
