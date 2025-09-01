import { usePlacesStore } from '@/store/slices/placesSlice';
import { ALL_AREA_CODE, AreaCodeItem } from '@/store/types/places';
import React from 'react';
import { ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { ThemedView } from '../../ThemedView';
import { IconSymbol } from '../../ui/IconSymbol';

interface HeaderDropdownProps {
  selectedAreaCode: AreaCodeItem | null;
  onAreaSelect: (areaCode: AreaCodeItem) => void;
}

export function HeaderDropdown({ selectedAreaCode, onAreaSelect }: HeaderDropdownProps) {
  const { areaCodes } = usePlacesStore();
  
  // 전국을 첫 번째로, 그 다음에 API에서 받아온 지역 코드들
  const allAreas = [ALL_AREA_CODE, ...areaCodes];

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
        {allAreas.map((area) => (
          <TouchableOpacity
            key={area.code || 'all'}
            style={[
              styles.cityItem,
              selectedAreaCode?.code === area.code && styles.selectedCityItem
            ]}
            onPress={() => onAreaSelect(area)}
            activeOpacity={0.7}
          >
            <ThemedText 
              style={[
                styles.cityName,
                selectedAreaCode?.code === area.code && styles.selectedCityName
              ]}
            >
              {area.name}
            </ThemedText>
            {selectedAreaCode?.code === area.code && (
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