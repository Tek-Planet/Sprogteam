import React, {useState} from 'react';
import {Dimensions, StyleSheet, View, Text} from 'react-native';
import MapView from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import Ionicons from 'react-native-vector-icons/MaterialIcons';
import {fonts} from '../../assets/fonts';

const {width, height} = Dimensions.get('window');
const ASPECT_RATIO = width / height;
const LATITUDE = 37.771707;
const LONGITUDE = -122.4053769;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

const GOOGLE_MAPS_APIKEY = 'AIzaSyBTcSF4Z7oDCCEP3_CHH5oNvpgJQAc-JV0';

const Example = props => {
  const start = props.start;
  const destination = props.destination;

  const [state, setState] = useState({
    coordinates: [
      {
        latitude: start.position.lat,
        longitude: start.position.lng,
      },
      {
        latitude: destination.position.lat,
        longitude: destination.position.lng,
      },
    ],
    distance: null,
    time: null,
  });

  var mapView = null;

  const onMapPress = e => {
    setState({
      coordinates: [...this.state.coordinates, e.nativeEvent.coordinate],
    });
  };

  return (
    <View style={{flex: 1}}>
      <MapView
        initialRegion={{
          latitude: LATITUDE,
          longitude: LONGITUDE,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        style={StyleSheet.absoluteFill}
        ref={c => (mapView = c)}
        onPress={onMapPress}>
        {state.coordinates.map((coordinate, index) => (
          <MapView.Marker key={`coordinate_${index}`} coordinate={coordinate} />
        ))}
        {state.coordinates.length >= 2 && (
          <MapViewDirections
            origin={state.coordinates[0]}
            destination={state.coordinates[state.coordinates.length - 1]}
            apikey={GOOGLE_MAPS_APIKEY}
            strokeWidth={3}
            strokeColor="hotpink"
            optimizeWaypoints={true}
            onStart={params => {
              console.log(
                `Started routing between "${params.origin}" and "${params.destination}"`,
              );
            }}
            onReady={result => {
              console.log(`Distance: ${result.distance} km`);
              console.log(`Duration: ${result.duration} min.`);
              setState({
                ...state,
                distance: result.distance,
                time: result.duration,
              });
              mapView.fitToCoordinates(result.coordinates, {
                edgePadding: {
                  right: width / 20,
                  bottom: height / 20,
                  left: width / 20,
                  top: height / 20,
                },
              });
            }}
            onError={errorMessage => {
              // console.log('GOT AN ERROR');
            }}
          />
        )}
      </MapView>

      <View>
        <View style={styles.row}>
          <Ionicons
            name="my-location"
            color="#000"
            size={20}
            style={{marginEnd: 10}}
          />
          <Text style={[styles.text, {flex: 1}]}>{start.formattedAddress}</Text>
        </View>

        <View style={styles.row}>
          <Ionicons
            name="location-city"
            color="#000"
            size={20}
            style={{marginEnd: 10}}
          />
          <Text style={[styles.text, {flex: 1}]}>
            {destination.formattedAddress}
          </Text>
        </View>

        <View
          // onPress={() => navigation.navigate('OtherNav', {screen: 'General'})}
          style={styles.row}>
          {state.distance != null && (
            <Text style={[styles.text, {flex: 1}]}>
              Distance: {state.distance} km
            </Text>
          )}

          {state.time != null && (
            <Text style={[styles.text, {flex: 1}]}>
              Time: {Math.round(state.time)} Min
            </Text>
          )}
        </View>
      </View>
    </View>
  );
};

export default Example;

const styles = StyleSheet.create({
  text: {
    fontFamily: fonts.medium,
    color: '#000',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',

    elevation: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
  },
});
