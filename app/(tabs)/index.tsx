import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCardSection } from '@/components/find/list/ImageCardSection';
import { ThemedView } from '@/components/ThemedView';
import { mockPlaces } from '@/data';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <LocationHeader 
        location="서울"
        onLocationPress={() => console.log('위치 선택')}
        onMapPress={() => console.log('지도 열기')}
        useSafeArea={true}
      />
      
      <View style={styles.content}>
        <ImageCardSection title="코젬 추천 픽 👍" cards={mockPlaces.kogemPicks} />
        <ImageCardSection title="지금 핫한 곳 🔥" cards={mockPlaces.popularPlaces} />
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
  },
});
