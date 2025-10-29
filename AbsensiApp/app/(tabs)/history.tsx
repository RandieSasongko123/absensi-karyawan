import { BlurView } from 'expo-blur';
import React, { useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Animated,
  FlatList,
  RefreshControl,
  TouchableOpacity,
  View,
} from 'react-native';
import CustomText from '../../components/CustomText'; // Import CustomText
import { Colors, globalStyles } from '../../styles/global';
import { absensiAPI } from '../../utils/api';

interface Absensi {
  id: number;
  check_in_time: string;
  check_out_time: string | null;
  latitude: string;
  longitude: string;
  working_duration_formatted?: string;
}

const FILTERS = [
  { key: 'today', label: 'Hari' },
  { key: 'week', label: 'Minggu' },
  { key: 'month', label: 'Bulan' },
  { key: 'all', label: 'Semua' },
];

export default function HistoryScreen() {
  const [absensis, setAbsensis] = useState<Absensi[]>([]);
  const [filteredAbsensis, setFilteredAbsensis] = useState<Absensi[]>([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Animations
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, [filteredAbsensis]);

  useEffect(() => {
    applyFilter(filter);
  }, [filter, absensis]);

  const loadHistory = async () => {
    try {
      setLoading(true);
      const response = await absensiAPI.getHistory();
      const data = response.data.data.data || [];
      setAbsensis(data);
    } catch (error) {
      console.error('Load history error:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadHistory();
  };

  const applyFilter = (type: string) => {
    const now = new Date();
    let filtered = absensis;

    if (type === 'today') {
      filtered = absensis.filter((item) => {
        const date = new Date(item.check_in_time);
        return (
          date.getDate() === now.getDate() &&
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    } else if (type === 'week') {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - now.getDay());
      filtered = absensis.filter((item) => {
        const date = new Date(item.check_in_time);
        return date >= startOfWeek && date <= now;
      });
    } else if (type === 'month') {
      filtered = absensis.filter((item) => {
        const date = new Date(item.check_in_time);
        return (
          date.getMonth() === now.getMonth() &&
          date.getFullYear() === now.getFullYear()
        );
      });
    }

    setFilteredAbsensis(filtered);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('id-ID', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
  };

  const getStatusColor = (checkOutTime: string | null) =>
    checkOutTime ? Colors.secondary : Colors.warning;

  // --- Animated Card ---
  const AnimatedCard = ({ item, index }: { item: Absensi; index: number }) => {
    const slideAnim = useRef(new Animated.Value(20)).current;
    const opacity = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
        Animated.timing(opacity, {
          toValue: 1,
          duration: 400,
          delay: index * 80,
          useNativeDriver: true,
        }),
      ]).start();
    }, []);

    return (
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity,
        }}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          style={{
            marginBottom: 12,
            borderRadius: 16,
            backgroundColor: '#fff',
            shadowColor: '#000',
            shadowOpacity: 0.05,
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 8,
            padding: 16,
          }}
        >
          <View style={[globalStyles.rowBetween, { marginBottom: 8 }]}>
            <CustomText variant="semiBold" size="base">
              {formatDate(item.check_in_time)}
            </CustomText>
            <View
              style={{
                backgroundColor: getStatusColor(item.check_out_time) + '20',
                paddingHorizontal: 10,
                paddingVertical: 4,
                borderRadius: 10,
              }}
            >
              <CustomText
                variant="medium"
                size="xs"
                style={{ color: getStatusColor(item.check_out_time) }}
              >
                {item.check_out_time ? 'Selesai' : 'Belum Check-out'}
              </CustomText>
            </View>
          </View>

          <View style={[globalStyles.rowBetween]}>
            <View>
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                Check-in
              </CustomText>
              <CustomText variant="semiBold" size="base">
                {formatTime(item.check_in_time)}
              </CustomText>
            </View>
            <View>
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                Check-out
              </CustomText>
              <CustomText variant="semiBold" size="base">
                {item.check_out_time ? formatTime(item.check_out_time) : '--:--'}
              </CustomText>
            </View>
          </View>

          {item.working_duration_formatted && (
            <View
              style={{
                marginTop: 8,
                borderTopWidth: 1,
                borderTopColor: '#eee',
                paddingTop: 8,
              }}
            >
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                Durasi Kerja:
              </CustomText>
              <CustomText variant="semiBold" size="sm" style={{ color: Colors.primary }}>
                {item.working_duration_formatted}
              </CustomText>
            </View>
          )}
        </TouchableOpacity>
      </Animated.View>
    );
  };

  if (loading) {
    return (
      <View style={[globalStyles.container, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <CustomText variant="regular" size="sm" style={{ marginTop: 16, color: Colors.gray }}>
          Memuat riwayat absensi...
        </CustomText>
      </View>
    );
  }

  return (
    <Animated.View
      style={{
        flex: 1,
        opacity: fadeAnim,
        transform: [
          {
            translateY: fadeAnim.interpolate({
              inputRange: [0, 1],
              outputRange: [10, 0],
            }),
          },
        ],
      }}
    >
      <FlatList
        style={{ backgroundColor: '#f8f9fb' }}
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        data={filteredAbsensis}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => <AnimatedCard item={item} index={index} />}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
            tintColor={Colors.primary}
          />
        }
        ListHeaderComponent={
          <>
            <CustomText variant="bold" size="2xl" style={{ marginBottom: 4 }}>
              Riwayat Absensi
            </CustomText>
            <CustomText variant="regular" size="sm" style={{ color: Colors.gray, marginBottom: 16 }}>
              Lihat catatan kehadiran Anda
            </CustomText>

            {/* Filter Section with Animated Press */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                backgroundColor: '#fff',
                borderRadius: 12,
                padding: 6,
                marginBottom: 16,
                shadowColor: '#000',
                shadowOpacity: 0.04,
                shadowRadius: 4,
                elevation: 2,
              }}
            >
              {FILTERS.map((f) => (
                <TouchableOpacity
                  key={f.key}
                  activeOpacity={0.8}
                  onPress={() => setFilter(f.key)}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    backgroundColor: filter === f.key ? Colors.primary : 'transparent',
                    borderRadius: 8,
                    transform: [{ scale: filter === f.key ? 1.05 : 1 }],
                  }}
                >
                  <CustomText
                    variant={filter === f.key ? "medium" : "regular"}
                    size="sm"
                    style={{
                      textAlign: 'center',
                      color: filter === f.key ? '#fff' : Colors.gray,
                    }}
                  >
                    {f.label}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </View>
          </>
        }
        ListFooterComponent={
          filteredAbsensis.length > 0 ? (
            <BlurView
              intensity={60}
              tint="light"
              style={{
                backgroundColor: '#FFFFFF',
                marginTop: 16,
                borderRadius: 20,
                overflow: 'hidden',
                padding: 16,
                shadowColor: '#000',
                shadowOpacity: 0.08,
                shadowRadius: 8,
              }}
            >
              <CustomText
                variant="bold"
                size="lg"
                style={{
                  marginBottom: 10,
                  color: Colors.primary,
                  textAlign: 'center',
                }}
              >
                Ringkasan Kehadiran
              </CustomText>
              <View style={[globalStyles.rowBetween]}>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                    Total Hari
                  </CustomText>
                  <CustomText variant="bold" size="xl" style={{ color: Colors.primary }}>
                    {filteredAbsensis.length}
                  </CustomText>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                    Selesai
                  </CustomText>
                  <CustomText variant="bold" size="xl" style={{ color: Colors.secondary }}>
                    {filteredAbsensis.filter((i) => i.check_out_time).length}
                  </CustomText>
                </View>
                <View style={{ alignItems: 'center', flex: 1 }}>
                  <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                    Pending
                  </CustomText>
                  <CustomText variant="bold" size="xl" style={{ color: Colors.warning }}>
                    {filteredAbsensis.filter((i) => !i.check_out_time).length}
                  </CustomText>
                </View>
              </View>
            </BlurView>
          ) : (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 50,
                backgroundColor: '#fff',
                borderRadius: 16,
                marginTop: 20,
              }}
            >
              <CustomText variant="regular" size="sm" style={{ color: Colors.gray }}>
                Belum ada data absensi
              </CustomText>
              <CustomText variant="regular" size="xs" style={{ color: Colors.gray, marginTop: 4 }}>
                Mulai dengan check-in pertama Anda
              </CustomText>
            </View>
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </Animated.View>
  );
}