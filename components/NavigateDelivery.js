import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
// import CompassHeading from 'react-native-compass-heading';
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
                    this.updateCurrentLatlong()
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
                this.setState({ "accuracy": position.coords.accuracy })
                this.setMapOrigin(position.coords)
                this.map.fitToCoordinates(this.state.waypoints, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })
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

    setCurrentLocation = async (coords) => {
        console.log("setCurrentLocation()  -- called")
        if (!this.state.origin) { return; }  //When origin is null
        getDistance(
            { latitude: coords.latitude, longitude: coords.longitude },
            { latitude: this.state.origin.currentLatitude, longitude: this.state.origin.currentLongitude }
        ) > this.state.pathRefreshDistance ?
            this.setMapOrigin(coords) :
            this.setState({
                latlong: { "currentLatitude": coords.latitude, "currentLongitude": coords.longitude },
                camHead: coords.speed > 0.5 ? coords.heading : this.state.compasHead,
                speed: coords.speed
            })
        this.setCameraFocus()
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

    getCurrentLocation = () => ({
        latitude: this.state.latlong.currentLatitude,
        longitude: this.state.latlong.currentLongitude,
        latitudeDelta: 0.01,//0.01155,
        longitudeDelta: 0.01//0.01155
    });

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

    setCameraFocus = () => {
        this.map.animateCamera({
            center: { latitude: this.state.latlong.currentLatitude, longitude: this.state.latlong.currentLongitude },
            pitch: this.state.camPitch,
            heading: this.state.camHead,
            zoom: this.state.camZoom
        }, { duration: this.state.camAnimationDuration })
    }

    startOrStopInterval() {
        if (this.state.enableNavivgation && this.trackIntervalId === null) {
            this.trackIntervalId = setInterval(() => {
                this.updateCurrentLatlong()
            }, this.state.trackInterval)
        } else if (!this.state.enableNavivgation && this.trackIntervalId !== null) {
            if (this.trackIntervalId !== null) {
                clearInterval(this.trackIntervalId);
                this.trackIntervalId = null
            }
        }
    }

    constructor(props) {
        super(props);
        // this.mapRef = null
        this.state = {
            pathRefreshDistance: 200,  //  Google suggestion path with update only afte covering this distance in meter.
            origin: null,           //  Origin is the starting cord and it updates after each "pathRefreshDistance" coverage.
            enableNavivgation: false,    //  true : Navigation mood & false : Static mood
            latlong: { currentLatitude: 22.5726, currentLongitude: 88.3639 },
            camPitch: 90,             // The camera viewing angle.
            camHead: 0,             // Viewing direction of camera(in degree).
            camZoom: 20,             // Camera zooming value.
            compasHead: 90,             // Angle of the compass head.
            trackIntervalId: null,
            trackInterval: 5000,
            virtualPoints: [],
            vartualPointInterval: 2,
            camAnimationDuration: 1000,
            accuracy: null,
            speed: 0,
            waypoints: [
                { title: "Airport", latitude: 22.6531, longitude: 88.4449 },
                { title: "Unitech", latitude: 22.5771, longitude: 88.4828 },
                { title: "City center 2", latitude: 22.6226, longitude: 88.4503 },
                { title: "Baguihati", latitude: 22.6138, longitude: 88.4306 },
                { title: "Collegemore", latitude: 22.5746, longitude: 88.4342 }
            ],
            destination: {
                title: "Unitech",
                latitude: 22.5771,
                longitude: 88.4828
            }
        };
    }

    componentDidMount() {
        this.locationAccessAndSetOriginAndRegion()
    }

    // componentDidUpdate() {
    // CompassHeading.start(3, ({ heading, accuracy }) => {
    //     this.setState({ compasHead: heading })
    //     // this.setCameraFocus()
    //     CompassHeading.stop();
    // })
    // }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>
                <MapView
                    ref={(map) => { this.map = map; }}
                    onLayout={() => this.map.fitToCoordinates(this.state.waypoints, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}

                    initialCamera={{
                        center: {
                            latitude: this.state.latlong.currentLatitude,
                            longitude: this.state.latlong.currentLongitude,
                        },
                        pitch: this.state.camPitch,
                        heading: this.state.camHead,
                        zoom: this.state.camZoom
                    }}

                    userLocationUpdateInterval={this.state.trackInterval}
                    showsMyLocationButton={true}//{this.state.enableNavivgation}
                    showsUserLocation={true}//{this.state.enableNavivgation}
                    // followsUserLocation={true}//{this.state.enableNavivgation}
                    userLocationPriority='balanced' // 'balanced' | 'high' | 'low' | 'passive';
                    onUserLocationChange={locationChangedResult => {
                        // console.log(locationChangedResult)
                        if (this.state.enableNavivgation) {
                            this.setCurrentLocation(locationChangedResult.nativeEvent.coordinate)
                        }
                    }}
                    toolbarEnabled={true}
                    // liteMode = {true}
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
                    style={this.state.enableNavivgation ? styles.navStyle : styles.staticStyle}
                >
                    {/* <Marker coordinate={{ title: "Baguihati", latitude: 22.6138, longitude: 88.4306, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Unitech", latitude: 22.5771, longitude: 88.4828, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Airport", latitude: 22.6531, longitude: 88.4449, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "City center 2", latitude: 22.6226, longitude: 88.4503, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                    <Marker coordinate={{ title: "Collegemore", latitude: 22.5746, longitude: 88.4342, latitudeDelta: 0.4, longitudeDelta: 0.1, }} /> */}

                    {
                        this.state.waypoints.map((coord, index) => {
                            return <Marker key={index} coordinate={{ title: "Test", latitude: coord.latitude, longitude: coord.longitude }} />

                        })
                    }

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
                        mode='DRIVING'//'WALKING'
                        // splitWaypoints={true}
                        apikey="AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
                        strokeWidth={6}
                        optimizeWaypoints={true}
                        origin={this.getMapOrigin()}
                        waypoints={this.state.waypoints}
                        destination={this.state.destination}
                        onReady={result => {
                            console.log(`Distance: ${result.distance} km`)
                        }}
                    />
                </MapView>
                <TouchableOpacity activeOpacity={.5}
                    onPress={() => {
                        this.setState({
                            enableNavivgation: !this.state.enableNavivgation
                        })
                        // this.setCameraFocus()
                    }}
                    style={this.state.enableNavivgation ? { top: "45%" } : { top: "45%", left: "45%" }}
                >
                    <Image source={require('./Navigation-04.png')} style={{ height: 35, width: 35 }} />
                </TouchableOpacity>

                <Text style={{ fontSize: 20 }}>Clat : {this.state.latlong.currentLatitude}</Text>
                <Text style={{ fontSize: 20 }}>Clong : {this.state.latlong.currentLongitude}</Text>
                <Text style={{ fontSize: 20 }}>Accuracy : {this.state.accuracy}</Text>
                <Text style={{ fontSize: 20 }}>Speed : {this.state.speed}</Text>

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
    staticStyle: {
        // transform: [{ rotate: '90deg' }],
        position: 'absolute',
        width: "100%",
        height: "100%",
        top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,
    },
    navStyle: {
        position: 'absolute',
        width: "100%",
        height: "165%",
        top: 0
    }



});


