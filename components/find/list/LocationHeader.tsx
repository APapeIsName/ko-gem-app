import { LOCATION_ICONS, NAVIGATION_ICONS, UI_ICONS } from '@/data';
import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { ThemedText } from '../../ThemedText';
import { ThemedView } from '../../ThemedView';
import { IconSymbol } from '../../ui/IconSymbol';

interface LocationHeaderProps {
  location?: string;
  onLocationPress?: () => void;
  onMapPress?: () => void;
}

export function LocationHeader({ 
  location = "서울", 
  onLocationPress, 
  onMapPress 
}: LocationHeaderProps) {
  return (
    <ThemedView style={styles.container}>
      <TouchableOpacity style={styles.locationContainer} onPress={onLocationPress}>
        <IconSymbol name={LOCATION_ICONS.LOCATION_ON} size={16} color="#687076" />
        <ThemedText style={styles.locationText}>{location}</ThemedText>
        <IconSymbol name={NAVIGATION_ICONS.KEYBOARD_ARROW_DOWN} size={12} color="#687076" />
      </TouchableOpacity>
      
      <TouchableOpacity style={styles.mapButton} onPress={onMapPress}>
        <IconSymbol name={UI_ICONS.MAP} size={20} color="#687076" />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  locationText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#11181C',
  },
  mapButton: {
    padding: 8,
  },
});
