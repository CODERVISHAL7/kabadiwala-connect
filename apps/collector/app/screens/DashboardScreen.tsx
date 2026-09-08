import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

import { signOut } from '../../services/auth';
import { getCurrentCollector } from '../../services/collector';

type Collector = {
  id: string;
  profile_id: string;
  collector_code: string;
  general_location: any;
  created_at: string;
  updated_at: string;
};

export default function DashboardScreen() {
  const [collector, setCollector] =
    useState<Collector | null>(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] =
    useState<string | null>(null);

  useEffect(() => {
    loadCollector();
  }, []);

  async function loadCollector() {
    try {
      setLoading(true);
      setError(null);

      const data = await getCurrentCollector();

      setCollector(data);
    } catch (err: any) {
      console.error(
        'Failed to load collector:',
        err
      );

      setError(
        err?.message ||
          'Unable to load collector information.'
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    try {
      await signOut();
    } catch (err: any) {
      console.error('Logout error:', err);
    }
  }

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading dashboard...
        </Text>
      </View>
    );
  }

  if (error || !collector) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorTitle}>
          Unable to load dashboard
        </Text>

        <Text style={styles.errorText}>
          {error || 'Collector record not found.'}
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={loadCollector}
        >
          <Text style={styles.retryText}>
            Retry
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Text style={styles.logoutText}>
            Logout
          </Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Kabadiwala Connect
      </Text>

      <Text style={styles.welcome}>
        Welcome, Collector 👋
      </Text>

      <View style={styles.profileCard}>
        <Text style={styles.label}>
          Collector Code
        </Text>

        <Text style={styles.collectorCode}>
          {collector.collector_code}
        </Text>

        <Text style={styles.status}>
          ● Active
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            0
          </Text>

          <Text style={styles.statLabel}>
            Collections
          </Text>
        </View>

        <View style={styles.statCard}>
          <Text style={styles.statNumber}>
            0 kg
          </Text>

          <Text style={styles.statLabel}>
            Total Material
          </Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.primaryButton}
      >
        <Text style={styles.primaryButtonText}>
          + New Collection
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
      >
        <Text style={styles.secondaryButtonText}>
          Collection History
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.logoutButton}
        onPress={handleLogout}
      >
        <Text style={styles.logoutText}>
          Logout
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
  },

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  welcome: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 24,
  },

  profileCard: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },

  label: {
    fontSize: 14,
    color: '#666',
  },

  collectorCode: {
    fontSize: 24,
    fontWeight: '700',
    marginTop: 6,
  },

  status: {
    marginTop: 10,
    fontSize: 15,
  },

  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },

  statCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 18,
    alignItems: 'center',
  },

  statNumber: {
    fontSize: 24,
    fontWeight: '700',
  },

  statLabel: {
    marginTop: 6,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },

  primaryButton: {
    backgroundColor: '#21874f',
    padding: 16,
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
    borderWidth: 1,
    borderColor: '#21874f',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },

  secondaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },

  logoutButton: {
    backgroundColor: '#b42318',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 'auto',
  },

  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },

  loadingText: {
    marginTop: 12,
  },

  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
  },

  errorText: {
    textAlign: 'center',
    marginBottom: 20,
  },

  retryButton: {
    backgroundColor: '#21874f',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 12,
  },

  retryText: {
    color: '#fff',
    fontWeight: '600',
  },
});