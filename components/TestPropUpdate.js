import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline, Geojson } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CompassHeading from 'react-native-compass-heading';
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


class TestPropUpdate extends Component {
    locationAccessAndSetOriginAndRegion = async () => {
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

                    while (this.state.latlong === null) {
                        var x = this.updateCurrentLatlong()
                        await delay(1000);
                    }

                    const interval = setInterval(() => {
                        this.updateCurrentLatlong()
                        // this.setState({ liveUpdate: !this.state.liveUpdate })
                    }, 30000);
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
                this.setMapOrigin({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
                this.setCurrentLocation({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
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

    setCurrentLocation = (locationChangedResult) => {
        if (this.state.liveUpdate) {
            this.setState({
                latlong: {
                    "currentLatitude": locationChangedResult.nativeEvent.coordinate.latitude,
                    "currentLongitude": locationChangedResult.nativeEvent.coordinate.longitude
                }
            })
            if (this.state.latlong !== null) {
                // this.map.animateToRegion(this.getCurrentLocation(), 2000)
                this.map.animateCamera({
                    center: {
                       latitude: this.state.latlong.currentLatitude,
                       longitude: this.state.latlong.currentLongitude,
                   },
                   pitch: 80,
                   heading: this.state.compasAngle,
                   zoom: 16
                }, {duration:500})
            }
        }
    }

    getMapOrigin = () => ({
        latitude: this.state.origin.currentLatitude,
        longitude: this.state.origin.currentLongitude,
        latitudeDelta: 0.00009,//0.01155,
        longitudeDelta: 0.00009//0.01155
    });

    setMapOrigin = (locationChangedResult) => {
        this.setState({
            origin: {
                currentLatitude: locationChangedResult.nativeEvent.coordinate.latitude,
                currentLongitude: locationChangedResult.nativeEvent.coordinate.longitude
            }
        })
    }


    constructor(props) {
        super(props);
        this.state = {
            liveUpdate: true,
            origin: null,
            latlong: null,
            initialRegion: null,
            compasAngle: 0
        };
    }

    componentDidMount() {
        this.locationAccessAndSetOriginAndRegion()
    }


    componentDidUpdate() {
        CompassHeading.start(5, ({ heading, accuracy }) => {
            if (this.state.compasAngle !== heading) {
                this.setState({ compasAngle: heading })
                console.log(heading)
            }
            CompassHeading.stop();
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, justifyContent: 'center', alignItems: 'center' }}>


                {this.state.latlong ?

                    <MapView


                        ref={(map) => { this.map = map; }}
                        // camera = {{
                        //     center: {
                        //        latitude: this.state.latlong.currentLatitude,
                        //        longitude: this.state.latlong.currentLongitude,
                        //    },
                        //    pitch: 80,
                        //    heading: this.state.compasAngle,
                        //    zoom: 16
                        // }}

                        initialCamera = {{
                            center: {
                               latitude: this.state.latlong.currentLatitude,
                               longitude: this.state.latlong.currentLongitude,
                           },
                           pitch: 80,
                           heading: this.state.compasAngle,
                           zoom: 16
                        }}


                        

                       

                        onUserLocationChange={locationChangedResult => this.setCurrentLocation(locationChangedResult)}


                        // onPress={console.log('triggering onPress')}
                        // onPanDrag={console.log('triggering onPanDrag')}

                        // rotateEnabled = {tru}
                        // onUserLocationChange={locationChangedResult => console.log(locationChangedResult.nativeEvent.coordinate.latitude, "#################")}


                        // onLayout={() => this.mapRef.fitToCoordinates(this.state.latlong, { edgePadding: { top: 10, right: 10, bottom: 10, left: 10 }, animated: false })}
                        provider={PROVIDER_GOOGLE}
                        showUserLocation
                        followUserLocation
                        loadingEnabled
                        // region={this.getCurrentLocation()}

                        // cacheEnabled = {true}
                        // userLocationUpdateInterval = {500}
                        toolbarEnabled={true}
                        // showsCompass={true}
                        showsMyLocationButton={true}
                        showsUserLocation={true}
                        followsUserLocation={true}
                        // showsBuildings = {true}
                        moveOnMarkerPress={true}
                        // loadingEnabled={true}
                        // compassOffset={true}
                        style={[
                            styles.mapStyle,
                            // {
                            //     transform: [{ rotate: `${360 - this.state.compasAngle}deg` }],

                            // }
                        ]}

                    // initialRegion={this.getCurrentLocation()}
                    >

                        {/* <Geojson
                            geojson={myPlace}
                            strokeColor="red"
                            fillColor="green"
                            strokeWidth={2}
                        /> */}

                        <Marker coordinate={{ title: "Baguihati", latitude: 22.6138, longitude: 88.4306, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                        <Marker coordinate={{ title: "Unitech", latitude: 22.5771, longitude: 88.4828, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                        <Marker coordinate={{ title: "Airport", latitude: 22.6531, longitude: 88.4449, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                        <Marker coordinate={{ title: "City center 2", latitude: 22.6226, longitude: 88.4503, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />
                        <Marker coordinate={{ title: "Collegemore", latitude: 22.5746, longitude: 88.4342, latitudeDelta: 0.4, longitudeDelta: 0.1, }} />

                        {/* <Marker animateMarkerToCoordinate coordinate={{ title: "Current location", latitude: this.state.latlong.currentLatitude, longitude: this.state.latlong.currentLongitude }}>
                            <Image source={require('./Navigation-04.png')} style={{ height: 35, width: 35 }} />
                        </Marker> */}

                        <MapViewDirections
                            // precision = 'high'
                            resetOnChange={false}
                            // timePrecision = 'now'
                            mode='WALKING'
                            splitWaypoints={true}
                            apikey="AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
                            strokeWidth={3}
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
                                // console.log(`Duration: ${result.duration} min.`)

                            }}
                        />


                    </MapView>


                    : <DoubleBounce />}







            </SafeAreaView>
        );
    }
}

export default TestPropUpdate;


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
        height: "100%",
        // top: 0,
        // left: 0,
        // right: 0,
        // bottom: 0,

    }
});



