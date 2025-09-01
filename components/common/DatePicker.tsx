import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import React, { useMemo, useState } from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';

interface DatePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (date: Date) => void;
  initialDate?: Date;
  minDate?: Date;
  maxDate?: Date;
}

// 한국 시간대를 고려한 현재 날짜 가져오기
const getKoreanDate = () => {
  const now = new Date();
  // 한국 시간대 (UTC+9)로 정확하게 변환
  const utc = now.getTime() + (now.getTimezoneOffset() * 60000);
  const koreanTime = new Date(utc + (9 * 60000));
  return new Date(koreanTime.getFullYear(), koreanTime.getMonth(), koreanTime.getDate());
};

// 한국 시간대를 고려한 날짜 생성
const createKoreanDate = (year: number, month: number, day: number) => {
  // UTC 기준으로 날짜를 생성하고 9시간을 더해서 한국 시간대로 조정
  const utcDate = new Date(Date.UTC(year, month, day, 9, 0, 0));
  return utcDate;
};

export default function DatePicker({
  visible,
  onClose,
  onConfirm,
  initialDate = getKoreanDate(),
  minDate,
  maxDate,
}: DatePickerProps) {
  const [selectedDate, setSelectedDate] = useState(initialDate);
  const [currentMonth, setCurrentMonth] = useState(new Date(initialDate.getFullYear(), initialDate.getMonth(), 1));

  // 현재 월의 첫 번째 날과 마지막 날 계산 (한국 시간대 고려)
  const firstDayOfMonth = useMemo(() => {
    return createKoreanDate(currentMonth.getFullYear(), currentMonth.getMonth(), 1);
  }, [currentMonth]);

  const lastDayOfMonth = useMemo(() => {
    return createKoreanDate(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 0);
  }, [currentMonth]);

  // 현재 월의 첫 번째 날이 시작하는 요일 (0: 일요일, 1: 월요일, ...)
  const firstDayWeekday = firstDayOfMonth.getDay();
  
  // 현재 월의 총 일수
  const daysInMonth = lastDayOfMonth.getDate();

  // 이전 달로 이동
  const goToPreviousMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() - 1, 1);
      return newMonth;
    });
  };

  // 다음 달로 이동
  const goToNextMonth = () => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev.getFullYear(), prev.getMonth() + 1, 1);
      return newMonth;
    });
  };

  // 날짜 선택 (한국 시간대 고려)
  const selectDate = (day: number) => {
    const newDate = createKoreanDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    console.log('newDate', newDate);
    
    // minDate, maxDate 체크
    if (minDate && newDate < minDate) return;
    if (maxDate && newDate > maxDate) return;
    
    setSelectedDate(newDate);
  };

  // 날짜가 선택 가능한지 확인
  const isDateSelectable = (day: number) => {
    const date = createKoreanDate(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (minDate && date < minDate) return false;
    if (maxDate && date > maxDate) return false;
    return true;
  };

  // 날짜가 선택된 날짜인지 확인
  const isSelectedDate = (day: number) => {
    return (
      day === selectedDate.getDate() &&
      currentMonth.getMonth() === selectedDate.getMonth() &&
      currentMonth.getFullYear() === selectedDate.getFullYear()
    );
  };

  // 날짜가 오늘인지 확인 (한국 시간대 고려)
  const isToday = (day: number) => {
    const today = getKoreanDate();
    return (
      day === today.getDate() &&
      currentMonth.getMonth() === today.getMonth() &&
      currentMonth.getFullYear() === today.getFullYear()
    );
  };

  // 캘린더 그리드 생성
  const calendarDays = useMemo(() => {
    const days = [];
    
    // 이전 달의 마지막 날들 (빈 칸 채우기)
    for (let i = 0; i < firstDayWeekday; i++) {
      days.push(null);
    }
    
    // 현재 달의 날들
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    
    // 다음 달의 첫 번째 날들 (빈 칸 채우기, 6주 표시를 위해)
    const remainingDays = 42 - days.length;
    for (let i = 0; i < remainingDays; i++) {
      days.push(null);
    }
    
    return days;
  }, [firstDayWeekday, daysInMonth]);

  // 요일 헤더
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];

  // 월 이름
  const monthNames = [
    '1월', '2월', '3월', '4월', '5월', '6월',
    '7월', '8월', '9월', '10월', '11월', '12월'
  ];

  const handleConfirm = () => {
    onConfirm(selectedDate);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* 헤더 */}
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.headerButton}>
              <ThemedText style={styles.headerButtonText}>취소</ThemedText>
            </TouchableOpacity>
            
            <View style={styles.monthSelector}>
              <TouchableOpacity onPress={goToPreviousMonth} style={styles.monthButton}>
                <IconSymbol name="chevron-left" size={20} color="#6B7280" />
              </TouchableOpacity>
              
              <ThemedText style={styles.monthText}>
                {currentMonth.getFullYear()}년 {monthNames[currentMonth.getMonth()]}
              </ThemedText>
              
              <TouchableOpacity onPress={goToNextMonth} style={styles.monthButton}>
                <IconSymbol name="chevron-right" size={20} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
              <ThemedText style={styles.confirmButtonText}>확인</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 요일 헤더 */}
          <View style={styles.weekdayHeader}>
            {weekdays.map((weekday, index) => (
              <View key={index} style={styles.weekdayCell}>
                <ThemedText style={[
                  styles.weekdayText,
                  index === 0 && styles.sundayText,
                  index === 6 && styles.saturdayText
                ]}>
                  {weekday}
                </ThemedText>
              </View>
            ))}
          </View>

          {/* 캘린더 그리드 */}
          <View style={styles.calendarGrid}>
            {calendarDays.map((day, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.dayCell,
                  day && isSelectedDate(day) && styles.selectedDayCell,
                  day && isToday(day) && styles.todayCell,
                  !day && styles.emptyDayCell,
                  day && !isDateSelectable(day) && styles.disabledDayCell
                ]}
                onPress={() => day && selectDate(day)}
                disabled={!day || !isDateSelectable(day)}
              >
                {day && (
                  <ThemedText style={[
                    styles.dayText,
                    isSelectedDate(day) && styles.selectedDayText,
                    isToday(day) && !isSelectedDate(day) && styles.todayText,
                    !isDateSelectable(day) && styles.disabledDayText
                  ]}>
                    {day}
                  </ThemedText>
                )}
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  headerButtonText: {
    fontSize: 16,
    color: '#6B7280',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  monthSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  monthButton: {
    padding: 8,
  },
  monthText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    minWidth: 120,
    textAlign: 'center',
  },
  weekdayHeader: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 8,
  },
  weekdayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  sundayText: {
    color: '#EF4444',
  },
  saturdayText: {
    color: '#3B82F6',
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 8,
    paddingVertical: 16,
  },
  dayCell: {
    width: '14.28%', // 100% / 7
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  emptyDayCell: {
    // 빈 셀은 투명
  },
  selectedDayCell: {
    backgroundColor: '#10B981',
    borderRadius: 20,
  },
  todayCell: {
    borderWidth: 2,
    borderColor: '#10B981',
    borderRadius: 20,
  },
  disabledDayCell: {
    opacity: 0.3,
  },
  dayText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#11181C',
  },
  selectedDayText: {
    color: 'white',
    fontWeight: '600',
  },
  todayText: {
    color: '#10B981',
    fontWeight: '600',
  },
  disabledDayText: {
    color: '#9CA3AF',
  },
});
