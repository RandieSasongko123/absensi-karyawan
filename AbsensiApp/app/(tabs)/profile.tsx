import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity,
  View
} from 'react-native';
import Button from '../../components/Button';
import CustomText from '../../components/CustomText';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/global';

export default function ProfileScreen() {
  const { user, logout, isAdmin } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const logoutModalScale = useRef(new Animated.Value(0.8)).current;
  const logoutModalOpacity = useRef(new Animated.Value(0)).current;
  const adminModalScale = useRef(new Animated.Value(0.8)).current;
  const adminModalOpacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      useNativeDriver: true,
    }).start();
  }, []);

  const openLogoutModal = () => {
    setShowLogoutModal(true);
    Animated.parallel([
      Animated.spring(logoutModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoutModalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeLogoutModal = () => {
    Animated.parallel([
      Animated.spring(logoutModalScale, {
        toValue: 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(logoutModalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowLogoutModal(false);
    });
  };

  const openAdminModal = () => {
    setShowAdminModal(true);
    Animated.parallel([
      Animated.spring(adminModalScale, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(adminModalOpacity, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const closeAdminModal = () => {
    Animated.parallel([
      Animated.spring(adminModalScale, {
        toValue: 0.8,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
      Animated.timing(adminModalOpacity, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start(() => {
      setShowAdminModal(false);
    });
  };

  const handleLogout = () => {
    closeLogoutModal();
    setTimeout(() => {
      logout();
    }, 300);
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
            onPress={openAdminModal}
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
          <Button 
            title="Logout" 
            variant="danger" 
            onPress={openLogoutModal}
          />
        </View>
      </Animated.View>

      {/* Modal Konfirmasi Logout */}
      <Modal
        visible={showLogoutModal}
        transparent
        animationType="none"
        onRequestClose={closeLogoutModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          activeOpacity={1}
          onPressOut={closeLogoutModal}
        >
          <Animated.View
            style={{
              transform: [{ scale: logoutModalScale }],
              opacity: logoutModalOpacity,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Icon Warning */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.danger + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="log-out-outline" size={32} color={Colors.danger} />
                </View>
              </View>

              {/* Judul */}
              <CustomText
                variant="bold"
                size="xl"
                style={{
                  textAlign: 'center',
                  color: Colors.dark,
                  marginBottom: 8,
                }}
              >
                Konfirmasi Logout
              </CustomText>

              {/* Pesan */}
              <CustomText
                variant="regular"
                size="base"
                style={{
                  textAlign: 'center',
                  color: Colors.gray,
                  marginBottom: 24,
                  lineHeight: 20,
                }}
              >
                Apakah Anda yakin ingin logout dari akun Anda?
              </CustomText>

              {/* Tombol Aksi */}
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <Button
                  title="Batal"
                  variant="secondary"
                  onPress={closeLogoutModal}
                  style={{ flex: 1 }}
                />
                <Button
                  title="Ya, Logout"
                  variant="danger"
                  onPress={handleLogout}
                  style={{ flex: 1 }}
                />
              </View>
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      {/* Modal Info Panel Admin */}
      <Modal
        visible={showAdminModal}
        transparent
        animationType="none"
        onRequestClose={closeAdminModal}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            justifyContent: 'center',
            alignItems: 'center',
            padding: 20,
          }}
          activeOpacity={1}
          onPressOut={closeAdminModal}
        >
          <Animated.View
            style={{
              transform: [{ scale: adminModalScale }],
              opacity: adminModalOpacity,
              width: '100%',
              maxWidth: 320,
            }}
          >
            <TouchableOpacity
              activeOpacity={1}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 24,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.25,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              {/* Icon Info */}
              <View style={{ alignItems: 'center', marginBottom: 16 }}>
                <View
                  style={{
                    width: 60,
                    height: 60,
                    borderRadius: 30,
                    backgroundColor: Colors.secondary + '15',
                    justifyContent: 'center',
                    alignItems: 'center',
                    marginBottom: 12,
                  }}
                >
                  <Ionicons name="information-circle" size={32} color={Colors.secondary} />
                </View>
              </View>

              {/* Judul */}
              <CustomText
                variant="bold"
                size="xl"
                style={{
                  textAlign: 'center',
                  color: Colors.dark,
                  marginBottom: 8,
                }}
              >
                Panel Admin
              </CustomText>

              {/* Pesan */}
              <CustomText
                variant="regular"
                size="base"
                style={{
                  textAlign: 'center',
                  color: Colors.gray,
                  marginBottom: 24,
                  lineHeight: 20,
                }}
              >
                Panel admin akan segera tersedia. Fitur ini sedang dalam pengembangan untuk memberikan akses kontrol yang lebih lengkap.
              </CustomText>

              {/* Tombol OK */}
              <Button
                title="Mengerti"
                variant="secondary"
                onPress={closeAdminModal}
                style={{ width: '100%' }}
              />
            </TouchableOpacity>
          </Animated.View>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
}