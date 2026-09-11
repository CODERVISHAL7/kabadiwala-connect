import { useEffect, useState } from 'react';

import {
  ActivityIndicator,
  StyleSheet,
  Text,
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

  const [roleLoading, setRoleLoading] =
    useState(false);

  async function loadUserRole() {
  setRoleLoading(true);

  try {
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

    // Retry profile lookup because registration may still
    // be creating the profile/business records.
    const maxAttempts = 10;
    const retryDelay = 500;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from('profiles')
        .select('role, is_active')
        .eq('id', user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          'Failed to load user profile:',
          profileError
        );

        setRole(null);
        setIsActive(null);
        return;
      }

      if (profile) {
        setRole(profile.role as UserRole);
        setIsActive(profile.is_active);
        return;
      }

      console.warn(
        `Profile not found for ${user.id}. ` +
        `Retrying (${attempt}/${maxAttempts})...`
      );

      if (attempt < maxAttempts) {
        await new Promise((resolve) =>
          setTimeout(resolve, retryDelay)
        );
      }
    }

    console.error(
      'Profile was not created after registration:',
      user.id
    );

    setRole(null);
    setIsActive(null);
  } finally {
    setRoleLoading(false);
  }
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
        await loadUserRole();
      } else {
        setRole(null);
        setIsActive(null);
      }

      if (mounted) {
        setSessionReady(true);
      }
    }

    loadSession();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!mounted) {
          return;
        }

        setAuthenticated(!!session);

        if (!session) {
          setRole(null);
          setIsActive(null);
          setRoleLoading(false);
          setSessionReady(true);
          return;
        }

        /*
         * Small delay prevents the Auth event from
         * racing the profile INSERT during registration.
         */
        setTimeout(async () => {
          if (!mounted) {
            return;
          }

          await loadUserRole();

          if (mounted) {
            setSessionReady(true);
          }
        }, 300);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  /*
   * Initial application loading
   */
  if (!sessionReady || roleLoading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading...
        </Text>
      </View>
    );
  }

  /*
   * No authenticated user
   */
  if (!authenticated) {
    return (
      <NavigationContainer>
        <AppNavigator
          authenticated={false}
          role={null}
          isActive={null}
        />
      </NavigationContainer>
    );
  }

  /*
   * Authenticated but profile/role is not
   * available yet.
   *
   * IMPORTANT:
   * Never render a navigator with authenticated=true
   * and role=null.
   */
  if (!role) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" />

        <Text style={styles.loadingText}>
          Loading your profile...
        </Text>
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

  loadingText: {
    marginTop: 12,
    fontSize: 16,
  },
});