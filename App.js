// Integration of Google map in React Native using react-native-maps
// https://aboutreact.com/react-native-map-example/

// Import React
import React from 'react';
import {SafeAreaView, StyleSheet, View} from 'react-native';
import GmapsDirections from './components/GmapsDirections'
// import MapLayout from './components/MapLayout';
// import TrackLocation from './components/TrackLocation';
import TestPropUpdate from './components/TestPropUpdate';
import TestCompii from './components/TestCompii'
import AnimatedMarkers from './components/AnimatedMarkers';
import NavigationComp from './components/NavigationComp';
import CompasTest from './components/CompasTest'

const App = () => {
  return (
    <SafeAreaView style={{flex: 1}}>
      <TestPropUpdate></TestPropUpdate>
      {/* <CompasTest></CompasTest> */}
    </SafeAreaView>
  );
};
export default App;