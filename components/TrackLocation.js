import React, { Component } from 'react';
import Geolocation from '@react-native-community/geolocation';
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
                const interval = setInterval(() => {

                    getOneTimeLocation()


                }, 30000);
            } else {
                console.log('Permission Denied');
            }
        } catch (err) {
            console.warn(err);
        }
    }
};


export default class TrackLocation extends Component {

    constructor(props) {
        super(props);
        const granted = PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
            {
                title: 'Location Access Required',
                message: 'This App needs to Access your location',
            },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
            const interval = setInterval(() => {
                Geolocation.getCurrentPosition(
                    (position) => {
                        const currentLongitude = position.coords.longitude;
                        const currentLatitude = position.coords.latitude;
                        this.props.latlong = { lat: currentLatitude, long: currentLongitude }
                        console.log(this.props.latlong)
                    },
                    (error) => {
                        console.log(error.message);
                    },
                    {
                        enableHighAccuracy: false,
                        timeout: 30000,
                        maximumAge: 1000
                    },
                );
            }, 3000);
        } else {
            console.log('Permission Denied');
        }
        console.log("Constructor initiated")
    }

    componentDidMount() {
        console.log("Compount mounted")
    }

    render() {
        return (
            <View>
                <Text> {this.props.latlong} </Text>
            </View>
        );
    }
}
