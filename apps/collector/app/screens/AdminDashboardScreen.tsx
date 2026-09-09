import React, { useCallback, useState } from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { getAdminStats } from '../../services/admin';


type AdminStats = {
  collectors: number;
  recyclers: number;
  collections: number;
  totalWeight: number;
  totalEstimatedValue: number;
};

export default function AdminDashboardScreen({ navigation }: any) {  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadStats = async () => {
    try {
      setError(null);

      const data = await getAdminStats();

      setStats(data);
    } catch (err: any) {
      console.error(
        'Failed to load admin stats:',
        err
      );

      setError(
        err?.message ||
          'Failed to load dashboard statistics.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadStats();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadStats();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Kabadiwala Connect
        </Text>

        <Text style={styles.subtitle}>
          Welcome, Admin 🛡️
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {stats && (
        <>
          <View style={styles.grid}>
            <StatCard
              value={stats.collectors}
              label="Active Collectors"
            />

            <StatCard
              value={stats.recyclers}
              label="Active Recyclers"
            />

            <StatCard
              value={stats.collections}
              label="Total Collections"
            />

            <StatCard
              value={`${stats.totalWeight.toFixed(2)} kg`}
              label="Total Material"
            />
          </View>

          <View style={styles.valueCard}>
            <Text style={styles.valueLabel}>
              Total Estimated Value
            </Text>

            <Text style={styles.valueAmount}>
              ₹{stats.totalEstimatedValue.toFixed(2)}
            </Text>
          </View>

          <View style={styles.actionContainer}>
          <Text
              style={styles.actionButton}
              onPress={() =>
              navigation.navigate('AdminCollectors')
            }
          >
            👷 Manage Collectors
          </Text>
        </View>
        </>
      )}
    </ScrollView>
  );
}

function StatCard({
  value,
  label,
}: {
  value: number | string;
  label: string;
}) {
  return (
    <View style={styles.statCard}>
      <Text style={styles.statValue}>
        {value}
      </Text>

      <Text style={styles.statLabel}>
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 16,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 10,
    fontSize: 15,
  },

  header: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 6,
    fontSize: 16,
  },

  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },

  statCard: {
    width: '48%',
    minHeight: 120,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },

  statValue: {
    fontSize: 26,
    fontWeight: '700',
  },

  statLabel: {
    marginTop: 8,
    fontSize: 13,
    textAlign: 'center',
    color: '#666',
  },

  valueCard: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 20,
    marginTop: 4,
    alignItems: 'center',
  },

  valueLabel: {
    fontSize: 14,
    color: '#666',
  },

  valueAmount: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 8,
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },

  errorText: {
    color: '#b91c1c',
  },
  actionContainer: {
  marginTop: 20,
  marginHorizontal: 16,
  marginBottom: 30,
},

actionButton: {
  backgroundColor: '#208f52',
  color: '#fff',
  textAlign: 'center',
  paddingVertical: 14,
  borderRadius: 8,
  fontSize: 16,
  fontWeight: '700',
},
});