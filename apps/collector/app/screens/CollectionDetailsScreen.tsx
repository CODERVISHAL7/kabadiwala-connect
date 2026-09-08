import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { Material } from '../../services/material';

type Props = {
  navigation: any;
  route: {
    params: {
      material: Material;
    };
  };
};

export default function CollectionDetailsScreen({
  navigation,
  route,
}: Props) {
  const { material } = route.params;

  const [weight, setWeight] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState<string | null>(null);

  function handleContinue() {
    setError(null);

    const numericWeight = Number(weight);

    if (!weight.trim()) {
      setError('Please enter the material weight.');
      return;
    }

    if (
      !Number.isFinite(numericWeight) ||
      numericWeight <= 0
    ) {
      setError('Weight must be greater than 0.');
      return;
    }

    if (numericWeight > 100000) {
      setError('Please enter a realistic weight.');
      return;
    }

    if (!location.trim()) {
      setError('Please enter the collection location.');
      return;
    }

    navigation.navigate('CollectionReview', {
      material,
      weight: numericWeight,
      location: location.trim(),
    });
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Collection Details
        </Text>

        <Text style={styles.subtitle}>
          Enter the details for this collection.
        </Text>

        <View style={styles.materialCard}>
          <Text style={styles.label}>
            Selected Material
          </Text>

          <Text style={styles.materialName}>
            {material.name}
          </Text>

          <Text style={styles.meta}>
            {material.category}
            {material.subcategory
              ? ` • ${material.subcategory}`
              : ''}
          </Text>

          <Text style={styles.meta}>
            Unit: {material.default_unit}
          </Text>

          {material.is_hazardous && (
            <View style={styles.warningBox}>
              <Text style={styles.warningText}>
                ⚠️ Hazardous material — follow
                applicable handling procedures.
              </Text>
            </View>
          )}
        </View>

        <Text style={styles.fieldLabel}>
          Weight
        </Text>

        <View style={styles.weightRow}>
          <TextInput
            value={weight}
            onChangeText={setWeight}
            placeholder="Enter weight"
            keyboardType="decimal-pad"
            style={styles.weightInput}
          />

          <View style={styles.unitBox}>
            <Text style={styles.unitText}>
              {material.default_unit}
            </Text>
          </View>
        </View>

        <Text style={styles.fieldLabel}>
          Collection Location
        </Text>

        <TextInput
          value={location}
          onChangeText={setLocation}
          placeholder="e.g. Sector 15, Noida"
          style={styles.input}
        />

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <Pressable
          onPress={handleContinue}
          style={styles.button}
        >
          <Text style={styles.buttonText}>
            Review Collection
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },

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
    fontSize: 15,
    marginBottom: 22,
  },

  materialCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: '#666',
  },

  materialName: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 5,
  },

  meta: {
    marginTop: 5,
    color: '#666',
  },

  warningBox: {
    marginTop: 12,
    padding: 10,
    borderRadius: 8,
    backgroundColor: '#fff3cd',
  },

  warningText: {
    lineHeight: 20,
  },

  fieldLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },

  weightRow: {
    flexDirection: 'row',
    marginBottom: 20,
  },

  weightInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
  },

  unitBox: {
    justifyContent: 'center',
    paddingHorizontal: 18,
    marginLeft: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
  },

  unitText: {
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    fontSize: 16,
    marginBottom: 18,
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

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});