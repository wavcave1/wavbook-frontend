import React, { useCallback } from 'react';
import { Button, Image, Linking, Text, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { publicApi } from '@/services/publicApi';
import type { MarketplaceStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'StudioDetails'>;

export function StudioDetailsScreen({ route, navigation }: Props) {
  const { slug } = route.params;
  const loadStudio = useCallback(() => publicApi.getStudio(slug), [slug]);
  const { data, loading, error } = useAsyncResource(loadStudio, [slug]);

  return (
    <Screen title={data?.displayName ?? 'Studio details'} subtitle={data?.serviceArea ?? data?.address} loading={loading} error={error}>
      {data ? (
        <View style={{ gap: 12 }}>
          {data.heroImage?.url ? <Image source={{ uri: data.heroImage.url }} style={{ width: '100%', height: 220, borderRadius: 18 }} /> : null}
          <Text style={{ color: '#d7dbe6', lineHeight: 22 }}>{data.about}</Text>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Booking policy</Text>
          <Text style={{ color: '#bcc2d0', lineHeight: 22 }}>{data.bookingPolicy}</Text>
          {data.bookingLinkMode === 'external' && data.externalBookingUrl ? (
            <Button title="Open external booking" onPress={() => Linking.openURL(data.externalBookingUrl!)} />
          ) : (
            <Button title="Start booking" onPress={() => navigation.navigate('Booking', { slug })} />
          )}
        </View>
      ) : null}
    </Screen>
  );
}
