// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/

// Import React
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import NavigateDelivery from './components/NavigateDelivery';

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <NavigateDelivery></NavigateDelivery>
      {/* <CompasTest></CompasTest> */}
    </SafeAreaView>
  );
};
export default App;