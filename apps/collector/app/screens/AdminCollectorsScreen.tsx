import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { 
  getAdminCollectors,
  setUserActive,
 } from '../../services/admin';

type Collector = {
  id: string;
  profile_id: string;
  collector_code: string;
  general_location_text: string | null;
  created_at: string;
  updated_at: string;
  is_active: boolean;
  collections: number;
  totalWeight: number;
  totalEstimatedValue: number;
};

export default function AdminCollectorsScreen({
  navigation,
}: any) {
  const [collectors, setCollectors] =
    useState<Collector[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadCollectors = async () => {
    try {
      setError(null);

      const data =
        await getAdminCollectors();

      setCollectors(data as Collector[]);
    } catch (err: any) {
      console.error(
        'Failed to load collectors:',
        err
      );

      setError(
        err?.message ||
          'Failed to load collectors.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadCollectors();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadCollectors();
  };

  const handleToggleStatus = async (
  collector: Collector
) => {
  const newStatus = !collector.is_active;

  try {
    setError(null);

    console.log(
      'UPDATING STATUS:',
      collector.collector_code,
      '→',
      newStatus
    );

    await setUserActive(
      collector.profile_id,
      newStatus
    );

    console.log(
      'STATUS UPDATE SUCCESS:',
      collector.collector_code
    );

    // Update UI immediately
    setCollectors((current) =>
      current.map((item) =>
        item.id === collector.id
          ? {
              ...item,
              is_active: newStatus,
            }
          : item
      )
    );
  } catch (err: any) {
    console.error(
      'STATUS UPDATE FAILED:',
      err
    );

    setError(
      err?.message ||
        'Failed to update collector status.'
    );
  }
};

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading collectors...
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
      <Text style={styles.title}>
        Collector Management
      </Text>

      <Text style={styles.subtitle}>
        {collectors.length} collector
        {collectors.length === 1 ? '' : 's'}
      </Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {collectors.map((collector) => (
       <Pressable
          key={collector.id}
          style={styles.card}
          onPress={() =>
            navigation.navigate(
              'AdminCollectorDetail',
              {
                collectorId: collector.id,
              }
            )
          }
        >
          <View style={styles.cardHeader}>
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
                {collector.totalWeight.toFixed(2)} kg
              </Text>

              <Text style={styles.statLabel}>
                Total Weight
              </Text>
            </View>

            <View style={styles.stat}>
              <Text style={styles.statValue}>
                ₹
                {collector.totalEstimatedValue.toFixed(
                  2
                )}
              </Text>

              <Text style={styles.statLabel}>
                Estimated Value
              </Text>
            </View>
          </View>

          <Text style={styles.date}>
            Joined:{' '}
            {new Date(
              collector.created_at
            ).toLocaleDateString()}
          </Text>

          <View style={styles.actionRow}>
          <Pressable
  style={[
    styles.statusButton,
    collector.is_active
      ? styles.deactivateButton
      : styles.activateButton,
  ]}
  onPress={() =>
    handleToggleStatus(collector)
  }
>
  <Text
    style={[
      styles.statusButtonText,
      collector.is_active
        ? styles.deactivateButtonText
        : styles.activateButtonText,
    ]}
  >
    {collector.is_active
      ? 'Deactivate Collector'
      : 'Activate Collector'}
  </Text>
</Pressable>
        </View>
        </Pressable>
      ))}

      {collectors.length === 0 && !error && (
        <View style={styles.empty}>
          <Text>
            No collectors found.
          </Text>
        </View>
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
    backgroundColor: '#f5f5f5',
  },

  loadingText: {
    marginTop: 10,
  },

  title: {
    fontSize: 24,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 5,
    marginBottom: 16,
    color: '#666',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 16,
    marginBottom: 14,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  collectorCode: {
    fontSize: 19,
    fontWeight: '700',
  },

  status: {
    paddingHorizontal: 10,
    paddingVertical: 5,
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
    fontWeight: '600',
  },

  locationLabel: {
    marginTop: 16,
    fontSize: 12,
    color: '#777',
  },

  location: {
    marginTop: 3,
    fontSize: 14,
  },

  statsRow: {
    flexDirection: 'row',
    marginTop: 18,
    paddingTop: 14,
    borderTopWidth: 1,
    borderTopColor: '#eee',
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

  date: {
    marginTop: 15,
    fontSize: 11,
    color: '#888',
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    padding: 12,
    borderRadius: 8,
    marginBottom: 14,
  },

  errorText: {
    color: '#b91c1c',
  },

  empty: {
    padding: 30,
    alignItems: 'center',
  },

  actionRow: {
  marginTop: 15,
},

statusButton: {
  paddingVertical: 12,
  borderRadius: 8,
  alignItems: 'center',
  justifyContent: 'center',
},

statusButtonText: {
  fontSize: 14,
  fontWeight: '700',
},

activateButton: {
  backgroundColor: '#208f52',
},

activateButtonText: {
  color: '#fff',
},

deactivateButton: {
  backgroundColor: '#fee2e2',
},

deactivateButtonText: {
  color: '#b91c1c',
},
});