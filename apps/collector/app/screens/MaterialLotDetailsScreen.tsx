import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type MaterialLot = {
  id: string;
  collector_id: string;
  approx_weight: number;
  weight_unit: string;
  estimated_value: number;
  status: string;
};

type Props = {
  route: {
    params: {
      lot: MaterialLot;
    };
  };
  navigation: any;
};

export default function MaterialLotDetailsScreen({
  route,
  navigation,
}: Props) {
  const { lot } = route.params;

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>
          Material Lot Details
        </Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {lot.status}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Material Information
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>
          <Text style={styles.value}>
            {lot.approx_weight} {lot.weight_unit}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Estimated Value</Text>
          <Text style={styles.value}>
            ₹{Number(lot.estimated_value).toFixed(2)}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Lot ID</Text>
          <Text style={styles.lotId}>
            {lot.id}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>Collector ID</Text>
          <Text style={styles.lotId}>
            {lot.collector_id}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Make an Offer
        </Text>

        <Text style={styles.description}>
          You can make an offer for this available
          material lot.
        </Text>

        <Pressable
          style={styles.offerButton}
          onPress={() =>
            navigation.navigate('MakeOffer', {
              lot,
            })
          }
        >
          <Text style={styles.offerButtonText}>
            Make Offer
          </Text>
        </Pressable>
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
    padding: 24,
    alignItems: 'center',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  badge: {
    marginTop: 10,
    backgroundColor: '#dff5e7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 14,
  },

  badgeText: {
    fontWeight: '700',
    textTransform: 'capitalize',
  },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 20,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 14,
  },

  description: {
    color: '#666',
    lineHeight: 20,
    marginBottom: 18,
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
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

  offerButton: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  offerButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});