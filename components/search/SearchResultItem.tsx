import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { SearchResult } from '@/types/find/list/type';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

interface SearchResultItemProps {
  item: SearchResult;
  onPress?: () => void;
}

export function SearchResultItem({ item, onPress }: SearchResultItemProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  const getIconName = () => {
    if (item.type === 'event') {
      return 'event';
    }
    switch (item.category) {
      case '음식점':
        return 'restaurant';
      case '카페':
        return 'local-cafe';
      case '관광지':
        return 'attractions';
      case '공원':
        return 'park';
      case '문화시설':
        return 'museum';
      case '상업시설':
        return 'store';
      case '교통시설':
        return 'train';
      default:
        return 'place';
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress} activeOpacity={0.7}>
      <View style={styles.iconContainer}>
        <IconSymbol name={getIconName()} size={24} color="#687076" />
      </View>
      <View style={styles.content}>
        <ThemedText style={styles.title} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={styles.subtitle} numberOfLines={1}>{item.subtitle}</ThemedText>
        <View style={styles.categoryContainer}>
          <ThemedText style={styles.category}>{item.category}</ThemedText>
          {item.type === 'event' && (
            <View style={styles.eventBadge}>
              <ThemedText style={styles.eventBadgeText}>행사</ThemedText>
            </View>
          )}
        </View>
      </View>
      <IconSymbol name="chevron-right" size={20} color="#C1C8CD" />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F3F4',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8F9FA',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#687076',
    marginBottom: 6,
  },
  categoryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  category: {
    fontSize: 12,
    color: '#687076',
    backgroundColor: '#F1F3F4',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventBadge: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  eventBadgeText: {
    fontSize: 10,
    color: '#fff',
    fontWeight: '600',
  },
});
