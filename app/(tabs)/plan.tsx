import { TitleHeader } from '@/components/common';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { ScrollView, StyleSheet } from 'react-native';

import { NAVIGATION_ICONS } from '@/data';

export default function PlanScreen() {
  return (
    <ThemedView style={styles.container}>
      <TitleHeader title="계획" />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <ThemedView style={styles.content}>
          <ThemedText style={styles.subtitle}>새로운 장소와 경험을 발견하세요</ThemedText>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>추천 장소</ThemedText>
            <ThemedView style={styles.recommendationCard}>
              <IconSymbol name={NAVIGATION_ICONS.SEND} size={24} color="#0a7ea4" />
              <ThemedText style={styles.cardTitle}>오늘의 추천</ThemedText>
              <ThemedText style={styles.cardSubtitle}>사용자 맞춤형 장소 추천</ThemedText>
            </ThemedView>
          </ThemedView>
          
          <ThemedView style={styles.section}>
            <ThemedText style={styles.sectionTitle}>인기 태그</ThemedText>
            <ThemedView style={styles.tagsContainer}>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>자연</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>문화</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>맛집</ThemedText>
              </ThemedView>
              <ThemedView style={styles.tag}>
                <ThemedText style={styles.tagText}>역사</ThemedText>
              </ThemedView>
            </ThemedView>
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
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#687076',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
    marginBottom: 16,
  },
  recommendationCard: {
    backgroundColor: '#f8f9fa',
    padding: 20,
    borderRadius: 12,
    alignItems: 'center',
    gap: 8,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#11181C',
  },
  cardSubtitle: {
    fontSize: 14,
    color: '#687076',
    textAlign: 'center',
  },
  tagsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#e9ecef',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  tagText: {
    fontSize: 14,
    color: '#687076',
  },
});
