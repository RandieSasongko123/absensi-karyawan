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
      <CustomText variant="bold" size="2xl" style={styles.title}>
        Laporan Absensi
      </CustomText>

      {/* Filter Buttons */}
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
              <CustomText
                variant={filterBy === filter.key ? 'medium' : 'regular'}
                size="sm"
                style={{
                  color: filterBy === filter.key ? '#fff' : '#444',
                  textAlign: 'center',
                }}
              >
                {filter.label}
              </CustomText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Loading State */}
      {loading && <ActivityIndicator size="large" color="#3498db" style={{ marginTop: 20 }} />}

      {/* Error State */}
      {error && !loading && (
        <CustomText style={styles.errorText}>{error}</CustomText>
      )}

      {/* Summary */}
      {summary && !loading && (
        <View style={styles.summaryBox}>
          <CustomText variant="semiBold" size="lg" style={styles.summaryTitle}>
            Ringkasan
          </CustomText>
          {[
            { label: 'Total Data', value: summary.total_records },
            { label: 'Selesai Absensi', value: summary.completed_absensi },
            { label: 'Belum Selesai', value: summary.pending_absensi },
            { label: 'Filter Aktif', value: summary.filter_applied },
          ].map((item) => (
            <View key={item.label} style={styles.summaryItem}>
              <CustomText variant="regular" style={styles.label}>
                {item.label}:
              </CustomText>
              <CustomText variant="medium" style={styles.value}>
                {item.value}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      {/* Records List */}
      {!loading && records.length > 0 && (
        <View style={styles.listContainer}>
          <CustomText variant="semiBold" size="lg" style={styles.sectionTitle}>
            Daftar Absensi
          </CustomText>
          {records.map((item) => (
            <View key={item.id} style={styles.card}>
              <CustomText variant="bold" style={styles.name}>
                {item.employee?.name}
              </CustomText>
              <CustomText variant="regular" style={styles.text}>
                Check In: {item.check_in_time ? new Date(item.check_in_time).toLocaleTimeString() : '-'}
              </CustomText>
              <CustomText variant="regular" style={styles.text}>
                Check Out: {item.check_out_time ? new Date(item.check_out_time).toLocaleTimeString() : '-'}
              </CustomText>
              <CustomText variant="regular" style={styles.subText}>
                Tanggal: {new Date(item.created_at).toLocaleDateString()}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      {/* Empty State */}
      {!loading && records.length === 0 && !error && (
        <CustomText variant="regular" style={styles.emptyText}>
          Tidak ada data absensi ditemukan.
        </CustomText>
      )}

      {/* Refresh Button */}
      {!loading && (
        <TouchableOpacity style={styles.refreshButton} onPress={fetchReport}>
          <CustomText variant="medium" style={styles.refreshText}>
            🔄 Muat Ulang
          </CustomText>
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
