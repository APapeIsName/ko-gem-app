import { LocationHeader } from '@/components/common/LocationHeader';
import { ImageCardSection } from '@/components/home/list/ImageCardSection';
import { ThemedView } from '@/components/ThemedView';
import { mockPlaces } from '@/data';
import { usePlacesStore } from '@/store/slices/placesSlice';
import { PlaceCity } from '@/store/types/places';
import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeScreen() {
  const { recommendedPlaces, popularPlaces, placeCity, setPlaceCity } = usePlacesStore();

  useEffect(() => {
    setPlaceCity(PlaceCity.ALL);
  }, []);

  const handleLocationChange = (city: PlaceCity) => {
    setPlaceCity(city);
    console.log('선택된 도시:', city.toString());
    // TODO: 선택된 도시에 따라 데이터 새로고침
  };

  return (
    <ThemedView style={styles.container}>
      <LocationHeader 
        location={placeCity}
        onLocationPress={() => console.log('위치 선택')}
        onMapPress={() => console.log('지도 열기')}
        onLocationChange={handleLocationChange}
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
    zIndex: 1, // 낮은 zIndex로 설정
  },
  content: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 20,
    zIndex: 1, // 낮은 zIndex로 설정
  },
});
