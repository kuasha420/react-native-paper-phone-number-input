import React, { useRef, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import type { PhoneNumberInputRef } from 'react-native-paper-phone-number-input';
import { PhoneNumberInput, getCountryByCode } from 'react-native-paper-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';

const Application: React.FC = () => {
  const [countryCode, setCountryCode] = useState<string>('BD');
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const ref = useRef<PhoneNumberInputRef>(null);

  const selectedCountry = getCountryByCode(countryCode);
  return (
    <Surface style={styles.fit}>
      <SafeAreaView style={styles.container}>
        <Text style={styles.title} variant="titleLarge">
          React Native Paper Phone Number Input
        </Text>
        <PhoneNumberInput
          ref={ref}
          code={countryCode}
          setCode={setCountryCode}
          phoneNumber={phoneNumber}
          setPhoneNumber={setPhoneNumber}
        />
        <Surface elevation={5} style={styles.country}>
          <View style={styles.left}>
            <Text variant="titleMedium">Selected Country</Text>
            <Text variant="bodyMedium"> Country Name: {selectedCountry.name}</Text>
            <Text variant="bodyMedium"> Dial Code: {selectedCountry.dialCode}</Text>
          </View>
          <View style={styles.right}>
            <Text style={styles.flag}>{selectedCountry.flag}</Text>
          </View>
        </Surface>
        <Surface elevation={5} style={styles.handles}>
          <Text style={styles.imperative} variant="titleMedium">
            Imperative Handles
          </Text>
          <View style={styles.actions}>
            <Button onPress={() => ref.current?.openCountryPicker()}>Open Picker</Button>
            <Button onPress={() => ref.current?.closeCountryPicker()}>Close Picker</Button>
          </View>
        </Surface>
      </SafeAreaView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  fit: {
    flex: 1,
  },
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  country: {
    marginTop: 16,
    padding: 32,
    flexDirection: 'row',
  },
  left: {
    flex: 1,
  },
  right: {
    alignItems: 'flex-end',
  },
  flag: {
    fontSize: 48,
  },
  handles: {
    marginTop: 16,
    padding: 16,
  },
  imperative: {
    textAlign: 'center',
    marginBottom: 16,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
});

export default Application;
