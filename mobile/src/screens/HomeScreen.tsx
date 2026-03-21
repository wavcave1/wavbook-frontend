import React, { useCallback } from 'react';
import { Button, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { StudioCard } from '@/components/StudioCard';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { publicApi } from '@/services/publicApi';
import type { MarketplaceStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Home'>;

export function HomeScreen({ navigation }: Props) {
  const [refreshKey, setRefreshKey] = React.useState(0);
  const loadHome = useCallback(() => publicApi.getHome(), []);
  const { data, loading, error } = useAsyncResource(loadHome, [refreshKey]);

  return (
    <Screen
      title="Book the right studio faster"
      subtitle="Browse public studio profiles, compare locations, and move from discovery into availability-aware booking."
      loading={loading}
      error={error}
      onRefresh={() => setRefreshKey((value) => value + 1)}
    >
      <View style={{ gap: 12 }}>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>Featured studios</Text>
        {data?.featured.map((studio) => (
          <StudioCard key={studio.id} studio={studio} onPress={() => navigation.navigate('StudioDetails', { slug: studio.slug })} />
        ))}
      </View>
      <Button title="Browse all studios" onPress={() => navigation.navigate('Browse')} />
    </Screen>
  );
}
