import React, { useState } from 'react';

import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
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

type Feedback = {
  type: 'success' | 'error';
  title: string;
  message: string;
};

export default function MakeOfferScreen({
  route,
  navigation,
}: Props) {
  const { lot } = route.params;

  const [offerAmount, setOfferAmount] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const [feedback, setFeedback] =
    useState<Feedback | null>(null);

  const submitOffer = async () => {
    console.log('SUBMIT OFFER FUNCTION STARTED');

    const amount = Number(offerAmount);

    if (
      !offerAmount.trim() ||
      !Number.isFinite(amount)
    ) {
      setFeedback({
        type: 'error',
        title: 'Invalid Amount',
        message:
          'Please enter a valid offer amount.',
      });

      return;
    }

    if (amount <= 0) {
      setFeedback({
        type: 'error',
        title: 'Invalid Amount',
        message:
          'Offer amount must be greater than ₹0.',
      });

      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      // Get facilities belonging to the
      // currently logged-in Recycler.
      const facilities =
        await getMyFacilities();

      if (facilities.length === 0) {
        throw new Error(
          'No recycler facility is linked to your account.'
        );
      }

      // Use the first active facility.
      const facility =
        facilities.find(
          (item: any) =>
            item.is_active !== false
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

      console.log(
        'OFFER CREATED:',
        offer
      );

      // SUCCESS FEEDBACK
      setFeedback({
        type: 'success',
        title: 'Offer Submitted!',
        message:
          'Your offer has been submitted successfully to the collector.',
      });

      // Clear amount after successful submission
      setOfferAmount('');

    } catch (error: any) {
      console.error(
        'Offer submission error:',
        error
      );

      // ERROR FEEDBACK
      setFeedback({
        type: 'error',
        title: 'Offer Submission Failed',
        message:
          error?.message ||
          'Unable to submit offer. Please try again.',
      });

    } finally {
      setSubmitting(false);
    }
  };

  // ==========================================
  // FEEDBACK SCREEN
  // ==========================================

  if (feedback) {
    const isSuccess =
      feedback.type === 'success';

    return (
      <View style={styles.feedbackContainer}>

        <View
          style={[
            styles.feedbackIcon,
            isSuccess
              ? styles.successIcon
              : styles.errorIcon,
          ]}
        >
          <Text style={styles.feedbackIconText}>
            {isSuccess ? '✓' : '✕'}
          </Text>
        </View>

        <Text
          style={[
            styles.feedbackTitle,
            isSuccess
              ? styles.successTitle
              : styles.errorTitle,
          ]}
        >
          {feedback.title}
        </Text>

        <Text style={styles.feedbackMessage}>
          {feedback.message}
        </Text>

        {isSuccess ? (
          <Pressable
            style={styles.successButton}
            onPress={() => {
              navigation.popToTop();
            }}
          >
            <Text style={styles.feedbackButtonText}>
              Back to Dashboard
            </Text>
          </Pressable>
        ) : (
          <Pressable
            style={styles.retryButton}
            onPress={() => {
              setFeedback(null);
            }}
          >
            <Text style={styles.feedbackButtonText}>
              Try Again
            </Text>
          </Pressable>
        )}

      </View>
    );
  }

  // ==========================================
  // MAKE OFFER FORM
  // ==========================================

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
          <Text style={styles.label}>
            Weight
          </Text>

          <Text style={styles.value}>
            {lot.approx_weight}{' '}
            {lot.weight_unit}
          </Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.label}>
            Estimated Value
          </Text>

          <Text style={styles.value}>
            ₹
            {Number(
              lot.estimated_value
            ).toFixed(2)}
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
            submitting &&
              styles.buttonDisabled,
          ]}
          onPress={submitOffer}
          disabled={submitting}
        >
          {submitting ? (
            <>
              <ActivityIndicator
                color="#fff"
                style={styles.loader}
              />

              <Text style={styles.buttonText}>
                Submitting...
              </Text>
            </>
          ) : (
            <Text style={styles.buttonText}>
              Submit Offer
            </Text>
          )}
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
    justifyContent: 'center',
    flexDirection: 'row',
  },

  buttonDisabled: {
    opacity: 0.5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  loader: {
    marginRight: 10,
  },

  // ==========================================
  // FEEDBACK SCREEN
  // ==========================================

  feedbackContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },

  feedbackIcon: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },

  successIcon: {
    backgroundColor: '#168a4b',
  },

  errorIcon: {
    backgroundColor: '#dc2626',
  },

  feedbackIconText: {
    color: '#fff',
    fontSize: 48,
    fontWeight: '700',
  },

  feedbackTitle: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 12,
  },

  successTitle: {
    color: '#168a4b',
  },

  errorTitle: {
    color: '#dc2626',
  },

  feedbackMessage: {
    fontSize: 16,
    color: '#555',
    textAlign: 'center',
    lineHeight: 24,
    maxWidth: 450,
    marginBottom: 30,
  },

  successButton: {
    backgroundColor: '#168a4b',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 220,
    alignItems: 'center',
  },

  retryButton: {
    backgroundColor: '#dc2626',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    minWidth: 180,
    alignItems: 'center',
  },

  feedbackButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

});