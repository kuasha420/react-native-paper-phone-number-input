import { loadAsync } from 'expo-font';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import Application from './application';
import { useColorScheme } from 'react-native';
import { StatusBar } from 'expo-status-bar';

export default function App() {
  const [isLoading, setIsLoading] = useState(true);

  const colorScheme = useColorScheme();

  useEffect(() => {
    loadAsync({
      'material-community': require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialCommunityIcons.ttf'),
    }).then(() => setIsLoading(false));
  }, []);

  if (isLoading) {
    return <ActivityIndicator />;
  }

  return (
    <PaperProvider theme={colorScheme === 'dark' ? MD3DarkTheme : MD3LightTheme}>
      <StatusBar style={colorScheme === 'dark' ? 'light' : 'dark'} />
      <Application />
    </PaperProvider>
  );
}
