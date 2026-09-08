import { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import {
  getCurrentCollector,
  getCollectorStats,
} from '../../services/collector';

export default function CollectorProfileScreen({
  navigation,
}: any) {
  const [collector, setCollector] =
    useState<any>(null);

  const [stats, setStats] =
    useState({
      collections: 0,
      totalWeight: 0,
      totalEstimatedValue: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState<string | null>(null);

  const loadProfile = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [collectorData, statsData] =
        await Promise.all([
          getCurrentCollector(),
          getCollectorStats(),
        ]);

      setCollector(collectorData);
      setStats(statsData);
    } catch (err: any) {
      console.error(
        'Failed to load collector profile:',
        err
      );

      setError(
        err?.message ||
          'Unable to load profile.'
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadProfile();
    }, [loadProfile])
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading profile...
        </Text>
      </View>
    );
  }

  if (error || !collector) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to Load Profile
        </Text>

        <Text style={styles.errorText}>
          {error || 'Collector not found.'}
        </Text>

        <Pressable
          style={styles.retryButton}
          onPress={loadProfile}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </Pressable>
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >
      {/* Profile Header */}
      <View style={styles.profileHeader}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            C
          </Text>
        </View>

        <Text style={styles.title}>
          Collector Profile
        </Text>

        <Text style={styles.collectorCode}>
          {collector.collector_code}
        </Text>
      </View>

      {/* Collector Information */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Collector Information
        </Text>

        <InfoRow
          label="Collector Code"
          value={collector.collector_code}
        />

        <InfoRow
          label="General Location"
          value={
            collector.general_location ||
            'Not provided'
          }
        />

        <InfoRow
          label="Member Since"
          value={new Date(
            collector.created_at
          ).toLocaleDateString()}
        />
      </View>

      {/* Statistics */}
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>
          Collection Statistics
        </Text>

        <InfoRow
          label="Total Collections"
          value={String(stats.collections)}
        />

        <InfoRow
          label="Total Weight"
          value={`${Number(
            stats.totalWeight
          ).toFixed(2)} kg`}
        />

        <InfoRow
          label="Estimated Value"
          value={`₹${Number(
            stats.totalEstimatedValue
          ).toFixed(2)}`}
        />
      </View>

      {/* Actions */}
      <Pressable
        style={styles.primaryButton}
        onPress={() =>
          navigation.navigate(
            'CollectionHistory'
          )
        }
      >
        <Text style={styles.primaryText}>
          View Collection History
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
    </ScrollView>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <View style={styles.infoRow}>
      <Text style={styles.label}>
        {label}
      </Text>

      <Text style={styles.value}>
        {value}
      </Text>
    </View>
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
    padding: 25,
  },

  loadingText: {
    marginTop: 10,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
  },

  errorText: {
    marginTop: 8,
    color: '#666',
    textAlign: 'center',
  },

  retryButton: {
    marginTop: 20,
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 8,
    backgroundColor: '#218c54',
  },

  retryText: {
    color: '#fff',
    fontWeight: '700',
  },

  profileHeader: {
    alignItems: 'center',
    marginBottom: 25,
  },

  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#218c54',
    marginBottom: 12,
  },

  avatarText: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
  },

  collectorCode: {
    marginTop: 5,
    fontSize: 15,
    color: '#666',
  },

  card: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 15,
  },

  infoRow: {
    marginBottom: 14,
  },

  label: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },

  value: {
    fontSize: 16,
    fontWeight: '600',
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
    borderWidth: 1,
    borderColor: '#218c54',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },

  secondaryText: {
    fontSize: 16,
    fontWeight: '600',
  },
});