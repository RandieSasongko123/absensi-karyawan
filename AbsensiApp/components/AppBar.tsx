import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Alert, Modal, TouchableOpacity, View } from 'react-native';
import CustomText from '../components/CustomText'; // Import CustomText
import { useAuth } from '../context/AuthContext';
import { Colors } from '../styles/global';

const AppBar = () => {
  const { user, logout, isAdmin } = useAuth();
  const [showMenu, setShowMenu] = useState(false);

  const handleLogout = () => {
    Alert.alert('Logout', 'Yakin ingin keluar?', [
      { text: 'Batal', style: 'cancel' },
      { 
        text: 'Logout', 
        style: 'destructive',
        onPress: async () => {
          await logout();
          setShowMenu(false);
        },
      },
    ]);
  };

  const roleText = isAdmin ? 'Admin' : 'Karyawan';
  const roleColor = isAdmin ? Colors.danger : Colors.secondary;

  return (
    <>
      <View
        style={{
          backgroundColor: Colors.primary,
          paddingTop: 50,
          paddingBottom: 14,
          paddingHorizontal: 20,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo dan Judul */}
        <CustomText variant="bold" size="xl" style={{ color: Colors.white }}>
          AbsensiApp
        </CustomText>

        {/* Tombol User */}
        {/* <TouchableOpacity
          onPress={() => setShowMenu(true)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: Colors.white + '22',
            paddingHorizontal: 12,
            paddingVertical: 6,
            borderRadius: 20,
          }}
        >
          <Ionicons name="person-circle" size={22} color={Colors.white} />
          <CustomText
            variant="medium"
            size="sm"
            style={{
              marginLeft: 8,
              color: Colors.white,
            }}
          >
            {user?.name?.split(' ')[0] || 'User'}
          </CustomText>
          <Ionicons name="chevron-down" size={16} color={Colors.white} style={{ marginLeft: 4 }} />
        </TouchableOpacity> */}
      </View>

      {/* Modal Menu */}
      <Modal
        visible={showMenu}
        transparent
        animationType="slide"
        onRequestClose={() => setShowMenu(false)}
      >
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.4)',
            justifyContent: 'flex-end',
          }}
          activeOpacity={1}
          onPressOut={() => setShowMenu(false)}
        >
          <View
            style={{
              backgroundColor: Colors.white,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              paddingVertical: 24,
              paddingHorizontal: 20,
            }}
          >
            {/* Header User */}
            <View style={{ alignItems: 'center', marginBottom: 16 }}>
              <Ionicons
                name="person-circle-outline"
                size={64}
                color={Colors.primary}
              />
              <CustomText variant="bold" size="lg" style={{ color: Colors.dark }}>
                {user?.name || 'User'}
              </CustomText>
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                {user?.email}
              </CustomText>
              <View
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: roleColor,
                    marginRight: 6,
                  }}
                />
                <CustomText variant="medium" size="xs" style={{ color: roleColor }}>
                  {roleText}
                </CustomText>
              </View>
            </View>

            {/* Tombol Aksi */}
            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                // navigate ke profil
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <Ionicons name="person-outline" size={20} color={Colors.primary} />
              <CustomText variant="regular" size="base" style={{ marginLeft: 12, color: Colors.dark }}>
                Profil Saya
              </CustomText>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => {
                setShowMenu(false);
                // navigate ke pengaturan
              }}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 12,
              }}
            >
              <Ionicons name="settings-outline" size={20} color={Colors.primary} />
              <CustomText variant="regular" size="base" style={{ marginLeft: 12, color: Colors.dark }}>
                Pengaturan
              </CustomText>
            </TouchableOpacity>

            {isAdmin && (
              <TouchableOpacity
                onPress={() => {
                  setShowMenu(false);
                  // navigate ke admin panel
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                }}
              >
                <Ionicons name="shield-checkmark-outline" size={20} color={Colors.danger} />
                <CustomText variant="regular" size="base" style={{ marginLeft: 12, color: Colors.dark }}>
                  Admin Panel
                </CustomText>
              </TouchableOpacity>
            )}

            <TouchableOpacity
              onPress={handleLogout}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                paddingVertical: 14,
                marginTop: 10,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={Colors.danger} />
              <CustomText
                variant="semiBold"
                size="base"
                style={{
                  marginLeft: 12,
                  color: Colors.danger,
                }}
              >
                Logout
              </CustomText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </>
  );
};

export default AppBar;