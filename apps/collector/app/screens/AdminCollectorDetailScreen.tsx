import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  getAdminCollectorDetail,
} from '../../services/admin';

export default function AdminCollectorDetailScreen({
  route,
  navigation,
}: any) {
  const { collectorId } = route.params;

  const [collector, setCollector] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadDetail = async () => {
    try {
      setError(null);

      const data =
        await getAdminCollectorDetail(
          collectorId
        );

      setCollector(data);
    } catch (err: any) {
      console.error(
        'Failed to load collector detail:',
        err
      );

      setError(
        err?.message ||
          'Failed to load collector details.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadDetail();
    }, [collectorId])
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
          Loading collector...
        </Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          {error}
        </Text>
      </View>
    );
  }

  if (!collector) {
    return (
      <View style={styles.center}>
        <Text>
          Collector not found.
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
      {/* Collector Header */}

      <View style={styles.headerCard}>
        <View style={styles.headerRow}>
          <Text style={styles.collectorCode}>
            {collector.collector_code}
          </Text>

          <View
            style={[
              styles.status,
              collector.is_active
                ? styles.active
                : styles.inactive,
            ]}
          >
            <Text style={styles.statusText}>
              {collector.is_active
                ? 'Active'
                : 'Inactive'}
            </Text>
          </View>
        </View>

        <Text style={styles.locationLabel}>
          General Location
        </Text>

        <Text style={styles.location}>
          {collector.general_location_text ||
            'Location not available'}
        </Text>

        <Text style={styles.joined}>
          Joined:{' '}
          {new Date(
            collector.created_at
          ).toLocaleDateString()}
        </Text>
      </View>

      {/* Statistics */}

      <View style={styles.statsCard}>
        <Text style={styles.sectionTitle}>
          Collection Statistics
        </Text>

        <View style={styles.statsRow}>
          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {collector.collections}
            </Text>

            <Text style={styles.statLabel}>
              Collections
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>
              {collector.lots
                .reduce(
                  (
                    total: number,
                    lot: any
                  ) =>
                    lot.weight_unit === 'kg'
                      ? total +
                        Number(
                          lot.approx_weight || 0
                        )
                      : total,
                  0
                )
                .toFixed(2)}{' '}
              kg
            </Text>

            <Text style={styles.statLabel}>
              Total Weight
            </Text>
          </View>

          <View style={styles.stat}>
            <Text style={styles.statValue}>
              ₹
              {collector.lots
                .reduce(
                  (
                    total: number,
                    lot: any
                  ) =>
                    total +
                    Number(
                      lot.estimated_value || 0
                    ),
                  0
                )
                .toFixed(2)}
            </Text>

            <Text style={styles.statLabel}>
              Estimated Value
            </Text>
          </View>
        </View>
      </View>

      {/* Collection History */}

      <Text style={styles.historyTitle}>
        Collection History
      </Text>

      {collector.lots.length === 0 ? (
        <View style={styles.empty}>
          <Text>
            No collections found.
          </Text>
        </View>
      ) : (
        collector.lots.map((lot: any) => (
          <Pressable
            key={lot.id}
            style={styles.lotCard}
            onPress={() =>
              navigation.navigate(
                'AdminCollectionDetail',
                {
                  lotId: lot.id,
                }
              )
            }
          >
            <View style={styles.lotHeader}>
              <Text style={styles.lotCode}>
                {lot.lot_code}
              </Text>

              <Text style={styles.lotStatus}>
                {lot.status}
              </Text>
            </View>

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

            <View style={styles.lotInfo}>
              <View>
                <Text style={styles.label}>
                  Weight
                </Text>

                <Text style={styles.value}>
                  {lot.approx_weight}{' '}
                  {lot.weight_unit}
                </Text>
              </View>

              <View>
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
            </View>

            {lot.collection_address && (
              <Text style={styles.address}>
                📍 {lot.collection_address}
              </Text>
            )}

            <Text style={styles.date}>
              {new Date(
                lot.created_at
              ).toLocaleString()}
            </Text>
          </Pressable>
        ))
      )}
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

  errorText: {
    color: '#b91c1c',
    textAlign: 'center',
  },

  headerCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  collectorCode: {
    fontSize: 22,
    fontWeight: '700',
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  active: {
    backgroundColor: '#d1fae5',
  },

  inactive: {
    backgroundColor: '#fee2e2',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '700',
  },

  locationLabel: {
    marginTop: 18,
    fontSize: 12,
    color: '#777',
  },

  location: {
    marginTop: 4,
    fontSize: 15,
  },

  joined: {
    marginTop: 14,
    fontSize: 12,
    color: '#888',
  },

  statsCard: {
    backgroundColor: '#fff',
    padding: 18,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 14,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 15,
  },

  statsRow: {
    flexDirection: 'row',
  },

  stat: {
    flex: 1,
    alignItems: 'center',
  },

  statValue: {
    fontSize: 15,
    fontWeight: '700',
  },

  statLabel: {
    marginTop: 4,
    fontSize: 11,
    color: '#777',
    textAlign: 'center',
  },

  historyTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 24,
    marginBottom: 12,
  },

  lotCard: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 12,
  },

  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  lotCode: {
    fontSize: 16,
    fontWeight: '700',
  },

  lotStatus: {
    fontSize: 12,
    color: '#666',
  },

  material: {
    marginTop: 10,
    fontSize: 16,
    fontWeight: '600',
  },

  category: {
    marginTop: 3,
    fontSize: 12,
    color: '#777',
  },

  lotInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 15,
  },

  label: {
    fontSize: 11,
    color: '#777',
  },

  value: {
    marginTop: 3,
    fontSize: 14,
    fontWeight: '600',
  },

  address: {
    marginTop: 14,
    fontSize: 12,
  },

  date: {
    marginTop: 10,
    fontSize: 11,
    color: '#888',
  },

  empty: {
    backgroundColor: '#fff',
    padding: 25,
    borderRadius: 10,
    alignItems: 'center',
  },
});