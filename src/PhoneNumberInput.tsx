import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
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
import { getCountryByCode } from './utils';
import { useDebouncedValue } from './use-debounced-value';
import type { PhoneNumberInputProps, PhoneNumberInputRef, RNPaperTextInputRef } from './types';

export const PhoneNumberInput = forwardRef<PhoneNumberInputRef, PhoneNumberInputProps>(
  (
    {
      code = '##',
      setCode,
      phoneNumber = '',
      setPhoneNumber,
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

    // States for the searchbar
    const [searchQuery, setSearchQuery] = useState('');
    const debouncedSearchQuery = useDebouncedValue(searchQuery, 300);

    const country = getCountryByCode(code);

    const textInputRef = useRef<RNPaperTextInputRef>(null);

    const onChangePhoneNumber = (text: string) => {
      const value = text.split(' ')[2];
      setPhoneNumber(value);
    };

    useImperativeHandle(ref, () => ({
      focus: () => textInputRef.current?.focus(),
      clear: () => textInputRef.current?.clear(),
      blur: () => textInputRef.current?.blur(),
      isFocused: () => textInputRef.current?.isFocused() ?? false,
      setNativeProps: (props) => textInputRef.current?.setNativeProps(props),
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
          (debouncedSearchQuery.length < 6 &&
            Number.isInteger(Number(debouncedSearchQuery)) &&
            country.dialCode.includes(debouncedSearchQuery)) ||
          country.name.toLocaleLowerCase().includes(debouncedSearchQuery.toLocaleLowerCase())
        );
      });
    }, [debouncedSearchQuery, countriesList]);

    let width = 62;

    switch (country.dialCode.length) {
      case 1:
      case 2:
        width = 62;
        break;
      case 3:
        width = 71;
        break;
      case 4:
        width = 80;
        break;
      case 5:
        width = 89;
        break;
      default:
        width = 98;
        break;
    }

    return (
      <View>
        <TextInput
          // @ts-ignore -- This type is wrong, it does not forward all the ref methods from native text input.
          ref={textInputRef}
          {...rest}
          disabled={disabled}
          editable={editable}
          onChangeText={onChangePhoneNumber}
          value={`${country.flag} ${country.dialCode} ${phoneNumber}`}
          keyboardType={keyboardType || 'phone-pad'}
        />
        <TouchableRipple
          disabled={disabled || !editable}
          style={[styles.ripple, { width }]}
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
                <DataTable.Header>
                  <DataTable.Title>Country</DataTable.Title>
                  <DataTable.Title numeric>Dial Code</DataTable.Title>
                </DataTable.Header>
                <FlatList
                  data={searchResult}
                  keyExtractor={(item) => item.code}
                  renderItem={({ item }) => (
                    <DataTable.Row
                      onPress={() => {
                        setCode(item.code);
                        setVisible(false);
                      }}
                    >
                      <DataTable.Cell>{`${item.flag}     ${item.name}`}</DataTable.Cell>
                      <DataTable.Cell numeric>{item.dialCode}</DataTable.Cell>
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
  },
  flex1: {
    flex: 1,
  },
  countries: {
    padding: 16,
    flex: 1,
  },
});
