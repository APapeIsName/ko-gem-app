import { ImageCardSection } from '@/components/find/list/ImageCardSection';
import { LocationHeader } from '@/components/find/list/LocationHeader';
import { ThemedView } from '@/components/ThemedView';
import { CardData } from '@/types/find/list/type';
import { StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HomeScreen() {
  const kogemPicks: CardData[] = [
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "도교먹 배재로",
      subtitle: "오펀리",
      overlay: "00"
    },
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "앤레이",
      subtitle: "이승비조정한",
      overlay: "00"
    },
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "신청의문",
      subtitle: "언들졸라",
      overlay: "00"
    }
  ];

  const popularPlaces: CardData[] = [
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "분석편유 히 견",
      subtitle: "교범학증",
      overlay: "00"
    },
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "조롱의보회노",
      subtitle: "문석 어메고",
      overlay: "00"
    },
    {
      image: require('@/assets/images/partial-react-logo.png'),
      title: "접심는일음",
      subtitle: "젼릉헌홰",
      overlay: "00"
    }
  ];

  return (
    <SafeAreaView style={styles.safeArea}>
      <ThemedView style={styles.container}>
        <LocationHeader />
        <ImageCardSection title="코젬 픽" cards={kogemPicks} />
        <ImageCardSection title="피도로 시차 떼로" cards={popularPlaces} />
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
