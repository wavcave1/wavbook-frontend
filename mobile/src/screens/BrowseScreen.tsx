import React, { useCallback } from 'react';
import { Button, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { StudioCard } from '@/components/StudioCard';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { publicApi } from '@/services/publicApi';
import type { MarketplaceStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Browse'>;

export function BrowseScreen({ navigation }: Props) {
  const [query, setQuery] = React.useState('');
  const [location, setLocation] = React.useState('');
  const [submitted, setSubmitted] = React.useState({ q: '', location: '' });
  const loadStudios = useCallback(() => publicApi.searchStudios(submitted), [submitted]);
  const { data, loading, error } = useAsyncResource(loadStudios, [submitted]);

  return (
    <Screen title="Browse studios" subtitle="Search by studio name, slug, or location." loading={loading} error={error}>
      <View style={{ gap: 8 }}>
        <TextInput placeholder="Search studios" placeholderTextColor="#80889b" value={query} onChangeText={setQuery} style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <TextInput placeholder="Location" placeholderTextColor="#80889b" value={location} onChangeText={setLocation} style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <Button title="Apply filters" onPress={() => setSubmitted({ q: query, location })} />
      </View>
      <View style={{ gap: 12 }}>
        {data?.studios.map((studio) => (
          <StudioCard key={studio.id} studio={studio} onPress={() => navigation.navigate('StudioDetails', { slug: studio.slug })} />
        ))}
      </View>
    </Screen>
  );
}
