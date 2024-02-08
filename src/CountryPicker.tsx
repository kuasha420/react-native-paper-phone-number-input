import React, { forwardRef, useEffect, useImperativeHandle, useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import {
  DataTable,
  Modal,
  Portal,
  Searchbar,
  Surface,
  Text,
  TextInput,
  TouchableRipple,
} from 'react-native-paper';
import { countries } from './data/countries';
import { useDebouncedValue } from './use-debounced-value';
import { getCountryByCode } from './utils';
import type { CountryPickerProps, CountryPickerRef } from './types';

export const CountryPicker = forwardRef<CountryPickerRef, CountryPickerProps>(
  (
    {
      country,
      setCountry,
      showFirstOnList,
      // Prpos from TextInput that needs special handling
      disabled,
      editable,
      keyboardType,
      // rest of the props
      ...rest
    },
    ref
  ) => {
    // States for the modal
    const [visible, setVisible] = useState(false);

    const [countryFlag, setCountryFlag] = useState('');

    // States for the searchbar
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    useImperativeHandle(ref, () => ({
      openCountryPicker: () => setVisible(true),
      closeCountryPicker: () => setVisible(false),
    }));

    const countriesList = useMemo(() => {
      if (!showFirstOnList?.length) {
        return countries;
      }

      const countriesToShowOnTop = showFirstOnList.map((code) => ({
        ...getCountryByCode(code),
        code,
      }));

      return [
        ...countriesToShowOnTop,
        ...countries.filter(
          (country) => !countriesToShowOnTop.some((c) => c.code === country.code)
        ),
      ];
    }, [showFirstOnList]);

    const searchResult = useMemo(() => {
      if (!debouncedSearchQuery) {
        return countriesList;
      }

      return countriesList.filter((country) => {
        return (
          (debouncedSearchQuery.length < 3 &&
            country.code.toLocaleLowerCase().includes(debouncedSearchQuery.toLocaleLowerCase())) ||
          country.name.toLocaleLowerCase().includes(debouncedSearchQuery.toLocaleLowerCase())
        );
      });
    }, [debouncedSearchQuery, countriesList]);

    const value = useMemo(() => {
      if (country) {
        return `${countryFlag} ${country}`;
      }

      return 'Please select a country';
    }, [country, countryFlag]);

    useEffect(() => {
      if (country) {
        const matchedCountry = countries.find(
          (c) => c.name.toLocaleLowerCase() === country.toLocaleLowerCase()
        );

        if (matchedCountry) {
          setCountryFlag(matchedCountry.flag);
        }
      }
    }, []);

    return (
      <View>
        <TextInput
          right={<TextInput.Icon icon="chevron-down" />}
          {...rest}
          disabled={disabled}
          editable={editable}
          onChangeText={setCountry}
          value={value}
        />
        <TouchableRipple
          disabled={disabled || !editable}
          style={[styles.ripple]}
          onPress={() => setVisible(true)}
        >
          <Text> </Text>
        </TouchableRipple>
        <Portal>
          <Modal
            contentContainerStyle={styles.flex1}
            visible={visible}
            onDismiss={() => setVisible(false)}
          >
            <Surface style={styles.countries}>
              <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
              <DataTable style={styles.flex1}>
                <FlatList
                  data={searchResult}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <DataTable.Row
                      onPress={() => {
                        setCountry(item.name);
                        setCountryFlag(item.flag);
                        setVisible(false);
                      }}
                    >
                      <DataTable.Cell>{`${item.flag}     ${item.name}`}</DataTable.Cell>
                    </DataTable.Row>
                  )}
                />
              </DataTable>
            </Surface>
          </Modal>
        </Portal>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  flex1: {
    flex: 1,
  },
  countries: {
    padding: 16,
    flex: 1,
  },
});
