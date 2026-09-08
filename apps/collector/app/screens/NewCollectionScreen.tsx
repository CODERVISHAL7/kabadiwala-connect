import { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {
  getActiveMaterials,
  Material,
} from '../../services/material';

export default function NewCollectionScreen({
  navigation,
}: any) {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selectedMaterial, setSelectedMaterial] =
    useState<Material | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadMaterials();
  }, []);

  async function loadMaterials() {
    try {
      setLoading(true);
      setError(null);

      const data = await getActiveMaterials();

      setMaterials(data);
    } catch (err: any) {
      console.error('Failed to load materials:', err);

      setError(
        err?.message || 'Unable to load materials.'
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
          Loading materials...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      <Text style={styles.title}>
        New Collection
      </Text>

      <Text style={styles.subtitle}>
        Select the material you want to collect.
      </Text>

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      <Text style={styles.sectionTitle}>
        Select Material
      </Text>

      <View style={styles.materialList}>
        {materials.map((material) => {
          const selected =
            selectedMaterial?.id === material.id;

          return (
            <Pressable
              key={material.id}
              onPress={() =>
                setSelectedMaterial(material)
              }
              style={[
                styles.materialCard,
                selected &&
                  styles.selectedMaterialCard,
              ]}
            >
              <View style={styles.materialInfo}>
                <Text style={styles.materialName}>
                  {material.name}
                </Text>

                <Text style={styles.materialCategory}>
                  {material.category}
                  {material.subcategory
                    ? ` • ${material.subcategory}`
                    : ''}
                </Text>

                <Text style={styles.materialUnit}>
                  Unit: {material.default_unit}
                </Text>
              </View>

              {material.is_hazardous && (
                <View style={styles.hazardBadge}>
                  <Text style={styles.hazardText}>
                    Hazardous
                  </Text>
                </View>
              )}
            </Pressable>
          );
        })}
      </View>

      {selectedMaterial && (
        <View style={styles.selectedBox}>
          <Text style={styles.selectedLabel}>
            Selected Material
          </Text>

          <Text style={styles.selectedName}>
            {selectedMaterial.name}
          </Text>

          {selectedMaterial.is_hazardous && (
            <Text style={styles.warning}>
              ⚠️ This material is hazardous.
              Handle it according to safety
              procedures.
            </Text>
          )}
        </View>
      )}

      <Pressable
        disabled={!selectedMaterial}
        onPress={() => {
          navigation.navigate('CollectionDetails', {
            material: selectedMaterial,
          });
        }}
        style={[
          styles.button,
          !selectedMaterial &&
            styles.disabledButton,
        ]}
      >
        <Text style={styles.buttonText}>
          Continue
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
    fontSize: 15,
    marginBottom: 24,
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },

  materialList: {
    gap: 10,
  },

  materialCard: {
    borderWidth: 1,
    borderColor: '#d5d5d5',
    borderRadius: 10,
    padding: 15,
    backgroundColor: '#fff',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  selectedMaterialCard: {
    borderColor: '#218c54',
    borderWidth: 2,
  },

  materialInfo: {
    flex: 1,
  },

  materialName: {
    fontSize: 17,
    fontWeight: '600',
  },

  materialCategory: {
    marginTop: 5,
    fontSize: 13,
    color: '#666',
  },

  materialUnit: {
    marginTop: 4,
    fontSize: 13,
    color: '#666',
  },

  hazardBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#fff0d6',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },

  hazardText: {
    fontSize: 11,
    fontWeight: '700',
  },

  selectedBox: {
    marginTop: 20,
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#218c54',
    backgroundColor: '#f4fbf7',
  },

  selectedLabel: {
    fontSize: 12,
    color: '#666',
  },

  selectedName: {
    marginTop: 4,
    fontSize: 18,
    fontWeight: '700',
  },

  warning: {
    marginTop: 10,
    lineHeight: 20,
  },

  errorBox: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffe5e5',
    marginBottom: 15,
  },

  errorText: {
    color: '#b00020',
  },

  button: {
    marginTop: 25,
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
    fontWeight: '700',
    fontSize: 16,
  },
});