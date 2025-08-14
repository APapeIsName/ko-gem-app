import { ImageCardProps } from '@/types/find/list/type';
import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

export function ImageCard({ item, onPress }: ImageCardProps) {
  const handlePress = () => {
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity style={styles.container} onPress={handlePress}>
      <View style={styles.imageContainer}>
        <Image source={item.image} style={styles.image} contentFit="cover" />
        <View style={styles.overlay}>
          <ThemedText style={styles.overlayText}>{item.overlay}</ThemedText>
        </View>
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={styles.subtitle} numberOfLines={1}>{item.subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: 140, // 고정된 너비 설정
    marginRight: 12, // 오른쪽 마진으로 간격 조정
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: 140, // 고정된 너비
    height: 120,
    borderRadius: 12,
  },
  overlay: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    borderRadius: 12,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  overlayText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  textContainer: {
    gap: 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#11181C',
  },
  subtitle: {
    fontSize: 12,
    color: '#687076',
  },
});
