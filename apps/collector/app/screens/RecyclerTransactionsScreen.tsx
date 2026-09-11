import React, {
  useCallback,
  useState,
} from 'react';

import {
  ActivityIndicator,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  TextInput,
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  confirmTransaction,
  getMyRecyclerTransactions,
  startHandover,
} from '../../services/recyclerTransactions';


type Transaction = {
  id: string;
  transaction_code: string;
  lot_id: string;
  collector_id: string;
  facility_id: string;
  offer_id: string;
  quoted_price: number;
  final_price: number | null;
  final_weight: number | null;
  currency: string;
  status: string;
  sold_at: string | null;
  created_at: string;

  material_lots:
    | {
        lot_code: string;
        approx_weight: number;
        weight_unit: string;
      }
    | null;

  recycler_facilities:
    | {
        facility_code: string;
        name: string;
        address: string | null;
      }
    | null;
};


export default function RecyclerTransactionsScreen() {
  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [processingId, setProcessingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);


  const loadTransactions = async () => {
    try {
      setError(null);

      const data =
        await getMyRecyclerTransactions();

      setTransactions(
        data as Transaction[]
      );
    } catch (err: any) {
      console.error(
        'Recycler transactions error:',
        err
      );

      setError(
        err?.message ||
          'Failed to load transactions.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      loadTransactions();
    }, [])
  );


  const handleRefresh = () => {
    setRefreshing(true);
    loadTransactions();
  };


  const handleConfirm = async (
    transactionId: string
  ) => {
    try {
      setError(null);
      setProcessingId(transactionId);

      await confirmTransaction(
        transactionId
      );

      await loadTransactions();
    } catch (err: any) {
      console.error(
        'Confirm transaction failed:',
        err
      );

      setError(
        err?.message ||
          'Unable to confirm transaction.'
      );
    } finally {
      setProcessingId(null);
    }
  };

  const handleStartHandover = async (
  transactionId: string
) => {
  try {
    setError(null);
    setProcessingId(transactionId);

    await startHandover(transactionId);

    await loadTransactions();
  } catch (err: any) {
    console.error(
      'Start handover failed:',
      err
    );

    setError(
      err?.message ||
        'Unable to start handover.'
    );
  } finally {
    setProcessingId(null);
  }
};


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading transactions...
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
          onRefresh={handleRefresh}
        />
      }
    >

      <Text style={styles.title}>
        My Transactions
      </Text>

      <Text style={styles.subtitle}>
        Transactions created from your accepted offers
      </Text>


      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}


      {!error &&
        transactions.length === 0 && (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyTitle}>
              No transactions yet
            </Text>

            <Text style={styles.emptyText}>
              Transactions will appear here
              after collectors accept your offers.
            </Text>
          </View>
        )}


      {transactions.map((transaction) => {

        const isProcessing =
          processingId === transaction.id;

        const displayPrice =
          transaction.final_price ??
          transaction.quoted_price;

        const displayWeight =
          transaction.final_weight ??
          transaction.material_lots
            ?.approx_weight;


        return (
          <View
            key={transaction.id}
            style={styles.card}
          >

            {/* HEADER */}

            <View style={styles.headerRow}>

              <View style={styles.headerInfo}>

                <Text style={styles.transactionCode}>
                  {transaction.transaction_code}
                </Text>

                <Text style={styles.date}>
                  {new Date(
                    transaction.created_at
                  ).toLocaleDateString('en-IN')}
                </Text>

              </View>


              <View
                style={[
                  styles.statusBadge,
                  transaction.status ===
                    'confirmed' &&
                    styles.confirmedBadge,
                ]}
              >
                <Text style={styles.statusText}>
                  {transaction.status
                    .replace(/_/g, ' ')
                    .toUpperCase()}
                </Text>
              </View>

            </View>


            <View style={styles.divider} />


            {/* FACILITY */}

            <Text style={styles.label}>
              Facility
            </Text>

            <Text style={styles.facilityName}>
              {transaction.recycler_facilities
                ?.name ||
                'Recycler Facility'}
            </Text>

            <Text style={styles.facilityCode}>
              {transaction.recycler_facilities
                ?.facility_code || ''}
            </Text>


            {/* MATERIAL */}

            <View style={styles.infoRow}>

              <View style={styles.infoItem}>
                <Text style={styles.label}>
                  Material Lot
                </Text>

                <Text style={styles.value}>
                  {transaction.material_lots
                    ?.lot_code ||
                    'Material Lot'}
                </Text>
              </View>


              <View style={styles.infoItem}>
                <Text style={styles.label}>
                  Weight
                </Text>

                <Text style={styles.value}>
                  {displayWeight ?? 0}{' '}
                  {transaction.material_lots
                    ?.weight_unit || 'kg'}
                </Text>
              </View>

            </View>


            {/* PRICE */}

            <View style={styles.priceBox}>

              <Text style={styles.label}>
                Quoted Price
              </Text>

              <Text style={styles.price}>
                {transaction.currency === 'INR'
                  ? '₹'
                  : transaction.currency}{' '}
                {Number(
                  displayPrice
                ).toLocaleString('en-IN')}
              </Text>

            </View>


            {transaction.recycler_facilities
              ?.address && (
              <Text style={styles.address}>
                📍{' '}
                {transaction.recycler_facilities.address}
              </Text>
            )}


            {/* CONFIRM */}

            {transaction.status ===
              'pending' && (

              <Pressable
                style={[
                  styles.confirmButton,
                  isProcessing &&
                    styles.disabledButton,
                ]}
                disabled={isProcessing}
                onPress={() =>
                  handleConfirm(
                    transaction.id
                  )
                }
              >

                {isProcessing ? (
                  <ActivityIndicator
                    color="#fff"
                    size="small"
                  />
                ) : (
                  <Text
                    style={
                      styles.confirmButtonText
                    }
                  >
                    ✓ Confirm Transaction
                  </Text>
                )}

              </Pressable>
            )}

            {transaction.status ===
                'confirmed' && (

                <Pressable
                    style={[
                    styles.confirmButton,
                    isProcessing &&
                        styles.disabledButton,
                    ]}
                    disabled={isProcessing}
                    onPress={() =>
                    handleStartHandover(
                        transaction.id
                    )
                    }
                >

                    {isProcessing ? (
                    <ActivityIndicator
                        color="#fff"
                        size="small"
                    />
                    ) : (
                    <Text
                        style={styles.confirmButtonText}
                    >
                        🚚 Start Handover
                    </Text>
                    )}

                </Pressable>
            )}

            {transaction.status ===
                'handover_pending' && (

                <View style={styles.handoverBox}>

                    <Text style={styles.handoverTitle}>
                    Confirm Material Handover
                    </Text>

                    <Text style={styles.handoverDescription}>
                    Enter the actual weight and final settlement amount.
                    </Text>

                    <Text style={styles.inputLabel}>
                    Final Weight (kg)
                    </Text>

                    <TextInput
                    style={styles.input}
                    value={
                        handoverTransactionId === transaction.id
                        ? finalWeight
                        : ''
                    }
                    onChangeText={setFinalWeight}
                    placeholder="e.g. 11.8"
                    keyboardType="decimal-pad"
                    />

                    <Text style={styles.inputLabel}>
                    Final Price (₹)
                    </Text>

                    <TextInput
                    style={styles.input}
                    value={
                        handoverTransactionId === transaction.id
                        ? finalPrice
                        : ''
                    }
                    onChangeText={setFinalPrice}
                    placeholder="e.g. 708"
                    keyboardType="decimal-pad"
                    />

                    {handoverTransactionId !== transaction.id ? (

                    <Pressable
                        style={styles.handoverButton}
                        onPress={() => {
                        setHandoverTransactionId(
                            transaction.id
                        );

                        setFinalWeight(
                            transaction.material_lots
                            ?.approx_weight
                            ?.toString() || ''
                        );

                        setFinalPrice(
                            transaction.quoted_price
                            ?.toString() || ''
                        );
                        }}
                    >
                        <Text style={styles.handoverButtonText}>
                        ✓ Confirm Handover
                        </Text>
                    </Pressable>

                    ) : (

                    <Pressable
                        style={[
                        styles.handoverButton,
                        processingHandover &&
                            styles.disabledButton,
                        ]}
                        disabled={processingHandover}
                        onPress={handleCompleteHandover}
                    >
                        {processingHandover ? (
                        <ActivityIndicator
                            color="#fff"
                            size="small"
                        />
                        ) : (
                        <Text style={styles.handoverButtonText}>
                            ✓ Complete Handover
                        </Text>
                        )}
                    </Pressable>

                    )}

                </View>
                )}

          </View>
        );
      })}

    </ScrollView>
  );
}


