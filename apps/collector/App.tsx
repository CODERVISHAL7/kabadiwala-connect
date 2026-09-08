import { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { supabase } from './lib/supabase';

export default function App() {
  const [status, setStatus] = useState('Connecting...');

  useEffect(() => {
    testConnection();
  }, []);

  async function testConnection() {
    const { data, error } = await supabase
      .from('materials')
      .select('id, name')
      .limit(10);

    if (error) {
      console.error(error);
      setStatus(`❌ Connection failed: ${error.message}`);
      return;
    }

    console.log('Materials:', data);
    setStatus(`✅ Supabase connected — ${data.length} materials found`);
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kabadiwala Connect</Text>
      <Text style={styles.status}>{status}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  status: {
    fontSize: 16,
    textAlign: 'center',
  },
});