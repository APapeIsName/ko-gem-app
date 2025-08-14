import { PlaceCity } from '@/store/types/places';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { ThemedView } from '../../ThemedView';
import { IconSymbol } from '../../ui/IconSymbol';

interface HeaderDropdownProps {
  selectedCity: PlaceCity;
  onCitySelect: (city: PlaceCity) => void;
}

export function HeaderDropdown({ selectedCity, onCitySelect }: HeaderDropdownProps) {
  // 도시 목록 (PlaceCity enum에서 가져오기)
  const cities = Object.values(PlaceCity);

  return (
    <ThemedView style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={true}
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
        onScroll={() => {}}
      >
        {cities.map((city) => (
          <TouchableOpacity
            key={city}
            style={[
              styles.cityItem,
              city === selectedCity && styles.selectedCityItem
            ]}
            onPress={() => onCitySelect(city)}
            activeOpacity={0.7}
          >
            <ThemedText 
              style={[
                styles.cityName,
                city === selectedCity && styles.selectedCityName
              ]}
            >
              {city.toString()}
            </ThemedText>
            {city === selectedCity && (
              <IconSymbol name="check" size={20} color="#0a7ea4" />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 200,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  cityItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 4,
  },
  selectedCityItem: {
    backgroundColor: '#e3f2fd',
    borderWidth: 1,
    borderColor: '#0a7ea4',
  },
  cityName: {
    fontSize: 16,
    color: '#11181C',
  },
  selectedCityName: {
    color: '#0a7ea4',
    fontWeight: '600',
  },
});