import React, { useCallback } from 'react';
import { Button, Text, TextInput, View } from 'react-native';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import { Screen } from '@/components/Screen';
import { useAsyncResource } from '@/hooks/useAsyncResource';
import { publicApi } from '@/services/publicApi';
import type { MarketplaceStackParamList } from '@/navigation/RootNavigator';

type Props = NativeStackScreenProps<MarketplaceStackParamList, 'Booking'>;

const tomorrowIso = () => {
  const date = new Date();
  date.setDate(date.getDate() + 1);
  return date.toISOString().slice(0, 10);
};

export function BookingScreen({ route }: Props) {
  const { slug } = route.params;
  const [service, setService] = React.useState<'2hr' | '4hr' | '8hr' | '12hr'>('2hr');
  const [paymentType, setPaymentType] = React.useState<'full' | 'deposit'>('full');
  const [date, setDate] = React.useState(() => tomorrowIso());
  const [time, setTime] = React.useState('10:00');
  const [name, setName] = React.useState('');
  const [email, setEmail] = React.useState('');
  const [phone, setPhone] = React.useState('');
  const [message, setMessage] = React.useState<string | null>(null);
  const loadPrices = useCallback(() => publicApi.getPrices(new Date(`${date}T12:00:00`).toISOString()), [date]);
  const { data: prices } = useAsyncResource(loadPrices, [date]);

  const submit = async () => {
    const response = await publicApi.createPaymentIntent({
      studioSlug: slug,
      service,
      paymentType,
      name,
      email,
      phone,
      date: new Date(`${date}T${time}:00`).toISOString(),
    });

    setMessage(
      response.clientSecret
        ? 'Payment intent created. Complete the Stripe Payment Element on web or extend mobile with a native Stripe sheet next.'
        : 'Backend did not return a client secret.',
    );
  };

  return (
    <Screen title="Book session" subtitle="Mobile adapts the web flow by collecting booking details and creating the backend payment intent." error={message && message.includes('did not') ? message : null}>
      <View style={{ gap: 10 }}>
        <Text style={{ color: '#fff' }}>Session length</Text>
        <View style={{ flexDirection: 'row', gap: 8, flexWrap: 'wrap' }}>
          {(['2hr', '4hr', '8hr', '12hr'] as const).map((value) => (
            <Button key={value} title={value} onPress={() => setService(value)} color={service === value ? '#8f7cff' : '#444'} />
          ))}
        </View>
        <Text style={{ color: '#fff' }}>Payment type</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <Button title="Full" onPress={() => setPaymentType('full')} color={paymentType === 'full' ? '#8f7cff' : '#444'} />
          <Button title="Deposit" onPress={() => setPaymentType('deposit')} color={paymentType === 'deposit' ? '#8f7cff' : '#444'} />
        </View>
        <TextInput value={date} onChangeText={setDate} placeholder="YYYY-MM-DD" placeholderTextColor="#80889b" style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <TextInput value={time} onChangeText={setTime} placeholder="HH:mm" placeholderTextColor="#80889b" style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <TextInput value={name} onChangeText={setName} placeholder="Name" placeholderTextColor="#80889b" style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <TextInput value={email} onChangeText={setEmail} placeholder="Email" placeholderTextColor="#80889b" autoCapitalize="none" style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <TextInput value={phone} onChangeText={setPhone} placeholder="Phone" placeholderTextColor="#80889b" style={{ backgroundColor: '#171a24', color: '#fff', borderRadius: 12, padding: 14 }} />
        <Text style={{ color: '#bcc2d0' }}>Current {service} price: ${prices?.[service] ?? '—'}</Text>
        <Button title="Create payment intent" onPress={submit} />
        {message ? <Text style={{ color: '#c8d1ff' }}>{message}</Text> : null}
      </View>
    </Screen>
  );
}
