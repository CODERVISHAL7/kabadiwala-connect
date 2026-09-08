import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getCollectionById,
} from '../../services/collectionHistory';

export default function CollectionDetailScreen({
  route,
}: any) {
  const { collectionId } = route.params;

  const [collection, setCollection] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadCollection();
  }, [collectionId]);

  async function loadCollection() {
    try {
      setLoading(true);
      setError(null);

      const data =
        await getCollectionById(collectionId);

      setCollection(data);
    } catch (err: any) {
      console.error(
        'Failed to load collection:',
        err
      );

      setError(
        err?.message ||
          'Unable to load collection.'
      );
    } finally {
      setLoading(false);
    }
  }

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

  if (error || !collection) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to Load Collection
        </Text>

        <Text style={styles.errorText}>
          {error || 'Collection not found.'}
        </Text>
      </View>
    );
  }

  const material = collection.material;

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <View style={styles.header}>
        <Text style={styles.lotLabel}>
          Lot Code
        </Text>

        <Text style={styles.lotCode}>
          {collection.lot_code}
        </Text>

        <View style={styles.status}>
          <Text style={styles.statusText}>
            {collection.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Material
        </Text>

        <Text style={styles.materialName}>
          {material?.name || 'Unknown Material'}
        </Text>

        {material?.category && (
          <Text style={styles.secondary}>
            Category: {material.category}
          </Text>
        )}

        {material?.subcategory && (
          <Text style={styles.secondary}>
            Subcategory: {material.subcategory}
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Collection Information
        </Text>

        <InfoRow
          label="Weight"
          value={`${collection.approx_weight} ${collection.weight_unit}`}
        />

        <InfoRow
          label="Estimated Value"
          value={`${
            collection.currency === 'INR'
              ? '₹'
              : `${collection.currency} `
          }${Number(
            collection.estimated_value
          ).toFixed(2)}`}
        />

        {collection.condition && (
          <InfoRow
            label="Condition"
            value={collection.condition}
          />
        )}

        {collection.source_type && (
          <InfoRow
            label="Source Type"
            value={collection.source_type}
          />
        )}
      </View>

      {collection.description && (
        <View style={styles.card}>
          <Text style={styles.sectionTitle}>
            Description
          </Text>

          <Text style={styles.description}>
            {collection.description}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Location
        </Text>

        {collection.collection_address ? (
          <Text style={styles.location}>
            📍 {collection.collection_address}
          </Text>
        ) : (
          <Text style={styles.secondary}>
            No address recorded.
          </Text>
        )}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Record Information
        </Text>

        <InfoRow
          label="Created"
          value={new Date(
            collection.created_at
          ).toLocaleString()}
        />

        <InfoRow
          label="Last Updated"
          value={new Date(
            collection.updated_at
          ).toLocaleString()}
        />
      </View>
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
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
    padding: 25,
  },

  loadingText: {
    marginTop: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  errorText: {
    marginTop: 8,
    textAlign: 'center',
    color: '#666',
  },

  header: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  lotLabel: {
    fontSize: 12,
    color: '#666',
  },

  lotCode: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 5,
  },

  status: {
    alignSelf: 'flex-start',
    marginTop: 12,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
    backgroundColor: '#eee',
  },

  statusText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'capitalize',
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 14,
  },

  materialName: {
    fontSize: 20,
    fontWeight: '600',
  },

  secondary: {
    marginTop: 6,
    color: '#666',
  },

  infoRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
  },

  description: {
    lineHeight: 22,
  },

  location: {
    fontSize: 15,
    lineHeight: 22,
  },
});