import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline, Geojson } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CompassHeading from 'react-native-compass-heading';
import { getDistance } from 'geolib';
import {
    SafeAreaView,
    View,
    Text,
    StyleSheet,
    Image,
    PermissionsAndroid,
    Platform,
    Button,
    TouchableOpacity,
    PROVIDER_GOOGLE
} from 'react-native';

const delay = ms => new Promise(
    resolve => setTimeout(resolve, ms)
);

class NavigateDelivery extends Component {
    locationAccessAndSetOriginAndRegion = async () => {
        if (Platform.OS === 'ios') {
            // getOneTimeLocation();
            // subscribeLocationLocation();
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
                    const interval = setInterval(() => {
                        this.updateCurrentLatlong()
                    }, 1000);

                    while (this.state.origin === null) {
                        this.updateCurrentLatlong()
                        await delay(500);
                    }

                } else {
                    console.log('Permission Denied');
                }
            } catch (err) {
                console.warn(err);
            }
        }
    };

    updateCurrentLatlong = () => {
        Geolocation.getCurrentPosition(
            (position) => {
                if (this.state.origin !== null) {
                    this.setCurrentLocation(position.coords)
                    if (getDistance(
                        { latitude: this.state.origin.currentLatitude, longitude: this.state.origin.currentLongitude },     //  Origin lat long.
                        { latitude: position.coords.latitude, longitude: position.coords.longitude }   // Current lat long.
                    ) > this.pathRefreshDistance) {
                        this.setMapOrigin(position.coords)
                    }
                } else {
                    this.setMapOrigin(position.coords)
                    if (this.state.origin !== null) {
                        this.setNavigation(false)
                    }
                }
            },
            (error) => {
                console.log(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 30000,
                maximumAge: 1000
            },
        );
        return this.state.latlong
    }

    getCurrentLocation = () => ({
        latitude: this.state.latlong.currentLatitude,
        longitude: this.state.latlong.currentLongitude,
        latitudeDelta: 0.01,//0.01155,
        longitudeDelta: 0.01//0.01155
    });

    setCurrentLocation = (coords) => {
        if (this.state.enableNavivgation && coords.speed > 0) {
            this.setState({
                latlong: {
                    "currentLatitude": coords.latitude,
                    "currentLongitude": coords.longitude
                },
                camHead: coords.heading,
            })
        }
    }

    getMapOrigin = () => {
        if (this.state.origin === null) {
            return null
        } else {
            return {
                latitude: this.state.origin.currentLatitude,
                longitude: this.state.origin.currentLongitude,
            };
        }
    }

    setMapOrigin = (coords) => {
        this.setState({
            origin: {
                "currentLatitude": coords.latitude,
                "currentLongitude": coords.longitude
            },
            latlong: {
                "currentLatitude": coords.latitude,
                "currentLongitude": coords.longitude
            }
        })
    }

    setCameraFocus = (head, lat, lon) => {
        this.map.animateCamera({
            center: {
                latitude: lat,
                longitude: lon
            },
            pitch: this.state.camPitch,
            heading: head,
            zoom: this.state.camZoom
        }, { duration: 1000 })

    }

    setNavigation = (navState) => {
        if (navState) {
            this.setState({
                enableNavivgation: navState,
                camPitch: 90,
                camZoom: 18,
            })
        } else {
            this.setState({
                enableNavivgation: navState,
                camPitch: 0,
                camZoom: 12,
            })
        }
    }

    constructor(props) {
        super(props);
        this.state = {
            pathRefreshDistance: 200,  //  Google suggestion path with update only afte covering this distance in meter.
            origin: null,           //  Origin is the starting cord and it updates after each "pathRefreshDistance" coverage.
            enableNavivgation: true,    //  true : Navigation mood & false : Static mood
            latlong: { currentLatitude: 22.5726, currentLongitude: 88.3639 },
            camPitch: 90,             // The camera viewing angle.
            camHead: 0,             // Viewing direction of camera(in degree).
            camZoom: 18,             // Camera zooming value.
            compasHead: 90,             // Angle of the compass head.
        };
    }

    componentDidMount() {
        this.locationAccessAndSetOriginAndRegion()
    }

    componentDidUpdate() {
        // CompassHeading.start(3, ({ heading, accuracy }) => {
        //     if (this.state.camHead !== heading) {
        //         this.setState({ compasHead: heading })
        //         this.setCameraFocus(heading, this.state.latlong.currentLatitude, this.state.latlong.currentLongitude)
        //     }
        //     CompassHeading.stop();
        // })
        this.map.animateCamera({
            center: {
                latitude: this.state.latlong.currentLatitude,
                longitude: this.state.latlong.currentLongitude
            },
            pitch: this.state.camPitch,
            heading: this.state.camHead,
            zoom: this.state.camZoom
        }, { duration: 1000 })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <MapView
                    ref={(map) => { this.map = map; }}
                    initialCamera={{
                        center: {
                            latitude: this.state.latlong.currentLatitude,
                            longitude: this.state.latlong.currentLongitude,
                        },
                        pitch: this.state.camPitch,
                        heading: this.state.camHead,
                        zoom: this.state.camZoom
                    }}

                    // onUserLocationChange={locationChangedResult => 
                    //     // console.log(locationChangedResult, "&&&&&&&&&&")
                    //     this.setCurrentLocation(locationChangedResult)
                    // }
                    // userLocationUpdateInterval = {1000}
                    showsMyLocationButton={!this.state.enableNavivgation}
                    showsUserLocation={!this.state.enableNavivgation}
                    followsUserLocation={!this.state.enableNavivgation}

                    // onPress={console.log('triggering onPress')}
                    // onPanDrag={console.log('triggering onPanDrag')}
                    // rotateEnabled = {tru}
                    // onUserLocationChange={locationChangedResult => console.log(locationChangedResult.nativeEvent.coordinate.latitude, "#################")}

                    // onLayout={() => this.mapRef.fitToCoordinates(this.state.latlong, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
                    // region={this.getCurrentLocation()}
                    // cacheEnabled = {true}
                    // toolbarEnabled={true}
                    // loadingEnabled={true}
                    provider={PROVIDER_GOOGLE}
                    showsCompass={true}
                    showsBuildings={true}
                    moveOnMarkerPress={true}
                    compassOffset={true}
                    style={[styles.mapStyle,]}
                >
                    <Marker coordinate={{ title: "Baguihati", latitude: 22.6138, longitude: 88.4306, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Unitech", latitude: 22.5771, longitude: 88.4828, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Airport", latitude: 22.6531, longitude: 88.4449, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "City center 2", latitude: 22.6226, longitude: 88.4503, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Collegemore", latitude: 22.5746, longitude: 88.4342, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    {/* <Marker
                        // animateMarkerToCoordinate
                        flat = {true}
                        tracksViewChanges = {true}
                        rotation = {90}//{this.state.compasHead}
                        coordinate={{ title: "Current location", latitude: this.state.latlong.currentLatitude, longitude: this.state.latlong.currentLongitude }}
                    >
                        <Image source={require('./Navigation-04.png')} style={{ height: 35, width: 35 }} />
                    </Marker> */}
                    <MapViewDirections
                        // precision = 'high'
                        resetOnChange={false}
                        // timePrecision = 'now'
                        mode='WALKING'
                        splitWaypoints={true}
                        apikey="AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
                        strokeWidth={5}
                        optimizeWaypoints={true}
                        origin={this.getMapOrigin()}
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
                        }}
                    />
                </MapView>
                <TouchableOpacity activeOpacity={.5}
                    onPress={() => this.setNavigation(!this.state.enableNavivgation)}
                    style={this.state.enableNavivgation ? { top: "28%" } : { top: "45%", left: "45%" }}>
                    <Image source={require('./Navigation-04.png')} style={{ height: 35, width: 35 }} />
                </TouchableOpacity>
            </SafeAreaView>
        );
    }
}

export default NavigateDelivery;

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
        // transform: [{ rotate: '90deg' }],
        position: 'absolute',
        width: "100%",
        height: "150%",
        top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,

    }
});


