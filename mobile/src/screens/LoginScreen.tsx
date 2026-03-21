import React from 'react';
import { Button, Text, View } from 'react-native';
import { Screen } from '@/components/Screen';
import { useAuth } from '@/context/AuthContext';

export function LoginScreen() {
  const { signIn, loading } = useAuth();

  return (
    <Screen title="Operator login" subtitle="Use Auth0 Universal Login for studio workspace access." loading={loading}>
      <View style={{ gap: 12 }}>
        <Button title="Sign in" onPress={() => signIn('login')} />
        <Button title="Create operator account" onPress={() => signIn('signup')} />
        <Text style={{ color: '#bcc2d0', lineHeight: 22 }}>
          After sign-in, the mobile app uses your bearer token to call /api/auth and /api/admin routes on the new backend.
        </Text>
      </View>
    </Screen>
  );
}
