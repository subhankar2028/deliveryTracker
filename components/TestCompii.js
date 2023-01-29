import React, { Component } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
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


class TestCompii extends Component {


    render() {
        return (
            <SafeAreaView style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>

                <MapView
                    showsCompass={true}
                    showsMyLocationButton={true}
                    showsUserLocation={true}
                    // showsBuildings = {true}
                    moveOnMarkerPress={true}
                    loadingEnabled={true}
                    compassOffset={true}
                    style={styles.mapStyle}
                    initialRegion={{
                        latitude: 22.5726,
                        longitude: 88.3639,
                        latitudeDelta: 0.0922,
                        longitudeDelta: 0.0421,
                    }}
                >


                    <MapViewDirections
                        // precision = 'high'
                        // resetOnChange = {false}
                        apikey="AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
                        strokeWidth={3}
                        optimizeWaypoints={true}
                        origin={{
                            title: "Current location",
                            latitude: 22.5771,
                            longitude: 88.4828,
                            latitudeDelta: 0.4,
                            longitudeDelta: 0.1
                        }}
                        waypoints={[
                            { title: "Unitech", latitude: 22.5771, longitude: 88.4828 },
                            { title: "City center 2", latitude: 22.6226, longitude: 88.4503 },
                            { title: "Baguihati", latitude: 22.6138, longitude: 88.4306 },
                            { title: "Collegemore", latitude: 22.5746, longitude: 88.4342 }
                        ]}
                        destination={{
                            title: "Birati",
                            latitude: 22.6636,
                            longitude: 88.4273,
                            latitudeDelta: 0.4,
                            longitudeDelta: 0.1,
                        }}

                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                            console.log(`Duration: ${result.duration} min.`)
                        }}
                    />
                </MapView>
            </SafeAreaView>
        );
    }
}

export default TestCompii;



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

