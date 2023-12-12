# React Native Paper Toast

🔥 Phone number number input component for React Native Paper that has a country code picker with emoji flags for speed and low footprint.

## Features

- Country code picker with emoji flags.
- Allows searching for country.
- Looks and feels consistent with React Native Paper.
- Allows specifying default country.
- Allows specifying a list of countries to show on top of the list.
- Exposes imperative methods to open and close the country code picker.
- Supports light and dark themes.
- Works well on Android, iOS and Web.

## Installation

Install with your favorite package manager.

Using Yarn:

```
yarn add react-native-paper-phone-number-input
```

Using NPM:

```
npm i react-native-paper-phone-number-input
```

## Usage

Import the `PhoneNumberInput` component from the library. You can then use it in your application like so:

```tsx
// App.tsx
import React, { useState } from 'react';
import { PhoneNumberInput, getCountryByCode } from 'react-native-paper-phone-number-input';

export default function App() {
  const [countryCode, setCountryCode] = useState<string>('BD'); // Default country code
  const [phoneNumber, setPhoneNumber] = useState<string>();

  const { name, flag, dialCode } = getCountryByCode(countryCode); // Get country details

  return (
    <PhoneNumberInput
      code={countryCode}
      setCode={setCountryCode}
      phoneNumber={phoneNumber}
      setPhoneNumber={setPhoneNumber}
    />
  );
}
```

A more complete example can be found in the `example` directory.

## API

### `PhoneNumberInput`

#### Props

| Prop              | Type                            | Description                                                                               | Notes                                                                            |
| ----------------- | ------------------------------- | ----------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------- |
| `code`            | `string`                        | The country code.                                                                         | Optional. By default, the country code is set to `##` whicch shows a world icon. |
| `setCode`         | `(code: string) => void`        | A function that sets the country code.                                                    | Required.                                                                        |
| `phoneNumber`     | `string`                        | The phone number.                                                                         | Optional. By default, no phone number is set.                                    |
| `setPhoneNumber`  | `(phoneNumber: string) => void` | A function that sets the phone number.                                                    | Required.                                                                        |
| `showFirstOnList` | `string[]`                      | A list of country codes that should be shown on top of the list.                          | Optional. By default, countries are shown alphabetically.                        |
| `...rest`         | `...TextInputProps`             | Any other props that you want to pass to the `TextInput` component of React Native Paper. | Optional.                                                                        |

#### Ref Methods

| Method Name          | Description                     |
| -------------------- | ------------------------------- |
| `openCountryPicker`  | Opens the country code picker.  |
| `closeCountryPicker` | Closes the country code picker. |

### `getCountryByCode`

```ts
type CountryWithoutCode = {
  name: string;
  flag: string;
  dialCode: string;
};

const getCountryByCode: (code?: string) => CountryWithoutCode;
```

## Design Decisions/FAQ

### How to set the default country?

You can set the default country by setting the `code` prop. This prop accepts a country code. For example, if you want to set the default country to Bangladesh, you can set the `code` prop to `BD`.

### Why set the country code instead of the dial code?

Multiple countries can have the same dial code. For example, the dial code for United States is +1 and the dial code for Canada is also +880. So, if we were to set the dial code instead of the country code, wrong flag would be shown for the country.

To solve this, this library uses the country code instead of the dial code. This library also exposes a `getCountryByCode` method that can be used to get the country details from the country code such as the dial code, country name and flag.

## Development

This project integrates with `react-native-builder-bob`. To get started:

1. Fork and Clone the repository.
2. Create your feature branch.
3. Install dependencies using `yarn`.
4. Run example project using `yarn example android`, `yarn example ios` or `yarn example web`.
5. Make your changes and create a PR!
6. Thank you.

## License

This package is licensed under the MIT License.

## Contribution

Any kind of contribution is welcome. Thanks!
