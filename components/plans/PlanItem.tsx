import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { PlanItem as PlanItemType } from '@/types/plan/type';

interface PlanItemProps {
  item: PlanItemType;
  onPress?: () => void;
  onToggleComplete?: () => void;
}

export function PlanItem({ item, onPress, onToggleComplete }: PlanItemProps) {
  const handleToggleComplete = () => {
    if (onToggleComplete) {
      onToggleComplete();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.content}>
        <View style={styles.header}>
          <ThemedText style={[styles.title, item.isCompleted && styles.completedTitle]}>
            {item.title}
          </ThemedText>
          <TouchableOpacity
            style={[styles.checkbox, item.isCompleted && styles.checkedCheckbox]}
            onPress={handleToggleComplete}
            activeOpacity={0.7}
          >
            {item.isCompleted && (
              <IconSymbol name="check" size={16} color="#fff" />
            )}
          </TouchableOpacity>
        </View>
        
        {item.description && (
          <ThemedText style={styles.description} numberOfLines={2}>
            {item.description}
          </ThemedText>
        )}
        
        <View style={styles.details}>
          {item.time && (
            <View style={styles.detailItem}>
              <IconSymbol name="schedule" size={16} color="#687076" />
              <ThemedText style={styles.detailText}>{item.time}</ThemedText>
            </View>
          )}
          
          {item.location && (
            <View style={styles.detailItem}>
              <IconSymbol name="location-on" size={16} color="#687076" />
              <ThemedText style={styles.detailText}>{item.location}</ThemedText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    flex: 1,
    marginRight: 12,
  },
  completedTitle: {
    textDecorationLine: 'line-through',
    color: '#9CA3AF',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E5E7EB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkedCheckbox: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },
  description: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 12,
    lineHeight: 20,
  },
  details: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#687076',
  },
});
