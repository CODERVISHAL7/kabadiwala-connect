import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Material } from '../../services/material';
import {
  getLatestVerifiedPrice,
  MaterialPrice,
} from '../../services/pricing';

type Props = {
  navigation: any;
  route: {
    params: {
      material: Material;
      weight: number;
      location: string;
    };
  };
};

export default function CollectionReviewScreen({
  navigation,
  route,
}: Props) {
  const {
    material,
    weight,
    location,
  } = route.params;

  const [price, setPrice] =
    useState<MaterialPrice | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadPrice();
  }, []);

  async function loadPrice() {
    try {
      setLoading(true);
      setError(null);

      const latestPrice =
        await getLatestVerifiedPrice(material.id);

      setPrice(latestPrice);
    } catch (err: any) {
      console.error(
        'Failed to load price:',
        err
      );

      setError(
        err?.message ||
          'Unable to load material price.'
      );
    } finally {
      setLoading(false);
    }
  }

  const estimatedValue =
    price
      ? weight * Number(price.buying_price)
      : 0;

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading latest verified price...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Review Collection
      </Text>

      <Text style={styles.subtitle}>
        Please verify the details before
        submitting.
      </Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      <View style={styles.card}>
        <Text style={styles.label}>
          Material
        </Text>

        <Text style={styles.value}>
          {material.name}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Weight
        </Text>

        <Text style={styles.value}>
          {weight} {material.default_unit}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Collection Location
        </Text>

        <Text style={styles.value}>
          {location}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Latest Verified Buying Price
        </Text>

        {price ? (
          <>
            <Text style={styles.price}>
              ₹{Number(price.buying_price).toFixed(2)}
              /{price.unit}
            </Text>

            {price.location_name && (
              <Text style={styles.meta}>
                Price location: {price.location_name}
              </Text>
            )}

            <Text style={styles.meta}>
              Updated:{' '}
              {new Date(
                price.recorded_at
              ).toLocaleString()}
            </Text>
          </>
        ) : (
          <Text style={styles.noPrice}>
            No verified price available.
          </Text>
        )}
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Estimated Value
        </Text>

        <Text style={styles.totalValue}>
          {price
            ? `₹${estimatedValue.toFixed(2)}`
            : 'Not available'}
        </Text>
      </View>

      <Pressable
        disabled={!price}
        onPress={() => {
          navigation.navigate(
            'ConfirmCollection',
            {
              material,
              weight,
              location,
              price,
              estimatedValue,
            }
          );
        }}
        style={[
          styles.button,
          !price && styles.disabledButton,
        ]}
      >
        <Text style={styles.buttonText}>
          Confirm Details
        </Text>
      </Pressable>
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

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 6,
  },

  subtitle: {
    marginBottom: 22,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 16,
    marginBottom: 12,
  },

  label: {
    fontSize: 13,
    color: '#666',
  },

  value: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 5,
  },

  price: {
    fontSize: 22,
    fontWeight: '700',
    marginTop: 5,
  },

  meta: {
    marginTop: 6,
    color: '#666',
    fontSize: 12,
  },

  noPrice: {
    marginTop: 6,
    color: '#b00020',
  },

  totalCard: {
    borderRadius: 12,
    padding: 18,
    marginTop: 10,
    marginBottom: 20,
    backgroundColor: '#f4fbf7',
    borderWidth: 1,
    borderColor: '#218c54',
  },

  totalLabel: {
    fontSize: 14,
  },

  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
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

  button: {
    backgroundColor: '#218c54',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#aaa',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});