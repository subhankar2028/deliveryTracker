import { Bubbles, DoubleBounce, Bars, Pulse } from 'react-native-loader';
import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
import MapView, { Marker, Polyline, Geojson } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CompassHeading from 'react-native-compass-heading';
import { getDistance, getRhumbLineBearing } from 'geolib';
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
                    const interval = setInterval(() => {
                        this.updateCurrentLatlong()
                        // this.setState({ enableNavivgation: !this.state.enableNavivgation })
                    }, 750);

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
                    this.setCurrentLocation({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
                    if (getDistance(
                        { latitude: this.state.origin.currentLatitude, longitude: this.state.origin.currentLongitude },
                        { latitude: this.state.latlong.currentLatitude, longitude: this.state.latlong.currentLongitude }
                    ) > 200) {
                        this.setMapOrigin({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
                    }
                } else {
                    this.setMapOrigin({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
                    this.setCurrentLocation({ "nativeEvent": { "coordinate": { "latitude": position.coords.latitude, "longitude": position.coords.longitude } } })
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



    setCurrentLocation = (locationChangedResult) => {
        if (this.state.enableNavivgation) {

            // prev_state = (this.state.latlong.currentLatitude, this.state.latlong.currentLongitude)
            // current_state = (locationChangedResult.nativeEvent.coordinate.latitude, locationChangedResult.nativeEvent.coordinate.longitude)
            // console.log(prev_state ===current_state, "###########")
            var displacement = getDistance(
                { latitude: this.state.latlong.currentLatitude, longitude: this.state.latlong.currentLongitude },
                { latitude: locationChangedResult.nativeEvent.coordinate.latitude, longitude: locationChangedResult.nativeEvent.coordinate.longitude }
            )
            if (this.state.latlong !== null) {
                if (displacement > 3) {
                    console.log(displacement, "###########")


                    this.setState({
                        camHead: getRhumbLineBearing({
                            latitude: this.state.latlong.currentLatitude,
                            longitude: this.state.latlong.currentLongitude,
                        },
                            {
                                latitude: locationChangedResult.nativeEvent.coordinate.latitude,
                                longitude: locationChangedResult.nativeEvent.coordinate.longitude
                            }),
                        latlong: {
                            "currentLatitude": locationChangedResult.nativeEvent.coordinate.latitude,
                            "currentLongitude": locationChangedResult.nativeEvent.coordinate.longitude
                        }
                    })


                    // this.setCameraFocus(this.state.camHead, this.state.latlong.currentLatitude, this.state.latlong.currentLongitude)

                    // this.map.animateCamera({
                    //     center: {
                    //         latitude: locationChangedResult.nativeEvent.coordinate.latitude,
                    //         longitude: locationChangedResult.nativeEvent.coordinate.longitude
                    //     }
                    // })
                    // this.map.animateCamera({
                    //     center: {
                    //         latitude: locationChangedResult.nativeEvent.coordinate.latitude,
                    //         longitude: locationChangedResult.nativeEvent.coordinate.longitude
                    //     },
                    //     pitch: this.state.camPitch,
                    //     heading: this.state.camHead,
                    //     zoom: this.state.camZoom
                    // }, { duration: 1000 })
                    return true
                }
            } else {
                this.setState({
                    latlong: {
                        "currentLatitude": locationChangedResult.nativeEvent.coordinate.latitude,
                        "currentLongitude": locationChangedResult.nativeEvent.coordinate.longitude
                    }
                })
                // this.setCameraFocus(this.state.camHead, this.state.latlong.currentLatitude, this.state.latlong.currentLongitude)
            }
        }
        // console.log(locationChangedResult)
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

    setMapOrigin = (locationChangedResult) => {
        this.setState({
            origin: {
                currentLatitude: locationChangedResult.nativeEvent.coordinate.latitude,
                currentLongitude: locationChangedResult.nativeEvent.coordinate.longitude
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

    toggleNavigation = () =>{
        this.setState({
            enableNavivgation : !this.state.enableNavivgation,
            camPitch : this.state.enableNavivgation ? 0:90
        })
        console.log(this.state.enableNavivgation)
    }

    constructor(props) {
        super(props);
        this.state = {
            suggestedInitCord: 0,
            enableNavivgation: false,
            origin: null,
            latlong: { currentLatitude: 22.5726, currentLongitude: 88.3639 },
            initialRegion: null,
            camPitch: 90,
            camHead: 0,
            compasHead: 90,
            camZoom: 18,
        };
    }

    componentDidMount() {
        this.locationAccessAndSetOriginAndRegion()
    }





    componentDidUpdate() {
        // CompassHeading.start(3, ({ heading, accuracy }) => {
        //     if (this.state.camHead !== heading) {
        //         // this.setState({ compasHead: heading })
        //         // this.setCameraFocus(heading, this.state.latlong.currentLatitude, this.state.latlong.currentLongitude)
        //     }
        //     // console.log("CompassHeading : ", heading)
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

                    showsMyLocationButton={true}
                    showsUserLocation={!this.state.enableNavivgation}
                    followsUserLocation={true}

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
                    style={[
                        styles.mapStyle,
                        // {
                        //     transform: [{ rotate: `${360 - this.state.camHead}deg` }],
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
                            // console.log(`Duration: ${result.duration} min.`)
                            // console.log(result, "RRRRREEEEESSSSUUUUULLLLLTTTTT")
                            this.state.suggestedInitCord = result.coordinates[0]

                        }}
                    />





                </MapView>

                <TouchableOpacity activeOpacity={.5} onPress={this.toggleNavigation} style={{top: "25%" }}>
                    <Image source={require('./Navigation-04.png')} style={{ height: 35, width: 35}} />
                </TouchableOpacity>

                {/* // : <DoubleBounce />} */}




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


