import React from 'react'
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';
import { View } from 'react-native/types';

const containerStyle = {
    width: '400px',
    height: '400px'
};

const center = {
    lat: -3.745,
    lng: -38.523
};

function GoogleMapApi() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: "AIzaSyAZqUx9EzJsXEsJw4NKR1nuGAQQoLfj-wY"
    })

    const [map, setMap] = React.useState(null)

    const onLoad = React.useCallback(function callback(map) {
        // This is just an example of getting and using the map instance!!! don't just blindly copy!
        const bounds = new window.google.maps.LatLngBounds(center);
        map.fitBounds(bounds);

        setMap(map)
    }, [])

    const onUnmount = React.useCallback(function callback(map) {
        setMap(null)
    }, [])

    return (
        <View>
        <GoogleMap
            ref={map => {
                const bounds = new window.google.maps.LatLngBounds();

                map.fitBounds(bounds);
            }}
        />
        </View>
    )
}

export default React.memo(GoogleMapApi)