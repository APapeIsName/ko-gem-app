import { ImageCardSection } from '@/components/find/list/ImageCardSection';
import { LocationHeader } from '@/components/find/list/LocationHeader';
import { ThemedView } from '@/components/ThemedView';
import { mockPlaces } from '@/data';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <LocationHeader />
        <ImageCardSection title="코젬 추천 픽 👍" cards={mockPlaces.kogemPicks} />
        <ImageCardSection title="실시간 핫플레이스 🔥" cards={mockPlaces.popularPlaces} />
      </ThemedView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
});
