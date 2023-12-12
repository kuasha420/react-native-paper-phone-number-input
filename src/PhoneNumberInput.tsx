import React, { forwardRef, useImperativeHandle, useMemo, useRef, useState } from 'react';
import type { TextInput as NativeTextInput } from 'react-native';
import { FlatList, StyleSheet, View } from 'react-native';
import type { TextInputProps } from 'react-native-paper';
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

type RNPaperTextInputRef = Pick<
  NativeTextInput,
  'focus' | 'clear' | 'blur' | 'isFocused' | 'setNativeProps'
>;

export interface PhoneNumberInputRef extends RNPaperTextInputRef {
  openCountryPicker: () => void;
  closeCountryPicker: () => void;
}

export interface PhoneNumberInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  code?: string;
  setCode: React.Dispatch<React.SetStateAction<string>>;
  phoneNumber?: string;
  setPhoneNumber: React.Dispatch<React.SetStateAction<string | undefined>>;
  showFirstOnList?: string[];
}

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
          onChangeText={onChangePhoneNumber}
          value={`${country.flag} ${country.dialCode} ${phoneNumber}`}
          keyboardType={keyboardType || 'phone-pad'}
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
                  data={countriesList}
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
  modalStyle: {
    flex: 1,
  },
  countries: {
    padding: 16,
    flex: 1,
  },
});
