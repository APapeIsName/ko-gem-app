import { MoreButtonProps } from '@/types/find/list/type';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../ThemedText';
import { IconSymbol } from '../ui/IconSymbol';

export function MoreButton({ 
  text = '더보기', 
  onPress, 
  size = 'medium' 
}: MoreButtonProps) {
  const sizeStyles = {
    small: { width: 100, height: 80, iconSize: 32, arrowSize: 16 },
    medium: { width: 140, height: 120, iconSize: 40, arrowSize: 18 },
    large: { width: 180, height: 160, iconSize: 56, arrowSize: 22 }
  };

  const currentSize = sizeStyles[size];

  return (
    <TouchableOpacity 
      style={[styles.container, { width: currentSize.width, height: currentSize.height }]}
      onPress={onPress}
      activeOpacity={0.7}
    >
      <View style={[styles.iconContainer, { width: currentSize.iconSize, height: currentSize.iconSize }]}>
        <IconSymbol 
          name="arrow-forward" 
          size={currentSize.arrowSize} 
          color="#687076" 
        />
      </View>
      <ThemedText style={styles.text}>{text}</ThemedText>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainer: {
    borderRadius: 20,
    backgroundColor: '#E9ECEF',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  text: {
    fontSize: 14,
    fontWeight: '600',
    color: '#687076',
    textAlign: 'center',
  },
});
