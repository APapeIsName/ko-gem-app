import { Image } from 'expo-image';
import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from '../../ThemedText';

interface ImageCardProps {
  image: any;
  title: string;
  subtitle: string;
  overlay: string;
  onPress?: () => void;
}

export function ImageCard({ image, title, subtitle, overlay, onPress }: ImageCardProps) {
  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image source={image} style={styles.image} contentFit="cover" />
        <View style={styles.overlay}>
          <ThemedText style={styles.overlayText}>{overlay}</ThemedText>
        </View>
      </View>
      <View style={styles.textContainer}>
        <ThemedText style={styles.title} numberOfLines={1}>{title}</ThemedText>
        <ThemedText style={styles.subtitle} numberOfLines={1}>{subtitle}</ThemedText>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxWidth: '30%',
  },
  imageContainer: {
    position: 'relative',
    marginBottom: 8,
  },
  image: {
    width: '100%',
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
