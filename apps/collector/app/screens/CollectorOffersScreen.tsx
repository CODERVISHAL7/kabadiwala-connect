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
  Text,
  View,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import {
  acceptOffer,
  getIncomingOffers,
  rejectOffer,
} from '../../services/offers';


type Offer = {
  id: string;
  lot_id: string;
  facility_id: string;
  offered_price: number;
  price_unit: string;
  pickup_available: boolean;
  status: string;
  valid_until: string | null;
  created_at: string;
  updated_at: string;

  material_lots:
    | {
        lot_code: string;
        approx_weight: number;
        weight_unit: string;
        description: string | null;
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


export default function CollectorOffersScreen() {
  const [offers, setOffers] =
    useState<Offer[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [refreshing, setRefreshing] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const [processingOfferId, setProcessingOfferId] =
  useState<string | null>(null);

  const handleAccept = async (
  offerId: string
) => {
  try {
    setError(null);
    setProcessingOfferId(offerId);

    await acceptOffer(offerId);

    await loadOffers();
  } catch (err: any) {
    console.error(
      'Accept offer failed:',
      err
    );

    setError(
      err?.message ||
        'Unable to accept offer.'
    );
  } finally {
    setProcessingOfferId(null);
  }
};


const handleReject = async (
  offerId: string
) => {
  try {
    setError(null);
    setProcessingOfferId(offerId);

    await rejectOffer(offerId);

    await loadOffers();
  } catch (err: any) {
    console.error(
      'Reject offer failed:',
      err
    );

    setError(
      err?.message ||
        'Unable to reject offer.'
    );
  } finally {
    setProcessingOfferId(null);
  }
};


  const loadOffers = async () => {
    try {
      setError(null);

      const data =
        await getIncomingOffers();

      setOffers(data as Offer[]);
    } catch (err: any) {
      console.error(
        'Failed to load incoming offers:',
        err
      );

      setError(
        err?.message ||
          'Failed to load incoming offers.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };


  useFocusEffect(
    useCallback(() => {
      loadOffers();
    }, [])
  );


  const onRefresh = () => {
    setRefreshing(true);
    loadOffers();
  };


  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading offers...
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
          onRefresh={onRefresh}
        />
      }
    >

      <Text style={styles.title}>
        Incoming Offers
      </Text>

      <Text style={styles.subtitle}>
        Offers received for your collected materials
      </Text>


      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>

          <Pressable
            style={styles.retryButton}
            onPress={loadOffers}
          >
            <Text style={styles.retryText}>
              Retry
            </Text>
          </Pressable>
        </View>
      )}


      {!error && offers.length === 0 && (
        <View style={styles.emptyCard}>
          <Text style={styles.emptyIcon}>
            📭
          </Text>

          <Text style={styles.emptyTitle}>
            No offers yet
          </Text>

          <Text style={styles.emptyText}>
            When a recycler makes an offer
            for your material, it will appear here.
          </Text>
        </View>
      )}


      {offers.map((offer) => (
        <View
          key={offer.id}
          style={styles.offerCard}
        >

          <View style={styles.cardHeader}>
            <View style={styles.headerText}>
              <Text style={styles.facilityName}>
                {offer.recycler_facilities?.name ||
                  'Recycler Facility'}
              </Text>

              <Text style={styles.facilityCode}>
                {offer.recycler_facilities
                  ?.facility_code ||
                  'Facility'}
              </Text>
            </View>

            <View
              style={[
                styles.statusBadge,
                offer.status === 'pending'
                  ? styles.pendingBadge
                  : styles.otherBadge,
              ]}
            >
              <Text style={styles.statusText}>
                {offer.status.toUpperCase()}
              </Text>
            </View>
          </View>


          <View style={styles.divider} />


          <Text style={styles.sectionLabel}>
            Material
          </Text>

          <Text style={styles.materialName}>
            {offer.material_lots?.lot_code ||
              'Material Lot'}
          </Text>


          {offer.material_lots?.description && (
            <Text style={styles.description}>
              {offer.material_lots.description}
            </Text>
          )}


          <View style={styles.infoRow}>

            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Weight
              </Text>

              <Text style={styles.infoValue}>
                {offer.material_lots
                  ?.approx_weight ?? 0}{' '}
                {offer.material_lots
                  ?.weight_unit || 'kg'}
              </Text>
            </View>


            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>
                Offered Price
              </Text>

              <Text style={styles.price}>
                ₹
                {Number(
                  offer.offered_price
                ).toLocaleString('en-IN')}
                /{offer.price_unit}
              </Text>
            </View>

          </View>


          <View style={styles.pickupBox}>
            <Text style={styles.pickupLabel}>
              Pickup
            </Text>

            <Text style={styles.pickupValue}>
              {offer.pickup_available
                ? '✓ Available'
                : '✕ Not available'}
            </Text>
          </View>


          {offer.recycler_facilities?.address && (
            <Text style={styles.address}>
              📍{' '}
              {offer.recycler_facilities.address}
            </Text>
          )}


          {offer.status === 'pending' && (
          <View style={styles.actionRow}>

            <Pressable
              style={[
                styles.acceptButton,
                processingOfferId === offer.id &&
                  styles.disabledButton,
              ]}
              disabled={
                processingOfferId !== null
              }
              onPress={() =>
                handleAccept(offer.id)
              }
            >
              {processingOfferId === offer.id ? (
                <ActivityIndicator
                  color="#fff"
                  size="small"
                />
              ) : (
                <Text style={styles.acceptButtonText}>
                  ✓ Accept
                </Text>
              )}
            </Pressable>


            <Pressable
              style={[
                styles.rejectButton,
                processingOfferId === offer.id &&
                  styles.disabledButton,
              ]}
              disabled={
                processingOfferId !== null
              }
              onPress={() =>
                handleReject(offer.id)
              }
            >
              <Text style={styles.rejectButtonText}>
                ✕ Reject
              </Text>
            </Pressable>

  </View>
)}

        </View>
      ))}

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
    marginBottom: 10,
  },

  retryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#b91c1c',
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 7,
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  emptyCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 30,
    alignItems: 'center',
    marginTop: 10,
  },

  emptyIcon: {
    fontSize: 42,
    marginBottom: 12,
  },

  emptyTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 8,
  },

  emptyText: {
    textAlign: 'center',
    color: '#666',
    lineHeight: 21,
  },

  offerCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 18,
    marginBottom: 16,
  },

  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },

  headerText: {
    flex: 1,
    paddingRight: 10,
  },

  facilityName: {
    fontSize: 18,
    fontWeight: '700',
  },

  facilityCode: {
    color: '#777',
    marginTop: 4,
    fontSize: 12,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 20,
  },

  pendingBadge: {
    backgroundColor: '#fef3c7',
  },

  otherBadge: {
    backgroundColor: '#e5e7eb',
  },

  statusText: {
    fontSize: 11,
    fontWeight: '700',
  },

  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginVertical: 15,
  },

  sectionLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },

  materialName: {
    fontSize: 16,
    fontWeight: '700',
  },

  description: {
    color: '#666',
    marginTop: 5,
    lineHeight: 20,
  },

  infoRow: {
    flexDirection: 'row',
    marginTop: 18,
    gap: 20,
  },

  infoItem: {
    flex: 1,
  },

  infoLabel: {
    fontSize: 12,
    color: '#777',
    marginBottom: 4,
  },

  infoValue: {
    fontSize: 15,
    fontWeight: '600',
  },

  price: {
    fontSize: 17,
    fontWeight: '700',
  },

  pickupBox: {
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
    padding: 10,
    marginTop: 16,
  },

  pickupLabel: {
    fontSize: 12,
    color: '#666',
  },

  pickupValue: {
    marginTop: 3,
    fontWeight: '600',
  },

  address: {
    color: '#666',
    marginTop: 12,
    fontSize: 13,
  },

  actionPlaceholder: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingTop: 12,
  },

  actionPlaceholderText: {
    textAlign: 'center',
    color: '#888',
    fontSize: 12,
  },

  actionRow: {
  flexDirection: 'row',
  gap: 10,
  marginTop: 16,
},

acceptButton: {
  flex: 1,
  backgroundColor: '#168a4b',
  borderRadius: 8,
  paddingVertical: 13,
  alignItems: 'center',
  justifyContent: 'center',
},

rejectButton: {
  flex: 1,
  borderWidth: 1,
  borderColor: '#b91c1c',
  borderRadius: 8,
  paddingVertical: 13,
  alignItems: 'center',
  justifyContent: 'center',
},

acceptButtonText: {
  color: '#fff',
  fontWeight: '700',
  fontSize: 15,
},

rejectButtonText: {
  color: '#b91c1c',
  fontWeight: '700',
  fontSize: 15,
},

disabledButton: {
  opacity: 0.6,
},

});