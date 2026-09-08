import { useState } from 'react';
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { updateCollectorProfile } from '../../services/collector';

import * as Location from 'expo-location';

import {
  updateCollectorGPSLocation,
} from '../../services/collector';

export default function EditCollectorProfileScreen({
  route,
  navigation,
}: any) {
  const { collector } = route.params;

  const [generalLocation, setGeneralLocation] =
    useState(
      collector?.general_location_text || ''
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  async function handleSave() {
    try {
      setSaving(true);
      setError(null);

      const updatedCollector =
        await updateCollectorProfile(
          generalLocation
        );

      navigation.navigate(
        'CollectorProfile',
        {
          updatedCollector,
        }
      );
    } catch (err: any) {
      console.error(
        'Failed to update collector profile:',
        err
      );

      setError(
        err?.message ||
          'Unable to update profile.'
      );
    } finally {
      setSaving(false);
    }
  }

async function handleUseCurrentLocation() {
  try {
    setSaving(true);
    setError(null);

    const { status } =
      await Location.requestForegroundPermissionsAsync();

    if (status !== 'granted') {
      throw new Error(
        'Location permission was denied.'
      );
    }

    const location =
      await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
        mayShowUserSettingsDialog: true,
      });

    const {
      latitude,
      longitude,
    } = location.coords;

    let readableLocation = '';

    // Web: use Nominatim reverse geocoding
    if (Platform.OS === 'web') {
      const url =
        `https://nominatim.openstreetmap.org/reverse` +
        `?format=jsonv2` +
        `&lat=${latitude}` +
        `&lon=${longitude}` +
        `&addressdetails=1` +
        `&zoom=18`;

      const response = await fetch(url, {
        headers: {
          Accept: 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(
          `Reverse geocoding failed: ${response.status}`
        );
      }

      const result = await response.json();

      readableLocation =
        result.display_name || '';
    } else {
      // Android / iOS
      const addresses =
        await Location.reverseGeocodeAsync({
          latitude,
          longitude,
        });

      const address = addresses?.[0];

      if (address) {
        const parts = [
          address.name,
          address.street,
          address.city,
          address.district,
          address.region,
          address.postalCode,
          address.country,
        ].filter(Boolean);

        readableLocation = [
          ...new Set(parts),
        ].join(', ');
      }
    }

    if (!readableLocation) {
      readableLocation =
        `GPS: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`;
    }

    // Save GPS coordinates
    await updateCollectorGPSLocation(
      latitude,
      longitude
    );

    // Put readable address into the editable field.
    // It will be persisted when Save Changes is pressed.
    setGeneralLocation(
      readableLocation
    );
  } catch (err: any) {
    console.error(
      'Failed to get current location:',
      err
    );

    setError(
      err?.message ||
        'Unable to get current location.'
    );
  } finally {
    setSaving(false);
  }
}

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        Edit Profile
      </Text>

      <Text style={styles.label}>
        Collector Code
      </Text>

      <View style={styles.readOnlyBox}>
        <Text style={styles.readOnlyText}>
          {collector?.collector_code}
        </Text>
      </View>

      <Text style={styles.helper}>
        Collector code cannot be changed.
      </Text>

      <Text style={styles.label}>
        General Location
      </Text>

      

      <TextInput
        value={generalLocation}
        onChangeText={setGeneralLocation}
        placeholder="Enter your general location"
        style={styles.input}
        editable={!saving}
        

      />

      

      {error && (
        <View style={styles.errorBox}>
          <Text style={styles.errorText}>
            {error}
          </Text>
        </View>
      )}

      <Pressable
        style={styles.locationButton}
        onPress={handleUseCurrentLocation}
        disabled={saving}
        >
        <Text style={styles.locationButtonText}>
            📍 Use Current Location
        </Text>
        
    </Pressable>

    <Text style={styles.locationAttribution}>
        Address data © OpenStreetMap contributors
    </Text>
    
      

      <Pressable
        style={[
          styles.saveButton,
          saving && styles.disabledButton,
        ]}
        onPress={handleSave}
        disabled={saving}
      >
        {saving ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.saveText}>
            Save Changes
          </Text>
        )}
      </Pressable>

      <Pressable
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
        disabled={saving}
      >
        <Text style={styles.cancelText}>
          Cancel
        </Text>
      </Pressable>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },

  title: {
    fontSize: 26,
    fontWeight: '700',
    marginBottom: 25,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 7,
    marginTop: 15,
  },

  readOnlyBox: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 14,
    backgroundColor: '#f5f5f5',
  },

  readOnlyText: {
    fontSize: 16,
    color: '#666',
  },

  helper: {
    marginTop: 5,
    fontSize: 12,
    color: '#888',
  },

  input: {
    borderWidth: 1,
    borderColor: '#bbb',
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 16,
  },

  locationButton: {
  marginTop: 10,
  paddingVertical: 13,
  borderRadius: 8,
  borderWidth: 1,
  borderColor: '#218c54',
  alignItems: 'center',
},

locationButtonText: {
  color: '#218c54',
  fontSize: 15,
  fontWeight: '600',
},

locationAttribution: {
  marginTop: 6,
  fontSize: 11,
  color: '#777',
  textAlign: 'center',
},

  errorBox: {
    marginTop: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ffe5e5',
  },

  errorText: {
    color: '#b00020',
  },

  saveButton: {
    marginTop: 25,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: '#218c54',
  },

  disabledButton: {
    opacity: 0.6,
  },

  saveText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },

  cancelButton: {
    marginTop: 12,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#aaa',
  },

  cancelText: {
    fontSize: 16,
    fontWeight: '600',
  },
});