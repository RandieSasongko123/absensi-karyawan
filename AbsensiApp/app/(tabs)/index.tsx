import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Alert,
  Animated,
  Easing,
  Image,
  RefreshControl,
  TouchableOpacity,
  View
} from 'react-native';
import CustomText from '../../components/CustomText'; // Import CustomText
import Loading from '../../components/Loading';
import { useAuth } from '../../context/AuthContext';
import { Colors } from '../../styles/global';
import { absensiAPI } from '../../utils/api';

let Location: any = null;
try {
  Location = require('expo-location');
} catch (error) {
  console.warn('expo-location not available');
}

export default function HomeScreen() {
  const { user, isAuthenticated } = useAuth();
  const [todayAbsensi, setTodayAbsensi] = useState<any>(null);
  const [summary, setSummary] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [location, setLocation] = useState<any>(null);
  const [locationError, setLocationError] = useState<string>('');

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (!isAuthenticated) router.replace('/(auth)/login');
  }, [isAuthenticated]);

  useEffect(() => {
    loadData();
    if (Location) {
      requestLocationPermission();
    } else {
      setLocationError('Modul lokasi tidak tersedia');
    }

    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 700,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const requestLocationPermission = async () => {
    if (!Location) {
      setLocationError('Modul lokasi tidak tersedia');
      return;
    }
    try {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Izin lokasi ditolak');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
      setLocationError('');
    } catch (error) {
      setLocationError('Gagal mendapatkan lokasi');
    }
  };

  const loadData = async () => {
    try {
      const [todayResponse, summaryResponse] = await Promise.all([
        absensiAPI.getToday(),
        absensiAPI.getSummary(),
      ]);
      setTodayAbsensi(todayResponse.data.data);
      setSummary(summaryResponse.data.data);
    } catch (error) {
      console.error('Load data error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadData();
  };

  const handleCheckIn = async () => {
    if (!location) {
      Alert.alert('Error', 'Lokasi tidak tersedia. Pastikan izin lokasi diberikan.');
      return;
    }

    try {
      const data = {
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      };
      await absensiAPI.checkIn(data);
      Alert.alert('Sukses', 'Check-in berhasil');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Check-in gagal');
    }
  };

  const handleCheckOut = async () => {
    if (!location) {
      Alert.alert('Error', 'Lokasi tidak tersedia. Pastikan izin lokasi diberikan.');
      return;
    }

    try {
      const data = {
        latitude: location.coords.latitude.toString(),
        longitude: location.coords.longitude.toString(),
      };
      await absensiAPI.checkOut(data);
      Alert.alert('Sukses', 'Check-out berhasil');
      loadData();
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Check-out gagal');
    }
  };

  if (loading) return <Loading />;

  const canCheckIn = !todayAbsensi;
  const canCheckOut = todayAbsensi && !todayAbsensi.check_out_time;

  // Animasi tombol scale
  const AnimatedButton = ({ title, onPress, disabled, variant = 'primary' }: any) => {
    const scale = useRef(new Animated.Value(1)).current;
    const pressIn = () =>
      Animated.spring(scale, { toValue: 0.95, useNativeDriver: true }).start();
    const pressOut = () =>
      Animated.spring(scale, { toValue: 1, friction: 3, useNativeDriver: true }).start();

    return (
      <Animated.View style={{ transform: [{ scale }] }}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPressIn={pressIn}
          onPressOut={pressOut}
          onPress={onPress}
          disabled={disabled}
          style={{
            backgroundColor:
              variant === 'secondary'
                ? Colors.secondary
                : variant === 'danger'
                ? Colors.danger
                : Colors.primary,
            opacity: disabled ? 0.5 : 1,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 10,
          }}
        >
          <CustomText 
            variant="medium" 
            size="sm"
            style={{ color: '#fff', textAlign: 'center' }}
          >
            {title}
          </CustomText>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <Animated.ScrollView
      style={{
        flex: 1,
        backgroundColor: '#F9FAFB',
        opacity: fadeAnim,
        transform: [{ translateY: slideAnim }],
      }}
      contentContainerStyle={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* SECTION 1: Profil + GPS */}
      <BlurView
        intensity={70}
        tint="light"
        style={{
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.08,
          shadowRadius: 6,
        }}
      >
        <View style={{ alignItems: 'center', marginBottom: 12 }}>
          <Image
            source={{
              uri: 'https://cdn-icons-png.flaticon.com/512/847/847969.png',
            }}
            style={{ width: 90, height: 90, borderRadius: 45, marginBottom: 8 }}
          />
          <CustomText variant="bold" size="xl" style={{ color: Colors.primary }}>
            {user?.name || '-'}
          </CustomText>
        </View>

        {/* GPS */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginVertical: 8,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons
              name={location ? 'location' : 'location-outline'}
              size={18}
              color={location ? Colors.success : Colors.warning}
            />
            <CustomText 
              variant="medium" 
              size="sm"
              style={{
                color: location ? Colors.success : Colors.warning,
              }}
            >
              {location ? 'GPS Aktif' : 'GPS Tidak Aktif'}
            </CustomText>
          </View>
          <AnimatedButton title="Aktifkan Ulang" variant="secondary" onPress={requestLocationPermission} />
        </View>

        <CustomText variant="regular" size="sm" style={{ color: Colors.gray, marginTop: 6, textAlign: 'center' }}>
          Terdaftar sejak:{' '}
          <CustomText variant="medium" size="sm" style={{ color: Colors.dark }}>
            {user?.created_at
              ? new Date(user.created_at).toLocaleDateString('id-ID')
              : '-'}
          </CustomText>
        </CustomText>
      </BlurView>

      {/* SECTION 2: Absensi Hari Ini */}
      <Animated.View
        style={{
          backgroundColor: '#fff',
          borderRadius: 16,
          padding: 16,
          marginBottom: 16,
          shadowColor: '#000',
          shadowOpacity: 0.05,
          shadowRadius: 8,
        }}
      >
        <CustomText variant="bold" size="xl" style={{ color: Colors.primary, textAlign: 'center', marginBottom: 12 }}>
          Absensi Hari Ini
        </CustomText>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', width: '100%' }}>
          {/* Check In */}
          <View style={{ alignItems: 'center' }}>
            <CustomText variant="semiBold" size="base" style={{ color: Colors.dark }}>
              Check In
            </CustomText>
            <CustomText variant="regular" size="base" style={{ color: Colors.success, marginVertical: 4 }}>
              {todayAbsensi?.check_in_time
                ? new Date(todayAbsensi.check_in_time).toLocaleTimeString()
                : '--:--'}
            </CustomText>
            <AnimatedButton title="Masuk" onPress={handleCheckIn} disabled={!canCheckIn || !location} />
          </View>

          {/* Check Out */}
          <View style={{ alignItems: 'center' }}>
            <CustomText variant="semiBold" size="base" style={{ color: Colors.dark }}>
              Check Out
            </CustomText>
            <CustomText variant="regular" size="base" style={{ color: Colors.danger, marginVertical: 4 }}>
              {todayAbsensi?.check_out_time
                ? new Date(todayAbsensi.check_out_time).toLocaleTimeString()
                : '--:--'}
            </CustomText>
            <AnimatedButton
              title="Pulang"
              variant="secondary"
              onPress={handleCheckOut}
              disabled={!canCheckOut || !location}
            />
          </View>
        </View>
      </Animated.View>

      {/* SECTION 3: Ringkasan Bulan Ini */}
      <BlurView
        intensity={70}
        tint="light"
        style={{
          borderRadius: 16,
          padding: 16,
          shadowColor: '#000',
          shadowOpacity: 0.06,
          shadowRadius: 6,
        }}
      >
        <CustomText variant="bold" size="lg" style={{ color: Colors.primary, marginBottom: 10 }}>
          Ringkasan Bulan Ini
        </CustomText>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginVertical: 8 }}>
          <View style={{ alignItems: 'center' }}>
            <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
              Hari Kerja
            </CustomText>
            <CustomText variant="bold" size="lg" style={{ color: Colors.primary }}>
              {summary?.summary?.work_days || 0}
            </CustomText>
          </View>
          <View style={{ alignItems: 'center' }}>
            <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
              Total Jam
            </CustomText>
            <CustomText variant="bold" size="lg" style={{ color: Colors.secondary }}>
              {summary?.summary?.total_hours || 0}
            </CustomText>
          </View>
          <View style={{ alignItems: 'center' }}>
            <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
              Rata-rata
            </CustomText>
            <CustomText variant="bold" size="lg" style={{ color: Colors.warning }}>
              {summary?.summary?.average_hours_per_day || 0}
            </CustomText>
          </View>
        </View>

        <AnimatedButton
          title="Lihat Riwayat Absensi"
          variant="secondary"
          onPress={() => router.push('/(tabs)/history')}
        />
      </BlurView>
    </Animated.ScrollView>
  );
}