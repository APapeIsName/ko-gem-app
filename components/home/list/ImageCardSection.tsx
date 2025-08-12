import { ImageCardSectionProps } from '@/types/find/list/type';
import React from 'react';
import { StyleSheet, View } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { ThemedView } from '../../ThemedView';
import { ImageCard } from './ImageCard';

export function ImageCardSection({ title, cards }: ImageCardSectionProps) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
      <View style={styles.cardsContainer}>
        {cards.map((card, index) => (
          <ImageCard
            key={index}
            image={card.image}
            title={card.title}
            subtitle={card.subtitle}
            overlay={card.overlay}
          />
        ))}
      </View>
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
  cardsContainer: {
    flexDirection: 'row',
    gap: 12,
  },
});
