import React, { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { supabase } from '../../lib/supabase';

export default function AccountProfileScreen() {
  const [loading, setLoading] = useState(true);

  const [email, setEmail] = useState('');
  const [role, setRole] = useState('');
  const [language, setLanguage] = useState('');

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      setLoading(true);

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        throw userError;
      }

      if (!user) {
        throw new Error('No authenticated user.');
      }

      setEmail(user.email ?? '');

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('role, preferred_language')
        .eq('id', user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      setRole(profile.role);
      setLanguage(profile.preferred_language);
    } catch (error) {
      console.error(
        'Failed to load account profile:',
        error
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
          Loading profile...
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        My Profile
      </Text>

      <View style={styles.card}>
        <Text style={styles.label}>
          Email
        </Text>

        <Text style={styles.value}>
          {email}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Account Type
        </Text>

        <Text style={styles.value}>
          {role === 'recycler_user'
            ? 'Recycler'
            : role === 'admin'
              ? 'Administrator'
              : role}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>
          Preferred Language
        </Text>

        <Text style={styles.value}>
          {language === 'hi'
            ? 'Hindi'
            : language === 'mr'
              ? 'Marathi'
              : 'English'}
        </Text>
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

  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  loadingText: {
    marginTop: 10,
    color: '#666',
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 18,
    marginBottom: 14,
  },

  label: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },

  value: {
    fontSize: 17,
    fontWeight: '600',
  },
});