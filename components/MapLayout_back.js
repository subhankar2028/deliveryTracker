// import React from 'react';
// import MapView, {Marker, Polyline} from 'react-native-maps';
// import {SafeAreaView, StyleSheet, View} from 'react-native';
// function MapLayout() {
//     return (
//         <View style={styles.container}>
//             <MapView
//                 style={styles.mapStyle}
//                 // customMapStyle={mapStyle}
//                 // initialRegion={{
//                 //     latitude: 37.78825,
//                 //     longitude: -122.4324,
//                 //     latitudeDelta: 0.0922,
//                 //     longitudeDelta: 0.0421,
//                 // }}
//                 >
//                 {/* <Marker
//                     draggable
//                     coordinate={{
//                         latitude: 37.78825,
//                         longitude: -122.4324,
//                     }}
//                     onDragEnd={
//                         (e) => alert(JSON.stringify(e.nativeEvent.coordinate))
//                     }
//                     title={'Test Marker'}
//                     description={'This is a description of the marker'}
//                 /> */}
//             </MapView>
//         </View>
//     );
// }
// export default MapLayout;
// const mapStyle = [
//     {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
//     {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
//     {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
//     {
//       featureType: 'administrative.locality',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'poi',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'poi.park',
//       elementType: 'geometry',
//       stylers: [{color: '#263c3f'}],
//     },
//     {
//       featureType: 'poi.park',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#6b9a76'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'geometry',
//       stylers: [{color: '#38414e'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'geometry.stroke',
//       stylers: [{color: '#212a37'}],
//     },
//     {
//       featureType: 'road',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#9ca5b3'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry',
//       stylers: [{color: '#746855'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'geometry.stroke',
//       stylers: [{color: '#1f2835'}],
//     },
//     {
//       featureType: 'road.highway',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#f3d19c'}],
//     },
//     {
//       featureType: 'transit',
//       elementType: 'geometry',
//       stylers: [{color: '#2f3948'}],
//     },
//     {
//       featureType: 'transit.station',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#d59563'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'geometry',
//       stylers: [{color: '#17263c'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'labels.text.fill',
//       stylers: [{color: '#515c6d'}],
//     },
//     {
//       featureType: 'water',
//       elementType: 'labels.text.stroke',
//       stylers: [{color: '#17263c'}],
//     },
//   ];

//   const styles = StyleSheet.create({
//     container: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//       alignItems: 'center',
//       justifyContent: 'flex-end',
//     },
//     mapStyle: {
//       position: 'absolute',
//       top: 0,
//       left: 0,
//       right: 0,
//       bottom: 0,
//     },
//   });



















// import React, {useState, useEffect} from 'react';
// import {StyleSheet, Text} from 'react-native';
// import MapView, {Marker} from 'react-native-maps';
// import Geolocation from '@react-native-community/geolocation';
// async function requestPermissions() {
//     if (Platform.OS === 'ios') {
//       Geolocation.requestAuthorization();
//       Geolocation.setRNConfiguration({
//         skipPermissionRequests: false,
//        authorizationLevel: 'whenInUse',
//      });
//     }

//     if (Platform.OS === 'android') {
//       await PermissionsAndroid.request(
//         PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//       );
//     }
//   }
// const App = () => {
//   const [position, setPosition] = useState({
//     latitude: 10,
//     longitude: 10,
//     latitudeDelta: 0.001,
//     longitudeDelta: 0.001,
//   });
//   useEffect(() => {
//     Geolocation.getCurrentPosition((pos) => {
//       const crd = pos.coords;
//       setPosition({
//         latitude: crd.latitude,
//         longitude: crd.longitude,
//         latitudeDelta: 0.0421,
//         longitudeDelta: 0.0421,
//       });
//     }).catch((err) => {
//       console.log(err);
//     });
//   }, []);
//   return (
//     <MapView
//       style={styles.map}
//       initialRegion={position}
//       showsUserLocation={true}
//       showsMyLocationButton={true}
//       followsUserLocation={true}
//       showsCompass={true}
//       scrollEnabled={true}
//       zoomEnabled={true}
//       pitchEnabled={true}
//       rotateEnabled={true}>
//        <Marker
//        title='Yor are here'
//        description='This is a description'
//        coordinate={position}/>
//        </MapView>
//   );
// };
// const styles = StyleSheet.create({
//   map: {
//     ...StyleSheet.absoluteFillObject,
//   },
// });
// export default App;


















// React Native Geolocation
// https://aboutreact.com/react-native-geolocation/
// import React in our code
import React, { useState, useEffect } from 'react';
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
                            console.log(currentLatitude, currentLongitude);
                            console.log(typeof (currentLatitude), typeof (currentLongitude));
                            // subscribeLocationLocation();
                        }, 30000);
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

                {/* <Marker coordinate={{ title: "Current location", latitude: currentLatitude, longitude: currentLongitude }} /> */}
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
                        latitude: 22.6531,
                        longitude: 88.4449,
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
                        latitude: 22.6531,
                        longitude: 88.4449,
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