import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef } from 'react';
import {
  Alert,
  Animated,
  Image,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/Button';
import CustomText from '../../components/CustomText'; // Import CustomText
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/global';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const handleLogout = () => {
    Alert.alert('Konfirmasi Logout', 'Apakah Anda yakin ingin logout?', [
      { text: 'Batal', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: logout,
      },
    ]);
  };

  const getRoleColor = () => (isAdmin ? Colors.danger : Colors.secondary);
  const getRoleText = () => (isAdmin ? 'Administrator' : 'Karyawan');

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#F5F6FA' }}
      contentContainerStyle={{
        paddingVertical: 24,
        paddingHorizontal: 16,
      }}
    >
      <Animated.View
        style={{
          opacity: fadeAnim,
          transform: [
            {
              translateY: fadeAnim.interpolate({
                inputRange: [0, 1],
                outputRange: [20, 0],
              }),
            },
          ],
        }}
      >
        {/* Header Profil */}
        <View
          style={{
            alignItems: 'center',
            backgroundColor: '#fff',
            borderRadius: 20,
            paddingVertical: 24,
            paddingHorizontal: 16,
            marginBottom: 24,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            }}
            style={{
              width: 100,
              height: 100,
              borderRadius: 50,
              marginBottom: 12,
              borderWidth: 2,
              borderColor: Colors.primary + '30',
            }}
          />
          <CustomText
            variant="bold"
            size="xl"
            style={{ color: Colors.primary }}
          >
            {user?.name || 'Pengguna'}
          </CustomText>

          {/* Role Badge */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: getRoleColor() + '15',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 5,
              marginTop: 6,
            }}
          >
            <Ionicons
              name={isAdmin ? 'shield-checkmark' : 'person'}
              size={14}
              color={getRoleColor()}
              style={{ marginRight: 4 }}
            />
            <CustomText
              variant="medium"
              size="xs"
              style={{ color: getRoleColor() }}
            >
              {getRoleText()}
            </CustomText>
          </View>
        </View>

        {/* Informasi Akun */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            marginBottom: 20,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <CustomText
            variant="semiBold"
            size="lg"
            style={{ color: Colors.primary, marginBottom: 10 }}
          >
            Informasi Akun
          </CustomText>

          <View
            style={{
              borderTopWidth: 1,
              borderColor: '#F0F0F0',
              marginTop: 4,
              paddingTop: 10,
            }}
          >
            {[
              { label: 'Email', value: user?.email || '-' },
              { label: 'Role ID', value: user?.role_id || '-' },
            ].map((info) => (
              <View
                key={info.label}
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  marginBottom: 12,
                }}
              >
                <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                  {info.label}
                </CustomText>
                <CustomText variant="medium" size="sm" style={{ color: Colors.dark }}>
                  {info.value}
                </CustomText>
              </View>
            ))}

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                Status
              </CustomText>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: Colors.success,
                  }}
                />
                <CustomText variant="medium" size="sm" style={{ color: Colors.dark }}>
                  Aktif
                </CustomText>
              </View>
            </View>
          </View>
        </View>

        {/* Panel Admin */}
        {isAdmin && (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Alert.alert('Info', 'Panel admin akan segera tersedia')}
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 16,
              padding: 16,
              marginBottom: 20,
              shadowColor: '#000',
              shadowOpacity: 0.08,
              shadowRadius: 8,
              elevation: 2,
            }}
          >
            <CustomText
              variant="semiBold"
              size="lg"
              style={{ color: Colors.primary, marginBottom: 12 }}
            >
              Akses Administrator
            </CustomText>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: Colors.secondary,
                paddingVertical: 10,
                borderRadius: 10,
              }}
            >
              <Ionicons name="settings" color="#fff" size={18} style={{ marginRight: 6 }} />
              <CustomText variant="medium" size="sm" style={{ color: '#fff' }}>
                Buka Panel Admin
              </CustomText>
            </View>
          </TouchableOpacity>
        )}

        {/* Logout Card */}
        <View
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 16,
            padding: 16,
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 8,
            elevation: 2,
          }}
        >
          <CustomText
            variant="semiBold"
            size="lg"
            style={{ color: Colors.primary, marginBottom: 8 }}
          >
            Keluar Akun
          </CustomText>
          <CustomText
            variant="regular"
            size="sm"
            style={{
              color: Colors.gray,
              marginBottom: 16,
              lineHeight: 20,
            }}
          >
            Keluar dari akun Anda. Anda perlu login kembali untuk menggunakan
            aplikasi.
          </CustomText>
          <Button title="Logout" variant="danger" onPress={handleLogout} />
        </View>
      </Animated.View>
    </ScrollView>
  );
}