import React from 'react';

import {
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type Props = {
  navigation: any;
  route: {
    params: {
      transactionCode: string;
      quotedPrice: number;
    };
  };
};

export default function RecyclerTransactionSuccessScreen({
  navigation,
  route,
}: Props) {
  const {
    transactionCode,
    quotedPrice,
  } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.icon}>✓</Text>
      </View>

      <Text style={styles.title}>
        Transaction Confirmed!
      </Text>

      <Text style={styles.subtitle}>
        You have successfully confirmed this
        transaction.
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Transaction ID
        </Text>

        <Text style={styles.transactionCode}>
          {transactionCode}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.label}>
          Quoted Price
        </Text>

        <Text style={styles.price}>
          ₹{Number(quotedPrice).toLocaleString('en-IN')}
        </Text>

        <View style={styles.divider} />

        <Text style={styles.status}>
          ✓ CONFIRMED
        </Text>
      </View>

      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          navigation.replace('RecyclerTransactions')
        }
      >
        <Text style={styles.primaryButtonText}>
          View My Transactions
        </Text>
      </Pressable>

      <Pressable
        style={styles.secondaryButton}
        onPress={() =>
          navigation.navigate('RecyclerDashboard')
        }
      >
        <Text style={styles.secondaryButtonText}>
          Back to Dashboard
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },

  iconCircle: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#16a34a',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },

  icon: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
  },

  title: {
    fontSize: 26,
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: 10,
  },

  subtitle: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
    lineHeight: 23,
    marginBottom: 24,
  },

  card: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
  },

  label: {
    fontSize: 13,
    color: '#777',
    marginBottom: 6,
  },

  transactionCode: {
    fontSize: 17,
    fontWeight: '700',
  },

  price: {
    fontSize: 24,
    fontWeight: '800',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 16,
  },

  status: {
    color: '#16a34a',
    fontSize: 15,
    fontWeight: '800',
    textAlign: 'center',
  },

  primaryButton: {
    width: '100%',
    backgroundColor: '#111827',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  primaryButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  secondaryButton: {
    width: '100%',
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});