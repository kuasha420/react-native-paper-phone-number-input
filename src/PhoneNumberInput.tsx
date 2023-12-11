import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
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
import type { TextInputProps } from 'react-native-paper';
import { getCountryByCode } from './utils';
import { FlatList } from 'react-native';
import { countries } from './data/countries';

export interface PhoneNumberInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  code?: string;
  setCode: React.Dispatch<React.SetStateAction<string | undefined>>;
  phoneNumber?: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  code = '##',
  setCode,
  phoneNumber = '',
  setPhoneNumber,
  // Prpos from TextInput that needs special handling
  disabled,
  // rest of the props
  ...rest
}) => {
  // States for the modal
  const [visible, setVisible] = useState(false);

  // States for the searchbar
  const [searchQuery, setSearchQuery] = useState('');

  const country = getCountryByCode(code);

  const onChangePhoneNumber = (text: string) => {
    const value = text.split(' ')[2];
    setPhoneNumber(value);
  };

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
        {...rest}
        disabled={disabled}
        onChangeText={onChangePhoneNumber}
        value={`${country.flag} ${country.dialCode} ${phoneNumber}`}
      />
      <TouchableRipple
        disabled={disabled}
        style={[styles.ripple, { width }]}
        onPress={() => setVisible(true)}
      >
        <Text> </Text>
      </TouchableRipple>
      <Portal>
        <Modal
          contentContainerStyle={styles.modalStyle}
          visible={visible}
          onDismiss={() => setVisible(false)}
        >
          <Surface style={styles.countries}>
            <Searchbar placeholder="Search" onChangeText={setSearchQuery} value={searchQuery} />
            <DataTable>
              <DataTable.Header>
                <DataTable.Title>Country</DataTable.Title>
                <DataTable.Title numeric>Dial Code</DataTable.Title>
              </DataTable.Header>
              <FlatList
                data={countries}
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
};

const styles = StyleSheet.create({
  ripple: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
  },
  modalStyle: {
    flex: 1,
  },
  countries: {
    padding: 16,
    flex: 1,
  },
});
