import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  getAdminCollectionDetail,
} from '../../services/admin';

export default function AdminCollectionDetailScreen({
  route,
}: any) {
  const { lotId } = route.params;

  const [lot, setLot] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] =
    useState<string | null>(null);

  const loadDetail = async () => {
    try {
      setError(null);

      const data =
        await getAdminCollectionDetail(lotId);

      setLot(data);
    } catch (err: any) {
      console.error(
        'Failed to load collection detail:',
        err
      );

      setError(
        err?.message ||
          'Failed to load collection.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [lotId])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadDetail();
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading collection...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>
          {error}
        </Text>
      </View>
    );
  }

  if (!lot) {
    return (
      <View style={styles.center}>
        <Text>
          Collection not found.
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
      <View style={styles.card}>
        <View style={styles.header}>
          <Text style={styles.lotCode}>
            {lot.lot_code}
          </Text>

          <View style={styles.status}>
            <Text style={styles.statusText}>
              {lot.status}
            </Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>
          Material
        </Text>

        <Text style={styles.material}>
          {lot.material?.name ||
            'Unknown Material'}
        </Text>

        {lot.material?.category && (
          <Text style={styles.category}>
            {lot.material.category}

            {lot.material.subcategory
              ? ` • ${lot.material.subcategory}`
              : ''}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Collection Information
        </Text>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Weight
          </Text>

          <Text style={styles.value}>
            {lot.approx_weight}{' '}
            {lot.weight_unit}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Estimated Value
          </Text>

          <Text style={styles.value}>
            {lot.currency === 'INR'
              ? '₹'
              : `${lot.currency} `}
            {Number(
              lot.estimated_value || 0
            ).toFixed(2)}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.label}>
            Status
          </Text>

          <Text style={styles.value}>
            {lot.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Location
        </Text>

        <Text style={styles.location}>
          📍{' '}
          {lot.collection_address ||
            'Location not available'}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Dates
        </Text>

        <Text style={styles.date}>
          Created:{' '}
          {new Date(
            lot.created_at
          ).toLocaleString()}
        </Text>

        {lot.updated_at && (
          <Text style={styles.date}>
            Updated:{' '}
            {new Date(
              lot.updated_at
            ).toLocaleString()}
          </Text>
        )}
      </View>
    </ScrollView>
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
    padding: 25,
  },

  loadingText: {
    marginTop: 10,
  },

  error: {
    color: '#b91c1c',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 14,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  lotCode: {
    fontSize: 21,
    fontWeight: '700',
  },

  status: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#e5e7eb',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 12,
  },

  material: {
    fontSize: 18,
    fontWeight: '600',
  },

  category: {
    marginTop: 4,
    color: '#777',
  },

  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  label: {
    color: '#777',
  },

  value: {
    fontWeight: '600',
  },

  location: {
    fontSize: 15,
    lineHeight: 22,
  },

  date: {
    fontSize: 13,
    color: '#777',
    marginBottom: 8,
  },
});