import React, {
  useState,
} from 'react';

import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  registerRecycler,
} from '../../services/recycler';

export default function RecyclerRegisterScreen({
  navigation,
}: any) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [confirmPassword, setConfirmPassword] =
    useState('');

  const [preferredLanguage, setPreferredLanguage] =
    useState('hi');

  const [operatingLocation, setOperatingLocation] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const handleRegister = async () => {
    setError(null);

    if (!email.trim()) {
      setError('Please enter your email.');
      return;
    }

    if (!password) {
      setError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        'Passwords do not match.'
      );
      return;
    }

    if (!operatingLocation.trim()) {
      setError(
        'Please enter your operating location.'
      );
      return;
    }

    try {
      setLoading(true);

      await registerRecycler(
        email,
        password,
        preferredLanguage,
        operatingLocation
      );

      Alert.alert(
        'Registration Successful',
        'Your recycler account has been created.',
        [
          {
            text: 'Continue to Login',
            onPress: () =>
              navigation.navigate('Login'),
          },
        ]
      );
    } catch (err: any) {
      console.error(
        'Recycler registration failed:',
        err
      );

      setError(
        err?.message ||
          'Registration failed.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={
        Platform.OS === 'ios'
          ? 'padding'
          : undefined
      }
    >
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
      >
        <Text style={styles.title}>
          Recycler Registration
        </Text>

        <Text style={styles.subtitle}>
          Create your Kabadiwala Connect
          recycler account
        </Text>

        {error && (
          <View style={styles.errorBox}>
            <Text style={styles.errorText}>
              {error}
            </Text>
          </View>
        )}

        <Text style={styles.label}>
          Email
        </Text>

        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter email"
          autoCapitalize="none"
          keyboardType="email-address"
          style={styles.input}
        />

        <Text style={styles.label}>
          Password
        </Text>

        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter password"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>
          Confirm Password
        </Text>

        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
          style={styles.input}
        />

        <Text style={styles.label}>
          Preferred Language
        </Text>

        <TextInput
          value={preferredLanguage}
          onChangeText={setPreferredLanguage}
          placeholder="hi"
          style={styles.input}
        />

        <Text style={styles.helper}>
          Example: hi, en, gu
        </Text>

        <Text style={styles.label}>
          Operating Location
        </Text>

        <TextInput
          value={operatingLocation}
          onChangeText={setOperatingLocation}
          placeholder="Enter your operating location"
          style={styles.input}
        />

        <Pressable
          style={[
            styles.button,
            loading && styles.buttonDisabled,
          ]}
          disabled={loading}
          onPress={handleRegister}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonText}>
              Create Recycler Account
            </Text>
          )}
        </Pressable>

        <Pressable
          style={styles.loginButton}
          onPress={() =>
            navigation.navigate('Login')
          }
        >
          <Text style={styles.loginText}>
            Already have an account? Login
          </Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  content: {
    padding: 24,
    paddingBottom: 50,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    textAlign: 'center',
    marginTop: 20,
  },

  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 25,
  },

  errorBox: {
    backgroundColor: '#fee2e2',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },

  errorText: {
    color: '#b91c1c',
  },

  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 14,
  },

  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
  },

  helper: {
    color: '#777',
    fontSize: 12,
    marginTop: 5,
  },

  button: {
    backgroundColor: '#168a4b',
    borderRadius: 8,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 28,
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  loginButton: {
    alignItems: 'center',
    paddingVertical: 18,
  },

  loginText: {
    textDecorationLine: 'underline',
    fontSize: 14,
  },
});