import { Section } from '@/types/find/list/type';
import React from 'react';
import { ScrollView, StyleSheet } from 'react-native';
import { ThemedText } from '../ThemedText';
import { ThemedView } from '../ThemedView';
import { MoreButton } from './MoreButton';

interface HorizontalScrollSectionProps {
  section: Section;
  renderItem: (item: any, index: number) => React.ReactNode;
  onMorePress?: () => void;
}

export function HorizontalScrollSection({ 
  section, 
  renderItem, 
  onMorePress 
}: HorizontalScrollSectionProps) {
  const displayItems = section.maxItems 
    ? section.items.slice(0, section.maxItems) 
    : section.items;

  const handleMorePress = () => {
    if (onMorePress) {
      onMorePress();
    } else if (section.onMorePress) {
      section.onMorePress();
    }
  };

  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>{section.title}</ThemedText>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContainer}
      >
        {displayItems.map((item, index) => renderItem(item, index))}
        
        {/* 더보기 버튼 - 항상 표시 */}
        <MoreButton 
          text={section.moreButtonText || '더보기'}
          onPress={handleMorePress}
          size="medium"
        />
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#11181C',
    marginBottom: 16,
  },
  scrollContainer: {
    paddingRight: 16,
  },
});
