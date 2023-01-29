import getDirections from 'react-native-google-maps-directions'
import React, { Component } from 'react';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Button,
} from 'react-native';

export default class GmapsDirections extends Component {
 
  handleGetDirections = () => {
    const data = {
       source: {
        latitude: 22.641776204109192,
        longitude: 88.42949151992798
      },
      destination: {
        latitude: 22.6636,
        longitude: 88.4273
      },
      params: [
        {
          key: "travelmode",
          value: "driving"        // may be "walking", "bicycling" or "transit" as well
        },
        {
          key: "dir_action",
          value: "navigate"       // this instantly initializes navigation using the given travel mode
        }
      ],
      waypoints: [
        {
          latitude: 22.5771,
          longitude: 88.4828 
        },
        {
          latitude: 22.6226,
          longitude: 88.4503
        },
        {
          latitude: 22.6138,
          longitude:  88.4306
        },
        {
          latitude: 22.5746,
          longitude: 88.4342
        }
      ]
    }
 
    getDirections(data)
  }
 
  render() {
    return (
      <View style={styles.container}>
        <Button onPress={this.handleGetDirections} title="Get Directions" />
      </View>
    );
  }
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'white',
        padding: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    boldText: {
        fontSize: 25,
        color: 'red',
        marginVertical: 16,
        textAlign: 'center'
    },
    mapStyle: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    }
});