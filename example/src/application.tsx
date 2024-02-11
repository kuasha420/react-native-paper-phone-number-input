import React, { useRef, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { Button, Surface, Text } from 'react-native-paper';
import type { PhoneNumberInputRef } from 'react-native-paper-phone-number-input';
import {
  CountryPicker,
  PhoneNumberInput,
  getCountryByCode,
} from 'react-native-paper-phone-number-input';
import { SafeAreaView } from 'react-native-safe-area-context';

// list of countries that should be shown first in the country picker.
// Put this variable outside the component to avoid re-creating it on each render
// Or you can use useMemo() hook to create it.
const countriesToShowFirst = ['BD', 'US', 'CA', 'GB', 'AU', 'IN', 'NZ'];

const Application: React.FC = () => {
  const [countryCode, setCountryCode] = useState<string>('BD'); // Default country code
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const [country, setCountry] = useState('Bermuda');

  const ref = useRef<PhoneNumberInputRef>(null);

  const selectedCountry = getCountryByCode(countryCode);
  return (
    <Surface style={styles.fit}>
      <SafeAreaView style={styles.fit}>
        <ScrollView style={styles.container}>
          <Text style={styles.title} variant="titleLarge">
            React Native Paper Phone Number Input
          </Text>
          <Text style={styles.description} variant="bodyLarge">
            A phone number input component for react-native-paper that allows user to select country
            from a modal and input their phone number. It uses primitives from react-native-paper,
            therefore, it feels very integrated with the rest of the components.
          </Text>
          <PhoneNumberInput
            ref={ref}
            code={countryCode}
            setCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            showFirstOnList={countriesToShowFirst}
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
          <Text style={styles.title} variant="titleLarge">
            Disabled State
          </Text>
          <PhoneNumberInput
            ref={ref}
            code={countryCode}
            setCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            showFirstOnList={countriesToShowFirst}
            disabled
          />
          <Text style={styles.subtitle} variant="titleLarge">
            Not Editable
          </Text>
          <PhoneNumberInput
            ref={ref}
            code={countryCode}
            setCode={setCountryCode}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            showFirstOnList={countriesToShowFirst}
            editable={false}
          />
          <Text style={styles.subtitle} variant="titleLarge">
            Country Picker
          </Text>
          <CountryPicker
            showFirstOnList={countriesToShowFirst}
            country={country}
            setCountry={setCountry}
          />
        </ScrollView>
      </SafeAreaView>
    </Surface>
  );
};

const styles = StyleSheet.create({
  fit: {
    flex: 1,
  },
  container: {
    padding: 16,
  },
  title: {
    textAlign: 'center',
    marginBottom: 16,
  },
  subtitle: {
    textAlign: 'center',
    marginVertical: 16,
  },
  description: {
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
    marginVertical: 16,
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
