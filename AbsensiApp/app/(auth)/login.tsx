import { router } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View
} from 'react-native';
import Button from '../../components/Button';
import CustomText from '../../components/CustomText'; // Import CustomText
import Input from '../../components/Input';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/global';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Harap isi semua field');
      return;
    }

    setLoading(true);
    const result = await login(email, password);
    setLoading(false);

    if (result.success) {
      console.log('Login berhasil, redirecting...');
    } else {
      Alert.alert('Login Gagal', result.error);
    }
  };

  const handleDemoLogin = (role: 'admin' | 'karyawan') => {
    const demoAccounts = {
      admin: { email: 'admin@absensi.com', password: 'password123' },
      karyawan: { email: 'budi@absensi.com', password: 'password123' }
    };
    setEmail(demoAccounts[role].email);
    setPassword(demoAccounts[role].password);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: Colors.background }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={{
          flexGrow: 1,
          justifyContent: 'center',
          paddingHorizontal: 24,
          paddingVertical: 32,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={{ alignItems: 'center', marginBottom: 40 }}>
          <View
            style={{
              backgroundColor: Colors.primary,
              width: 90,
              height: 90,
              borderRadius: 45,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 16,
              shadowColor: '#000',
              shadowOpacity: 0.2,
              shadowOffset: { width: 0, height: 4 },
              shadowRadius: 6,
              elevation: 5,
            }}
          >
            <CustomText variant="bold" size="3xl" style={{ color: 'white' }}>
              A
            </CustomText>
          </View>

          <CustomText variant="bold" size="3xl" style={{ marginBottom: 4 }}>
            Absensi App
          </CustomText>
          <CustomText
            variant="regular"
            size="base"
            style={{ color: Colors.gray, textAlign: 'center' }}
          >
            Silakan login untuk melanjutkan
          </CustomText>
        </View>

        {/* Login Card */}
        <View
          style={{
            backgroundColor: 'white',
            borderRadius: 12,
            padding: 24,
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
            elevation: 3,
          }}
        >
          <CustomText
            variant="semiBold"
            size="lg"
            style={{
              textAlign: 'center',
              marginBottom: 24,
            }}
          >
            Masuk ke Akun Anda
          </CustomText>

          <Input
            label="Email"
            placeholder="Masukkan email Anda"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />

          <Input
            label="Password"
            placeholder="Masukkan password Anda"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />

          <Button
            title={loading ? 'Memproses...' : 'Login'}
            onPress={handleLogin}
            loading={loading}
            disabled={loading}
            style={{ marginTop: 8 }}
          />

          {/* Demo Buttons */}
          <View style={{ marginTop: 28 }}>
            <CustomText
              variant="regular"
              size="sm"
              style={{
                color: Colors.gray,
                textAlign: 'center',
                marginBottom: 12,
              }}
            >
              Atau login dengan akun demo:
            </CustomText>

            <View style={{ flexDirection: 'row', gap: 12 }}>
              <Button
                title="Admin"
                variant="secondary"
                onPress={() => handleDemoLogin('admin')}
                style={{ flex: 1 }}
              />
              <Button
                title="Karyawan"
                onPress={() => handleDemoLogin('karyawan')}
                style={{ flex: 1 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}