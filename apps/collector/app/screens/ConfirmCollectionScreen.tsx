import { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Material } from '../../services/material';
import { MaterialPrice } from '../../services/pricing';
import { createMaterialLot } from '../../services/collections';

type Props = {
  navigation: any;
  route: {
    params: {
      material: Material;
      weight: number;
      location: string;
      price: MaterialPrice;
      estimatedValue: number;
    };
  };
};

export default function ConfirmCollectionScreen({
  navigation,
  route,
}: Props) {
  const {
    material,
    weight,
    location,
    price,
    estimatedValue,
  } = route.params;

  const [submitting, setSubmitting] =
    useState(false);

  async function handleConfirm() {
    if (submitting) {
      return;
    }

    try {
      setSubmitting(true);

      const lot =
        await createMaterialLot({
          materialId: material.id,
          weight,
          weightUnit: material.default_unit,
          location,
          estimatedValue,
        });

      navigation.replace('CollectionSuccess', {
        lotCode: lot.lot_code,
        materialName: material.name,
        weight,
        estimatedValue,
      });
    } catch (error: any) {
      console.error(
        'Collection creation failed:',
        error
      );

      Alert.alert(
        'Collection Failed',
        error?.message ||
          'Unable to create the collection.'
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        Confirm Collection
      </Text>

      <Text style={styles.subtitle}>
        Please confirm that all details are correct.
      </Text>

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
          Location
        </Text>

        <Text style={styles.value}>
          {location}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Buying Price
        </Text>

        <Text style={styles.value}>
          ₹{Number(price.buying_price).toFixed(2)}
          /{price.unit}
        </Text>
      </View>

      <View style={styles.totalCard}>
        <Text style={styles.totalLabel}>
          Estimated Value
        </Text>

        <Text style={styles.totalValue}>
          ₹{estimatedValue.toFixed(2)}
        </Text>
      </View>

      <Pressable
        disabled={submitting}
        onPress={handleConfirm}
        style={[
          styles.button,
          submitting && styles.disabledButton,
        ]}
      >
        {submitting ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            Confirm Collection
          </Text>
        )}
      </Pressable>

      <Pressable
        disabled={submitting}
        onPress={() =>
          navigation.goBack()
        }
        style={styles.backButton}
      >
        <Text style={styles.backText}>
          Go Back
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

  totalCard: {
    borderWidth: 1,
    borderColor: '#218c54',
    borderRadius: 12,
    padding: 18,
    marginTop: 8,
    marginBottom: 20,
  },

  totalLabel: {
    fontSize: 14,
  },

  totalValue: {
    fontSize: 28,
    fontWeight: '700',
    marginTop: 5,
  },

  button: {
    backgroundColor: '#218c54',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  disabledButton: {
    backgroundColor: '#999',
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  backButton: {
    paddingVertical: 15,
    alignItems: 'center',
  },

  backText: {
    textDecorationLine: 'underline',
  },
});