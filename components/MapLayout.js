
// React Native Geolocation
// https://aboutreact.com/react-native-geolocation/
// import React in our code
import React, { useState, useEffect, useLayoutEffect } from 'react';
import MapView, { Marker, Polyline } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
//import all the components we are going to use.
import Geolocation from '@react-native-community/geolocation';
import GetLocation from 'react-native-get-location'

// import all the components we are going to use
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

const App = () => {


    const [currentLatitude, setCurrentLatitude] = useState(22.6531);
    const [currentLongitude, setCurrentLongitude] = useState(88.4449);

    const [locationStatus, setLocationStatus] = useState('');



    useEffect(() => {
        const requestLocationPermission = async () => {
            if (Platform.OS === 'ios') {
                getOneTimeLocation();
                subscribeLocationLocation();
            } else {
                try {
                    const granted = await PermissionsAndroid.request(
                        PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                        {
                            title: 'Location Access Required',
                            message: 'This App needs to Access your location',
                        },
                    );
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        //To Check, If Permission is granted
                        const interval = setInterval(() => {
                            getOneTimeLocation();
                        }, 3000);
                    } else {
                        setLocationStatus('Permission Denied');
                    }
                } catch (err) {
                    console.warn(err);
                }
            }
        };
        requestLocationPermission();
        return () => {
            // Geolocation.clearWatch(watchID);
        };
    }, []);
    const getOneTimeLocation = () => {
        setLocationStatus('Getting Location ...');
        Geolocation.getCurrentPosition(
            //Will give you the current location
            (position) => {
                setLocationStatus('You are Here');

                //getting the Longitude from the location json
                const currentLongitude = position.coords.longitude;

                //getting the Latitude from the location json
                const currentLatitude = position.coords.latitude;

                //Setting Longitude state
                setCurrentLongitude(currentLongitude);

                //Setting Longitude state
                setCurrentLatitude(currentLatitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                timeout: 30000,
                maximumAge: 1000
            },
        );
    };

    const subscribeLocationLocation = () => {
        watchID = Geolocation.watchPosition(
            (position) => {
                //Will give you the location on location change

                setLocationStatus('You are Here');
                console.log(position);

                //getting the Longitude from the location json        
                const currentLongitude =
                    JSON.stringify(position.coords.longitude);

                //getting the Latitude from the location json
                const currentLatitude =
                    JSON.stringify(position.coords.latitude);

                //Setting Longitude state
                setCurrentLongitude(currentLongitude);

                //Setting Latitude state
                setCurrentLatitude(currentLatitude);
            },
            (error) => {
                setLocationStatus(error.message);
            },
            {
                enableHighAccuracy: false,
                maximumAge: 1000
            },
        );
    };





    return (
        <SafeAreaView style={{ flex: 1 }}>
            <Text>{currentLatitude}</Text>
            <Text>{currentLongitude}</Text>







            {/*             
            <MapView
                style={styles.mapStyle}
                initialRegion = {{
                    latitude: currentLatitude,
                    longitude: currentLongitude,
                    latitudeDelta: 0.4,
                    longitudeDelta: 0.1
                }}

                loadingEnabled={true}
                zoomEnabled={true}
                scrollEnabled={true}
                showsScale={true}
                zoomControlEnabled={true}
                rotateEnabled={true}
                scrollDuringRotateOrZoomEnabled={true}
                // region={{
                //     latitude: 22.5726,
                //     longitude: 88.3639,
                //     latitudeDelta: 0.4,
                //     longitudeDelta: 0.1,
                // }}
            >
                <Marker animateMarkerToCoordinate coordinate={{ title: "Current location", latitude: currentLatitude, longitude: currentLongitude }}>
                    <Image source={require('./Navigation-04.png')} style={{height: 35, width:35 }} />
                </Marker>
                <Marker coordinate={{ title: "Baguihati", latitude: 22.6138, longitude: 88.4306, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                <Marker coordinate={{ title: "Unitech", latitude: 22.5771, longitude: 88.4828, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                <Marker coordinate={{ title: "Airport", latitude: 22.6531, longitude: 88.4449, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                <Marker coordinate={{ title: "City center 2", latitude: 22.6226, longitude: 88.4503, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                <Marker coordinate={{ title: "Collegemore", latitude: 22.5746, longitude: 88.4342, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />

                <MapViewDirections
                    apikey="AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
                    strokeWidth={2}
                    optimizeWaypoints={true}
                    origin={{
                        title: "Airport",
                        latitude: 22.6417405,
                        longitude: 88.4294309,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.1,
                    }}
                    waypoints={[
                        { title: "Unitech", latitude: 22.5771, longitude: 88.4828 },
                        { title: "City center 2", latitude: 22.6226, longitude: 88.4503 },
                        { title: "Baguihati", latitude: 22.6138, longitude: 88.4306 },
                        { title: "Collegemore", latitude: 22.5746, longitude: 88.4342 }
                    ]}
                    destination={{
                        title: "Airport",
                        latitude: 22.6417405,
                        longitude:  88.4294309,
                        latitudeDelta: 0.4,
                        longitudeDelta: 0.1,
                    }}

                    onReady={result => {
                        console.log(`Distance: ${result.distance} km`)
                        console.log(`Duration: ${result.duration} min.`)
                    }}
                />


            </MapView> */}

        </SafeAreaView>
    );
};

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

export default App;