const styles = StyleSheet.create({

  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 20,
    paddingBottom: 40,
  },

  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  loadingText: {
    marginTop: 12,
    color: '#666',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginTop: 10,
  },

  subtitle: {
    color: '#666',
    marginTop: 6,
    marginBottom: 20,
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 10,
    padding: 14,
    marginBottom: 16,
  },

  errorText: {
    color: '#b91c1c',
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
  },

  emptyText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerInfo: {
    flex: 1,
  },

  transactionCode: {
    fontSize: 17,
    fontWeight: '700',
  },

  date: {
    marginTop: 4,
    color: '#777',
    fontSize: 12,
  },

  statusBadge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  confirmedBadge: {
    backgroundColor: '#dcfce7',
  },

  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  label: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },

  facilityName: {
    fontSize: 16,
    fontWeight: '700',
  },

  facilityCode: {
    color: '#777',
    fontSize: 12,
    marginTop: 3,
  },

  infoRow: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 18,
  },

  infoItem: {
    flex: 1,
  },

  value: {
    fontSize: 14,
    fontWeight: '600',
  },

  priceBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 12,
    marginTop: 18,
  },

  price: {
    fontSize: 21,
    fontWeight: '700',
  },

  address: {
    color: '#666',
    fontSize: 13,
    marginTop: 12,
  },

  confirmButton: {
    backgroundColor: '#168a4b',
    borderRadius: 8,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 18,
  },

  confirmButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },

  disabledButton: {
    opacity: 0.6,
  },

  handoverBox: {
  backgroundColor: '#f8fafc',
  borderRadius: 10,
  padding: 15,
  marginTop: 18,
  borderWidth: 1,
  borderColor: '#dbe3ea',
},

handoverTitle: {
  fontSize: 16,
  fontWeight: '700',
  marginBottom: 5,
},

handoverDescription: {
  color: '#666',
  fontSize: 13,
  marginBottom: 15,
},

inputLabel: {
  fontSize: 12,
  color: '#666',
  marginBottom: 5,
  marginTop: 8,
},

input: {
  borderWidth: 1,
  borderColor: '#ccc',
  borderRadius: 8,
  backgroundColor: '#fff',
  paddingHorizontal: 12,
  paddingVertical: 11,
  fontSize: 15,
},

handoverButton: {
  backgroundColor: '#168a4b',
  borderRadius: 8,
  paddingVertical: 14,
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: 15,
},

handoverButtonText: {
  color: '#fff',
  fontSize: 15,
  fontWeight: '700',
},

});