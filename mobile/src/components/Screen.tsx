import React from 'react';
import { ActivityIndicator, RefreshControl, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

export function Screen({ title, subtitle, children, loading, error, onRefresh }: { title: string; subtitle?: string; children: React.ReactNode; loading?: boolean; error?: string | null; onRefresh?: () => void }) {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.content}
        refreshControl={onRefresh ? <RefreshControl refreshing={Boolean(loading)} onRefresh={onRefresh} /> : undefined}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>WAVBOOK</Text>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
          {loading ? <ActivityIndicator color="#8f7cff" /> : null}
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#0f1118' },
  scroll: { flex: 1 },
  content: { padding: 20, gap: 16 },
  header: { gap: 6 },
  eyebrow: { color: '#8f7cff', fontSize: 12, fontWeight: '700', textTransform: 'uppercase', letterSpacing: 1 },
  title: { color: '#fff', fontSize: 28, fontWeight: '700' },
  subtitle: { color: '#b3b9c7', fontSize: 15, lineHeight: 22 },
  error: { color: '#ff7b7b', marginTop: 8 },
});
