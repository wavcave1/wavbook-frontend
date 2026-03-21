import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import type { PublicStudioProfile } from '@/services/types';

export function StudioCard({ studio, onPress }: { studio: PublicStudioProfile; onPress: () => void }) {
  return (
    <Pressable style={styles.card} onPress={onPress}>
      {studio.heroImage?.url ? <Image source={{ uri: studio.heroImage.url }} style={styles.image} /> : <View style={styles.imageFallback}><Text style={styles.imageFallbackText}>{studio.displayName.slice(0, 2)}</Text></View>}
      <Text style={styles.name}>{studio.displayName}</Text>
      <Text style={styles.meta}>{studio.address || studio.serviceArea}</Text>
      <Text style={styles.copy} numberOfLines={3}>{studio.about}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: '#171a24', borderRadius: 20, padding: 16, gap: 10, borderWidth: 1, borderColor: '#242938' },
  image: { height: 180, borderRadius: 14, width: '100%' },
  imageFallback: { height: 180, borderRadius: 14, backgroundColor: '#2b3040', alignItems: 'center', justifyContent: 'center' },
  imageFallbackText: { color: '#fff', fontSize: 28, fontWeight: '700' },
  name: { color: '#fff', fontSize: 18, fontWeight: '700' },
  meta: { color: '#8f7cff', fontSize: 13 },
  copy: { color: '#bcc2d0', lineHeight: 20 },
});
