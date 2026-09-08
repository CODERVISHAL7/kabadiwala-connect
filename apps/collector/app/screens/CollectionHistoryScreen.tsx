import { useCallback, useState } from 'react';
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
  CollectionHistoryItem,
  getMyCollections,
} from '../../services/collectionHistory';

export default function CollectionHistoryScreen({
  navigation,
}: any) {
  const [collections, setCollections] =
    useState<CollectionHistoryItem[]>([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const loadCollections = useCallback(
    async (isRefresh = false) => {
      try {
        if (isRefresh) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setError(null);

        const data = await getMyCollections();

        setCollections(data);
      } catch (err: any) {
        console.error(
          'Failed to load collections:',
          err
        );

        setError(
          err?.message ||
            'Unable to load collection history.'
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    []
  );

  useFocusEffect(
    useCallback(() => {
      loadCollections();
    }, [loadCollections])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading collections...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => loadCollections(true)}
        />
      }
    >
      <View style={styles.header}>
        <Text style={styles.title}>
          My Collections
        </Text>

        <Text style={styles.subtitle}>
          {collections.length} collection
          {collections.length === 1 ? '' : 's'}
        </Text>
      </View>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      {collections.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyTitle}>
            No collections yet
          </Text>

          <Text style={styles.emptyText}>
            Your completed collection records will
            appear here.
          </Text>

          <Pressable
            style={styles.button}
            onPress={() =>
              navigation.navigate('NewCollection')
            }
          >
            <Text style={styles.buttonText}>
              + New Collection
            </Text>
          </Pressable>
        </View>
      ) : (
        <View style={styles.list}>
          {collections.map((collection) => (
            <View
              key={collection.id}
              style={styles.card}
            >
              <View style={styles.cardHeader}>
                <Text style={styles.lotCode}>
                  {collection.lot_code}
                </Text>

                <View style={styles.status}>
                  <Text style={styles.statusText}>
                    {collection.status}
                  </Text>
                </View>
              </View>

              <Text style={styles.material}>
                {collection.material?.name ||
                  'Unknown Material'}
              </Text>

              {collection.material?.category && (
                <Text style={styles.category}>
                  {collection.material.category}
                  {collection.material.subcategory
                    ? ` • ${collection.material.subcategory}`
                    : ''}
                </Text>
              )}

              <View style={styles.row}>
                <View>
                  <Text style={styles.label}>
                    Weight
                  </Text>

                  <Text style={styles.value}>
                    {collection.approx_weight}{' '}
                    {collection.weight_unit}
                  </Text>
                </View>

                <View>
                  <Text style={styles.label}>
                    Estimated Value
                  </Text>

                  <Text style={styles.value}>
                    {collection.currency === 'INR'
                      ? '₹'
                      : `${collection.currency} `}
                    {Number(
                      collection.estimated_value
                    ).toFixed(2)}
                  </Text>
                </View>
              </View>

              {collection.collection_address && (
                <Text style={styles.location}>
                  📍 {collection.collection_address}
                </Text>
              )}

              <Text style={styles.date}>
                {new Date(
                  collection.created_at
                ).toLocaleString()}
              </Text>
            </View>
          ))}
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  loadingText: {
    marginTop: 10,
  },

  header: {
    marginBottom: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    marginTop: 4,
    color: '#666',
  },

  list: {
    gap: 12,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  lotCode: {
    fontSize: 15,
    fontWeight: '700',
  },

  status: {
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#eee',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  material: {
    fontSize: 19,
    fontWeight: '600',
    marginTop: 12,
  },

  category: {
    color: '#666',
    marginTop: 3,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 18,
  },

  label: {
    fontSize: 12,
    color: '#666',
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
    marginTop: 3,
  },

  location: {
    marginTop: 15,
    color: '#555',
  },

  date: {
    marginTop: 10,
    fontSize: 11,
    color: '#888',
  },

  empty: {
    alignItems: 'center',
    paddingVertical: 50,
  },

  emptyTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },

  button: {
    marginTop: 20,
    backgroundColor: '#218c54',
    paddingVertical: 14,
    paddingHorizontal: 25,
    borderRadius: 8,
  },

  buttonText: {
    color: '#fff',
    fontWeight: '700',
  },

  errorBox: {
    backgroundColor: '#ffe5e5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },

  errorText: {
    color: '#b00020',
  },
});