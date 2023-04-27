import React, {useEffect, useState} from 'react';
import {
  Alert,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  ToastAndroid,
  View,
} from 'react-native';
import Button from '../components/Button';
import ErrorMsg from '../components/ErrorMsg';
import Geolocation from 'react-native-geolocation-service';
import Geocoder from 'react-native-geocoder';
import {fonts} from '../assets/fonts';
import appConfig from '../../app.json';
import Indicator from '../components/ActivityIndicator';
import MapScreen from '../screens/bottomtab/MapScreen';

export default function App({navigation, route}) {
  const {info} = route.params;

  const [forceLocation, setForceLocation] = useState(true);
  const [highAccuracy, setHighAccuracy] = useState(true);

  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [destination, setDestination] = useState(null);
  const [start, setStart] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const decodeLocationByCoordinates = (pos, name) => {
    Geocoder.geocodePosition(pos)
      .then(res => {
        setStart(res[0]);
        // console.log('stsrt', res[0]);
        decodeLocationByName(name);
      })
      .catch(err => {
        setError('Unable to decode your location please try again');
        console.log('na here', err);
        setLoading(false);
      });
  };

  const decodeLocationByName = name => {
    console.log('stop', name);
    Geocoder.geocodeAddress(name)
      .then(res => {
        setError(null);
        setDestination(res[0]);
        setLoading(false);
        //    getDistance(st, item.pos) / 1000
      })
      .catch(err => {
        setError('Unable to decode your location please try again');
        console.log(err);
        setLoading(false);
      });
  };

  const hasPermissionIOS = async () => {
    // const openSetting = () => {
    //   Linking.openSettings().catch(() => {
    //     setError('Unable to open settings');
    //     Alert.alert('Unable to open settings');
    //     setLoading(false);
    //   });
    // };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting()},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
      setError('Location permission denied');
      Alert.alert('Location permission denied');
      setLoading(false);
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: openSetting()},
          {text: "Don't Use Location", onPress: () => {}},
        ],
      );
    }

    return false;
  };

  const hasLocationPermission = async () => {
    if (Platform.OS === 'ios') {
      const hasPermission = await hasPermissionIOS();
      return hasPermission;
    }

    if (Platform.OS === 'android' && Platform.Version < 23) {
      return true;
    }

    const hasPermission = await PermissionsAndroid.check(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (hasPermission) {
      return true;
    }

    const status = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
    );

    if (status === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
    }

    if (status === PermissionsAndroid.RESULTS.DENIED) {
      setError('Location permission denied by user');
      ToastAndroid.show(
        'Location permission denied by user.',
        ToastAndroid.LONG,
      );

      setLoading(false);
    } else if (status === PermissionsAndroid.RESULTS.NEVER_ASK_AGAIN) {
      setError('Location permission revoked by user');
      ToastAndroid.show(
        'Location permission revoked by user.',
        ToastAndroid.LONG,
      );
      setLoading(false);
    }

    return false;
  };

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      setError('Location permission revoked by user');
      return;
    }

    Geolocation.getCurrentPosition(
      position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(pos);
        console.log(info.Address);
        decodeLocationByCoordinates(pos, info.Address);
      },
      error => {
        setError('Unable to decode your location please try again');
        Alert.alert(`Code ${error.code}`, error.message);
        setLocation(null);
        console.log(error);
        setLoading(false);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: highAccuracy,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: forceLocation,
        forceLocationManager: useLocationManager,
      },
    );
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Header /> */}
      {loading ? (
        <Indicator color={'#659ED6'} show={loading} size={'large'} />
      ) : error === null ? (
        <MapScreen start={start} destination={destination} />
      ) : (
        // <Text>{error} err</Text>
        <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
          <ErrorMsg error={error} />
          <View style={{width: 100}}>
            <Button
              bGcolor={'#659ED6'}
              buttonTitle={'Reload'}
              onPress={() => {
                setError(null);
                setLoading(true);
                getLocation();
              }}
            />
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  text: {
    fontFamily: fonts.medium,
    color: '#000',
    fontSize: 14,
  },

  row: {
    flexDirection: 'row',
    margin: 5,
    elevation: 1,
    padding: 10,
    borderRadius: 10,
    backgroundColor: '#F3F3F3',
  },
});
