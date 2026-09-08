import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

export default function CollectionSuccessScreen({
  navigation,
  route,
}: any) {
  const {
    lotCode,
    materialName,
    weight,
    estimatedValue,
  } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.icon}>✓</Text>

      <Text style={styles.title}>
        Collection Successful
      </Text>

      <Text style={styles.subtitle}>
        The collection has been recorded successfully.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Lot Code
        </Text>

        <Text style={styles.lotCode}>
          {lotCode}
        </Text>

        <Text style={styles.label}>
          Material
        </Text>

        <Text style={styles.value}>
          {materialName}
        </Text>

        <Text style={styles.label}>
          Weight
        </Text>

        <Text style={styles.value}>
          {weight} kg
        </Text>

        <Text style={styles.label}>
          Estimated Value
        </Text>

        <Text style={styles.value}>
          ₹{Number(estimatedValue).toFixed(2)}
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate('NewCollection')
        }
      >
        <Text style={styles.primaryText}>
          + New Collection
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate('Dashboard')
        }
      >
        <Text style={styles.secondaryText}>
          Back to Dashboard
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },

  icon: {
    alignSelf: 'center',
    fontSize: 56,
    fontWeight: '700',
    marginBottom: 10,
  },

  title: {
    textAlign: 'center',
    fontSize: 26,
    fontWeight: '700',
  },

  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 25,
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    marginBottom: 20,
  },

  label: {
    fontSize: 13,
    color: '#666',
    marginTop: 10,
  },

  lotCode: {
    fontSize: 20,
    fontWeight: '700',
    marginTop: 4,
  },

  value: {
    fontSize: 17,
    fontWeight: '600',
    marginTop: 4,
  },

  primaryButton: {
    backgroundColor: '#218c54',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 10,
  },

  primaryText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    paddingVertical: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#218c54',
    alignItems: 'center',
  },

  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});