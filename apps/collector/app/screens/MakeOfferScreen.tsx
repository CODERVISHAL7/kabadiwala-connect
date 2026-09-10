import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  Alert,
} from 'react-native';
import {
  createOffer,
  getMyFacilities,
} from '../../services/offers';

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

export default function MakeOfferScreen({
  route,
  navigation,
}: Props) {
  const { lot } = route.params;

  const [offerAmount, setOfferAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const submitOffer = async () => {
    console.log('SUBMIT OFFER FUNCTION STARTED');
  const amount = Number(offerAmount);

  if (!offerAmount.trim() || !Number.isFinite(amount)) {
    Alert.alert(
      'Invalid amount',
      'Please enter a valid offer amount.'
    );
    return;
  }

  if (amount <= 0) {
    Alert.alert(
      'Invalid amount',
      'Offer amount must be greater than ₹0.'
    );
    return;
  }

  setSubmitting(true);

  try {
    // Get the facilities belonging to the
    // currently logged-in Recycler.
    const facilities = await getMyFacilities();

    if (facilities.length === 0) {
      throw new Error(
        'No recycler facility is linked to your account.'
      );
    }

    // For now, use the first active facility.
    const facility =
      facilities.find(
        (item: any) => item.is_active !== false
      ) ?? facilities[0];

    if (!facility?.id) {
      throw new Error(
        'Recycler facility ID could not be found.'
      );
    }

    console.log('CREATING OFFER:', {
      lotId: lot.id,
      facilityId: facility.id,
      offeredPrice: amount,
    });

    const offer = await createOffer({
      lotId: lot.id,
      facilityId: facility.id,
      offeredPrice: amount,
      priceUnit: lot.weight_unit || 'kg',
      pickupAvailable: true,
    });

    console.log('OFFER CREATED:', offer);

    Alert.alert(
      'Offer Submitted',
      'Your offer has been submitted successfully.',
      [
        {
          text: 'OK',
          onPress: () => {
            navigation.popToTop();
          },
        },
      ]
    );
  } catch (error: any) {
    console.error(
      'Offer submission error:',
      error
    );

    Alert.alert(
      'Offer Failed',
      error?.message ||
        'Unable to submit offer.'
    );
  } finally {
    setSubmitting(false);
  }
};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Make an Offer
      </Text>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Lot Information
        </Text>

        <View style={styles.row}>
          <Text style={styles.label}>Weight</Text>

          <Text style={styles.value}>
            {lot.approx_weight} {lot.weight_unit}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Estimated Value
          </Text>

          <Text style={styles.value}>
            ₹{Number(lot.estimated_value).toFixed(2)}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Your Offer
        </Text>

        <Text style={styles.label}>
          Offer Amount (₹)
        </Text>

        <TextInput
          style={styles.input}
          value={offerAmount}
          onChangeText={setOfferAmount}
          placeholder="Enter amount"
          keyboardType="decimal-pad"
          editable={!submitting}
        />

        <Pressable
          style={[
            styles.button,
            submitting && styles.buttonDisabled,
          ]}
          onPress={() => {
            console.log('SUBMIT OFFER BUTTON PRESSED');
            submitOffer();
          }}
          disabled={submitting}
        >
          <Text style={styles.buttonText}>
            {submitting ? 'Submitting...' : 'Submit Offer'}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },

  sectionTitle: {
    fontSize: 19,
    fontWeight: '700',
    marginBottom: 16,
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
    marginBottom: 8,
  },

  value: {
    fontWeight: '600',
  },

  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 18,
  },

  button: {
    backgroundColor: '#111',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});