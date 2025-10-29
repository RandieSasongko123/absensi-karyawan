import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, TouchableOpacity, View } from 'react-native';
import CustomText from '../../components/CustomText';
import { adminAPI, handleApiError } from '../../utils/api';

type FilterType = 'today' | 'week' | 'month' | 'year';

interface FilterOption {
  key: FilterType;
  label: string;
}

const FILTERS: FilterOption[] = [
  { key: 'today', label: 'Hari' },
  { key: 'week', label: 'Minggu' },
  { key: 'month', label: 'Bulan' },
  { key: 'year', label: 'Tahun' },
];

export default function ReportScreen() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<any>(null);
  const [records, setRecords] = useState<any[]>([]);
  const [filterBy, setFilterBy] = useState<FilterType>('today');
  const [error, setError] = useState<string | null>(null);

  const fetchReport = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await adminAPI.getReport({ filter_by: filterBy });
      const data = response.data.data;

      setSummary(data.summary);
      setRecords(data.absensis.data);
    } catch (err) {
      setError(handleApiError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReport();
  }, [filterBy]);

  return (
    <ScrollView style={styles.container}>
      {/* 🟦 Title */}
      <View style={{ flexDirection: 'row' }}>
        {/* <Ionicons name="bar-chart-outline" size={24} color="#3498db" style={{ marginRight: 8 }} /> */}
        <CustomText variant="bold" size="2xl" style={styles.title}>
          Laporan Absensi
        </CustomText>
      </View>

      {/* 🟨 Filter Buttons */}
      <View style={styles.filterContainer}>
        <View style={styles.filterButtonsContainer}>
          {FILTERS.map((filter) => (
            <TouchableOpacity
              key={filter.key}
              onPress={() => setFilterBy(filter.key)}
              activeOpacity={0.8}
              style={[
                styles.filterButton,
                {
                  backgroundColor: filterBy === filter.key ? '#3498db' : '#f0f0f0',
                  borderColor: filterBy === filter.key ? '#2980b9' : '#ddd',
                },
              ]}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                <Ionicons
                  name={
                    filter.key === 'today'
                      ? 'sunny-outline'
                      : filter.key === 'week'
                        ? 'calendar-outline'
                        : filter.key === 'month'
                          ? 'calendar-number-outline'
                          : 'trending-up-outline'
                  }
                  size={12} // 🔽 Ukuran ikon lebih kecil
                  color={filterBy === filter.key ? '#fff' : '#444'}
                  style={{ marginRight: 3 }} // 🔽 Jarak sedikit saja
                />
                <CustomText
                  variant={filterBy === filter.key ? 'medium' : 'regular'}
                  size="xs" // 🔽 Ubah ukuran teks ke extra small
                  style={{
                    color: filterBy === filter.key ? '#fff' : '#444',
                    fontSize: 11, // 🔽 Pastikan ukuran kecil tapi tetap terbaca
                  }}
                >
                  {filter.label}
                </CustomText>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* 🌀 Loading */}
      {loading && <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />}

      {/* ❌ Error */}
      {error && !loading && (
        <View style={{ alignItems: 'center', marginTop: 20 }}>
          <Ionicons name="warning-outline" size={40} color="#ff5555" style={{ marginBottom: 8 }} />
          <CustomText style={styles.errorText}>{error}</CustomText>
        </View>
      )}

      {/* 📋 Summary */}
      {summary && !loading && (
        <View style={styles.summaryBox}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: 12 }}>
            <Ionicons name="analytics-outline" size={22} color="#2c3e50" style={{ marginRight: 6 }} />
            <CustomText variant="semiBold" size="lg" style={styles.summaryTitle}>
              Ringkasan
            </CustomText>
          </View>

          {[
            { label: 'Total Data', value: summary.total_records, icon: 'albums-outline' },
            { label: 'Selesai Absensi', value: summary.completed_absensi, icon: 'checkmark-circle-outline' },
            { label: 'Belum Selesai', value: summary.pending_absensi, icon: 'time-outline' },
            { label: 'Filter Aktif', value: summary.filter_applied, icon: 'funnel-outline' },
          ].map((item) => (
            <View key={item.label} style={styles.summaryItem}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={18} color="#3498db" />
                <CustomText variant="regular" style={styles.label}>
                  {item.label}
                </CustomText>
              </View>
              <CustomText variant="medium" style={styles.value}>
                {item.value}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      {/* 📄 Records List */}
      {!loading && records.length > 0 && (
        <View style={styles.listContainer}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Ionicons name="list-outline" size={20} color="#2c3e50" style={{ marginRight: 6 }} />
            <CustomText variant="semiBold" size="lg" style={styles.sectionTitle}>
              Daftar Absensi
            </CustomText>
          </View>

          {records.map((item) => (
            <View key={item.id} style={styles.card}>
              <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                <Ionicons name="person-circle-outline" size={20} color="#2c3e50" style={{ marginRight: 6 }} />
                <CustomText variant="bold" style={styles.name}>
                  {item.employee?.name}
                </CustomText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="log-in-outline" size={16} color="#27ae60" style={{ marginRight: 4 }} />
                <CustomText variant="regular" style={styles.text}>
                  Check In:{' '}
                  {item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString() : '-'}
                </CustomText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Ionicons name="log-out-outline" size={16} color="#e74c3c" style={{ marginRight: 4 }} />
                <CustomText variant="regular" style={styles.text}>
                  Check Out:{' '}
                  {item.check_out_time ? new Date(item.check_out_time).toLocaleTimeString() : '-'}
                </CustomText>
              </View>

              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4 }}>
                <Ionicons name="calendar-outline" size={14} color="#777" style={{ marginRight: 4 }} />
                <CustomText variant="regular" style={styles.subText}>
                  Tanggal: {new Date(item.created_at).toLocaleDateString()}
                </CustomText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* 🚫 Empty State */}
      {!loading && records.length === 0 && !error && (
        <View style={{ alignItems: 'center', marginTop: 40 }}>
          <Ionicons name="folder-open-outline" size={60} color="#bbb" style={{ marginBottom: 8 }} />
          <CustomText variant="regular" style={styles.emptyText}>
            Tidak ada data absensi ditemukan.
          </CustomText>
        </View>
      )}

      {/* 🔄 Refresh Button */}
      {!loading && (
        <TouchableOpacity style={styles.refreshButton} onPress={fetchReport}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="refresh-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
            <CustomText variant="medium" style={styles.refreshText}>
              Muat Ulang
            </CustomText>
          </View>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6F8',
    padding: 16,
  },
  title: {
    marginBottom: 16,
    textAlign: 'center',
    color: '#2c3e50',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  filterButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 2,
  },
  summaryTitle: {
    marginBottom: 10,
    textAlign: 'center',
    color: '#2c3e50',
  },
  summaryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  label: {
    color: '#555',
  },
  value: {
    color: '#111',
  },
  listContainer: {
    marginBottom: 20,
  },
  sectionTitle: {
    marginBottom: 10,
    color: '#2c3e50',
  },
  card: {
    backgroundColor: '#FFFFFF',
    padding: 14,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    elevation: 1,
  },
  name: {
    fontSize: 16,
    marginBottom: 4,
    color: '#2c3e50',
  },
  text: {
    fontSize: 14,
    marginBottom: 2,
    color: '#444',
  },
  subText: {
    fontSize: 12,
    color: '#777',
    marginTop: 4,
  },
  errorText: {
    color: '#ff5555',
    textAlign: 'center',
    marginTop: 20,
    backgroundColor: '#ffeaea',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#f5c6cb',
  },
  emptyText: {
    color: '#777',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  refreshButton: {
    backgroundColor: '#3498db',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 30,
    elevation: 2,
  },
  refreshText: {
    color: '#fff',
  },
});
