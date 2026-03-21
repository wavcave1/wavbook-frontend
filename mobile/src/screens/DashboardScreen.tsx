import React, { useCallback } from 'react';
import { Button, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { adminApi } from '@/services/adminApi';

export function DashboardScreen() {
  const { accessToken, signOut } = useAuth();
  const loadProfile = useCallback(() => adminApi.getMe(accessToken ?? ''), [accessToken]);
  const { data, loading, error } = useAsyncResource(loadProfile, [accessToken]);

  return (
    <Screen title="Operator workspace" subtitle="Studio memberships, current access, and a quick path to sign out." loading={loading} error={error}>
      <View style={{ gap: 12 }}>
        <Text style={{ color: '#fff' }}>{data?.email ?? 'No authenticated operator profile found.'}</Text>
        {data?.accessible_studios?.map((studio) => (
          <View key={studio.id} style={{ backgroundColor: '#171a24', padding: 16, borderRadius: 16, gap: 6 }}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{studio.name}</Text>
            <Text style={{ color: '#8f7cff' }}>{studio.membership_role} · {studio.timezone}</Text>
          </View>
        ))}
        <Button title="Sign out" onPress={() => signOut()} />
      </View>
    </Screen>
  );
}
