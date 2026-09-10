import { useState } from 'react';

import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import { signIn } from '../../services/auth';

export default function LoginScreen({
  navigation,
}: any) {
  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  async function handleLogin() {
    if (!email || !password) {
      Alert.alert(
        'Missing information',
        'Please enter email and password.'
      );

      return;
    }

    try {
      setLoading(true);

      await signIn(
        email.trim(),
        password
      );

      // App.tsx / AppNavigator will
      // automatically route the user
      // according to their profile role.

    } catch (error: any) {
      console.error(
        'Login failed:',
        error
      );

      Alert.alert(
        'Login failed',
        error?.message ||
          'Unable to login.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Kabadiwala Connect
      </Text>

      <Text style={styles.subtitle}>
        Login
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        autoCorrect={false}
        keyboardType="email-address"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={[
          styles.button,
          loading && styles.buttonDisabled,
        ]}
        onPress={handleLogin}
        disabled={loading}
      >
        <Text style={styles.buttonText}>
          {loading
            ? 'Logging in...'
            : 'Login'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'Register'
          )
        }
      >
        <Text style={styles.registerText}>
          Create a new collector account
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() =>
          navigation.navigate(
            'RecyclerRegister'
          )
        }
      >
        <Text style={styles.recyclerRegisterText}>
          Create a new recycler account
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },

  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
  },

  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 32,
  },

  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 14,
    marginBottom: 14,
    fontSize: 16,
  },

  button: {
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#1f7a4d',
  },

  buttonDisabled: {
    opacity: 0.6,
  },

  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },

  registerText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    textDecorationLine: 'underline',
  },

  recyclerRegisterText: {
    textAlign: 'center',
    marginTop: 16,
    fontSize: 16,
    textDecorationLine: 'underline',
  },
});