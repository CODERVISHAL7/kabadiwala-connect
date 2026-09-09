import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  View,
} from 'react-native';

import {
  NavigationContainer,
} from '@react-navigation/native';

import { supabase } from './lib/supabase';

import AppNavigator from './app/navigation/AppNavigator';

type UserRole =
  | 'collector'
  | 'recycler_user'
  | 'admin';

export default function App() {
  const [sessionReady, setSessionReady] =
    useState(false);

  const [authenticated, setAuthenticated] =
    useState(false);

  const [role, setRole] =
    useState<UserRole | null>(null);

  const [isActive, setIsActive] =
    useState<boolean | null>(null);

  async function loadUserProfile() {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError) {
      console.error(
        'Failed to get authenticated user:',
        userError
      );

      setRole(null);
      setIsActive(null);
      return;
    }

    if (!user) {
      setRole(null);
      setIsActive(null);
      return;
    }

    const {
      data: profile,
      error: profileError,
    } = await supabase
      .from('profiles')
      .select('role, is_active')
      .eq('id', user.id)
      .single();

    if (profileError) {
      console.error(
        'Failed to load user profile:',
        profileError
      );

      setRole(null);
      setIsActive(null);
      return;
    }

    setRole(profile.role as UserRole);
    setIsActive(profile.is_active);
  }

  useEffect(() => {
    let mounted = true;

    async function loadSession() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) {
        return;
      }

      setAuthenticated(!!session);

      if (session) {
        await loadUserProfile();
      } else {
        setRole(null);
        setIsActive(null);
      }

      setSessionReady(true);
    }

    loadSession();

    const statusInterval = setInterval(() => {
      if (mounted) {
        loadUserProfile();
      }
    }, 30000);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) {
          return;
        }

        setAuthenticated(!!session);

        if (session) {
          await loadUserProfile();
        } else {
          setRole(null);
          setIsActive(null);
        }

        setSessionReady(true);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  if (!sessionReady) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <AppNavigator
        authenticated={authenticated}
        role={role}
        isActive={isActive}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  loading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});