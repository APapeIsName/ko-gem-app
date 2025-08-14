import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { Modal, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

interface TimePickerProps {
  value?: string;
  onChange: (time: string) => void;
  placeholder?: string;
}

export function TimePicker({ value, onChange, placeholder = "시간 선택" }: TimePickerProps) {
  const [showPicker, setShowPicker] = useState(false);
  const [tempTime, setTempTime] = useState<Date>(() => {
    if (value) {
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    }
    return new Date();
  });

  const handleTimeChange = (event: any, selectedTime?: Date) => {
    if (Platform.OS === 'android') {
      setShowPicker(false);
    }
    
    if (selectedTime) {
      setTempTime(selectedTime);
      if (Platform.OS === 'ios') {
        // iOS에서는 확인 버튼을 눌러야 적용
        return;
      }
      // Android에서는 즉시 적용
      const timeString = selectedTime.toTimeString().slice(0, 5);
      onChange(timeString);
    }
  };

  const handleConfirm = () => {
    setShowPicker(false);
    const timeString = tempTime.toTimeString().slice(0, 5);
    onChange(timeString);
  };

  const handleCancel = () => {
    setShowPicker(false);
    setTempTime(value ? (() => {
      const [hours, minutes] = value.split(':');
      const date = new Date();
      date.setHours(parseInt(hours), parseInt(minutes), 0, 0);
      return date;
    })() : new Date());
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const minute = parseInt(minutes);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${ampm}`;
  };

  return (
    <>
      <TouchableOpacity
        style={styles.container}
        onPress={() => setShowPicker(true)}
        activeOpacity={0.7}
      >
        <IconSymbol name="schedule" size={20} color="#687076" />
        <ThemedText style={[styles.text, !value && styles.placeholderText]}>
          {value ? formatTime(value) : placeholder}
        </ThemedText>
        <IconSymbol name="keyboard-arrow-down" size={20} color="#687076" />
      </TouchableOpacity>

      {Platform.OS === 'ios' ? (
        <Modal
          visible={showPicker}
          transparent={true}
          animationType="slide"
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <TouchableOpacity onPress={handleCancel}>
                  <ThemedText style={styles.modalButton}>취소</ThemedText>
                </TouchableOpacity>
                <ThemedText style={styles.modalTitle}>시간 선택</ThemedText>
                <TouchableOpacity onPress={handleConfirm}>
                  <ThemedText style={styles.modalButton}>확인</ThemedText>
                </TouchableOpacity>
              </View>
              <DateTimePicker
                value={tempTime}
                mode="time"
                display="spinner"
                onChange={handleTimeChange}
                style={styles.picker}
              />
            </View>
          </View>
        </Modal>
      ) : (
        showPicker && (
          <DateTimePicker
            value={tempTime}
            mode="time"
            display="default"
            onChange={handleTimeChange}
          />
        )
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: '#fff',
    gap: 8,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#11181C',
  },
  placeholderText: {
    color: '#9CA3AF',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingBottom: 34, // Safe area
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  modalButton: {
    fontSize: 16,
    color: '#10B981',
    fontWeight: '500',
  },
  picker: {
    height: 200,
  },
});
