import { ThemedText } from '@/components/ThemedText';
import React, { useEffect, useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (time: { hour: number; minute: number }) => void;
  initialTime?: { hour: number; minute: number };
  minTime?: { hour: number; minute: number };
  maxTime?: { hour: number; minute: number };
}

const { height: screenHeight } = Dimensions.get('window');
const ITEM_HEIGHT = 50;
const VISIBLE_ITEMS = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_ITEMS;

export default function TimePicker({
  visible,
  onClose,
  onConfirm,
  initialTime = { hour: 9, minute: 0 },
  minTime,
  maxTime,
}: TimePickerProps) {
  const [selectedHour, setSelectedHour] = useState(initialTime.hour);
  const [selectedMinute, setSelectedMinute] = useState(initialTime.minute);
  const [isAM, setIsAM] = useState(initialTime.hour < 12);

  const hourScrollRef = useRef<ScrollView>(null);
  const minuteScrollRef = useRef<ScrollView>(null);

  // 시간과 분 배열 생성
  const hours = Array.from({ length: 12 }, (_, i) => i + 1);
  const minutes = Array.from({ length: 60 }, (_, i) => i);

  // 24시간 형식으로 변환
  const get24Hour = (hour: number, isAM: boolean) => {
    if (isAM) {
      return hour === 12 ? 0 : hour;
    } else {
      return hour === 12 ? 12 : hour + 12;
    }
  };

  // 12시간 형식으로 변환
  const get12Hour = (hour24: number) => {
    if (hour24 === 0) return 12;
    if (hour24 > 12) return hour24 - 12;
    return hour24;
  };

  // 초기 스크롤 위치 설정
  useEffect(() => {
    if (visible) {
      const initial12Hour = get12Hour(initialTime.hour);
      const hourIndex = hours.indexOf(initial12Hour);
      const minuteIndex = initialTime.minute;
      
      setTimeout(() => {
        hourScrollRef.current?.scrollTo({
          y: hourIndex * ITEM_HEIGHT,
          animated: false,
        });
        minuteScrollRef.current?.scrollTo({
          y: minuteIndex * ITEM_HEIGHT,
          animated: false,
        });
      }, 100);
    }
  }, [visible, initialTime]);

  // 시간 선택
  const handleHourSelect = (hour: number) => {
    setSelectedHour(hour);
  };

  // 분 선택
  const handleMinuteSelect = (minute: number) => {
    setSelectedMinute(minute);
  };

  // 오전/오후 토글
  const toggleAMPM = () => {
    setIsAM(!isAM);
  };

  // 확인 버튼
  const handleConfirm = () => {
    const hour24 = get24Hour(selectedHour, isAM);
    onConfirm({ hour: hour24, minute: selectedMinute });
    onClose();
  };

  // 시간이 선택 가능한지 확인
  const isTimeSelectable = (hour: number, minute: number, isAM: boolean) => {
    if (!minTime && !maxTime) return true;
    
    const time24 = get24Hour(hour, isAM);
    const totalMinutes = time24 * 60 + minute;
    
    if (minTime) {
      const minTotalMinutes = minTime.hour * 60 + minTime.minute;
      if (totalMinutes < minTotalMinutes) return false;
    }
    
    if (maxTime) {
      const maxTotalMinutes = maxTime.hour * 60 + maxTime.minute;
      if (totalMinutes > maxTotalMinutes) return false;
    }
    
    return true;
  };

  // 스크롤 이벤트 핸들러
  const handleHourScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < hours.length) {
      setSelectedHour(hours[index]);
    }
  };

  const handleMinuteScroll = (event: any) => {
    const y = event.nativeEvent.contentOffset.y;
    const index = Math.round(y / ITEM_HEIGHT);
    if (index >= 0 && index < minutes.length) {
      setSelectedMinute(minutes[index]);
    }
  };

  // 선택된 시간을 24시간 형식으로 표시
  const selectedTime24 = get24Hour(selectedHour, isAM);
  const timeString = `${selectedTime24.toString().padStart(2, '0')}:${selectedMinute.toString().padStart(2, '0')}`;

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
            
            <ThemedText style={styles.headerTitle}>시간 선택</ThemedText>
            
            <TouchableOpacity onPress={handleConfirm} style={styles.headerButton}>
              <ThemedText style={styles.confirmButtonText}>확인</ThemedText>
            </TouchableOpacity>
          </View>

          {/* 선택된 시간 표시 */}
          <View style={styles.selectedTimeContainer}>
            <ThemedText style={styles.selectedTimeText}>{timeString}</ThemedText>
          </View>

          {/* 시간 선택기 */}
          <View style={styles.pickerContainer}>
            {/* 오전/오후 선택 */}
            <View style={styles.ampmContainer}>
              <TouchableOpacity
                style={[styles.ampmButton, isAM && styles.ampmButtonActive]}
                onPress={() => setIsAM(true)}
              >
                <ThemedText style={[styles.ampmText, isAM && styles.ampmTextActive]}>
                  오전
                </ThemedText>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[styles.ampmButton, !isAM && styles.ampmButtonActive]}
                onPress={() => setIsAM(false)}
              >
                <ThemedText style={[styles.ampmText, !isAM && styles.ampmTextActive]}>
                  오후
                </ThemedText>
              </TouchableOpacity>
            </View>

            {/* 시간과 분을 가로로 배치 */}
            <View style={styles.timePickerRow}>
              {/* 시간 선택 */}
              <View style={styles.timePickerColumn}>
                <ThemedText style={styles.columnLabel}>시</ThemedText>
                <View style={styles.pickerWrapper}>
                  <ScrollView
                    ref={hourScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleHourScroll}
                    contentContainerStyle={styles.scrollContent}
                  >
                    {hours.map((hour, index) => (
                      <TouchableOpacity
                        key={hour}
                        style={[
                          styles.pickerItem,
                          selectedHour === hour && styles.selectedPickerItem
                        ]}
                        onPress={() => handleHourSelect(hour)}
                      >
                        <ThemedText style={[
                          styles.pickerItemText,
                          selectedHour === hour && styles.selectedPickerItemText
                        ]}>
                          {hour}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>

              {/* 분 선택 */}
              <View style={styles.timePickerColumn}>
                <ThemedText style={styles.columnLabel}>분</ThemedText>
                <View style={styles.pickerWrapper}>
                  <ScrollView
                    ref={minuteScrollRef}
                    showsVerticalScrollIndicator={false}
                    snapToInterval={ITEM_HEIGHT}
                    decelerationRate="fast"
                    onMomentumScrollEnd={handleMinuteScroll}
                    contentContainerStyle={styles.scrollContent}
                  >
                    {minutes.map((minute, index) => (
                      <TouchableOpacity
                        key={minute}
                        style={[
                          styles.pickerItem,
                          selectedMinute === minute && styles.selectedPickerItem
                        ]}
                        onPress={() => handleMinuteSelect(minute)}
                      >
                        <ThemedText style={[
                          styles.pickerItemText,
                          selectedMinute === minute && styles.selectedPickerItemText
                        ]}>
                          {minute.toString().padStart(2, '0')}
                        </ThemedText>
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
              </View>
            </View>
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
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  confirmButtonText: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '600',
  },
  selectedTimeContainer: {
    alignItems: 'center',
    paddingVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  selectedTimeText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#11181C',
  },
  pickerContainer: {
    flexDirection: 'column',
    paddingHorizontal: 20,
    paddingVertical: 20,
    gap: 20,
  },
  ampmContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  ampmButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    backgroundColor: 'white',
  },
  ampmButtonActive: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  ampmText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  ampmTextActive: {
    color: 'white',
  },
  timePickerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 30, // 시간과 분 사이의 간격을 늘림
  },
  timePickerColumn: {
    alignItems: 'center',
    minWidth: 100, // 너비를 늘려서 더 여유롭게
  },
  columnLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 12,
  },
  pickerWrapper: {
    height: PICKER_HEIGHT,
    position: 'relative',
  },
  scrollContent: {
    paddingVertical: PICKER_HEIGHT / 2 - ITEM_HEIGHT / 2,
  },
  pickerItem: {
    height: ITEM_HEIGHT,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
  selectedPickerItem: {
    // 선택된 아이템은 highlight와 겹치므로 스타일링
  },
  pickerItemText: {
    fontSize: 24,
    fontWeight: '500',
    color: '#6B7280',
  },
  selectedPickerItemText: {
    color: '#10B981', // 선택된 숫자를 초록색으로 강조
    fontWeight: '700', // 더 굵게 표시
    fontSize: 28, // 선택된 숫자를 더 크게 표시
  },
});
