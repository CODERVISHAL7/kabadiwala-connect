import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { getAvailableMaterialLots } from '../../services/recycler';

type MaterialLot = {
  id: string;
  collector_id: string;
  approx_weight: number;
  weight_unit: string;
  estimated_value: number;
  status: string;
};

export default function RecyclerDashboardScreen({
  navigation,
}: any) {
   const [lots, setLots] = useState<MaterialLot[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadLots = async () => {
    try {
      setError(null);

      const data = await getAvailableMaterialLots();

      setLots(data);
    } catch (err: any) {
      console.error('Recycler dashboard error:', err);

      setError(
        err?.message || 'Failed to load available material.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadLots();
    }, [])
  );

  const handleRefresh = () => {
    setRefreshing(true);
    loadLots();
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={handleRefresh}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          Kabadiwala Connect
        </Text>

        <Text style={styles.subtitle}>
          Recycler Dashboard ♻️
        </Text>
      </View>

      <View style={styles.statsCard}>
        <Text style={styles.statsNumber}>
          {lots.length}
        </Text>

        <Text style={styles.statsLabel}>
          Available Material Lots
        </Text>
      </View>

      <Pressable
        style={styles.transactionsButton}
        onPress={() =>
          navigation.navigate(
            'RecyclerTransactions'
          )
        }
      >
        <Text style={styles.transactionsButtonText}>
          📋 My Transactions
        </Text>
      </Pressable>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>
          Available Material
        </Text>

        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="large" />

            <Text style={styles.loadingText}>
              Loading available material...
            </Text>
          </View>
        ) : error ? (
          <View style={styles.messageCard}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        ) : lots.length === 0 ? (
          <View style={styles.messageCard}>
            <Text style={styles.emptyTitle}>
              No material available
            </Text>

            <Text style={styles.emptyText}>
              Check again later for new material lots.
            </Text>
          </View>
        ) : (
          lots.map((lot) => (
            <Pressable
              key={lot.id}
              style={styles.lotCard}
              onPress={() =>
                navigation.navigate('MaterialLotDetails', {
                  lot,
                })
              }
            >
              <View style={styles.lotHeader}>
                <Text style={styles.lotTitle}>
                  Material Lot
                </Text>

                <View style={styles.availableBadge}>
                  <Text style={styles.availableText}>
                    Available
                  </Text>
                </View>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Weight
                </Text>

                <Text style={styles.value}>
                  {lot.approx_weight} {lot.weight_unit}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Estimated Value
                </Text>

                <Text style={styles.value}>
                  ₹{Number(lot.estimated_value).toFixed(2)}
                </Text>
              </View>

              <View style={styles.row}>
                <Text style={styles.label}>
                  Lot ID
                </Text>

                <Text style={styles.lotId}>
                  {lot.id}
                </Text>
              </View>
            </Pressable>
          ))
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

  header: {
    padding: 28,
    alignItems: 'center',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 8,
    fontSize: 17,
    color: '#555',
  },

  statsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  statsNumber: {
    fontSize: 32,
    fontWeight: '700',
  },

  statsLabel: {
    marginTop: 6,
    color: '#555',
  },

  section: {
    padding: 20,
  },

  sectionTitle: {
    fontSize: 21,
    fontWeight: '700',
    marginBottom: 14,
  },

  lotCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 18,
    marginBottom: 14,
  },

  lotHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },

  lotTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  availableBadge: {
    backgroundColor: '#dff5e7',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },

  availableText: {
    fontSize: 12,
    fontWeight: '700',
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },

  label: {
    color: '#666',
  },

  value: {
    fontWeight: '600',
  },

  lotId: {
    maxWidth: '55%',
    fontSize: 11,
    color: '#555',
    textAlign: 'right',
  },

  center: {
    alignItems: 'center',
    padding: 30,
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  messageCard: {
    backgroundColor: '#fff',
    padding: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 18,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },

  errorText: {
    color: '#c00',
    textAlign: 'center',
  },

  transactionsButton: {
  marginHorizontal: 20,
  marginTop: 16,
  marginBottom: 4,
  borderWidth: 1,
  borderColor: '#168a4b',
  borderRadius: 8,
  paddingVertical: 13,
  alignItems: 'center',
},

transactionsButtonText: {
  color: '#168a4b',
  fontSize: 15,
  fontWeight: '700',
},
});