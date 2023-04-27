import React, {useEffect, useContext, useState} from 'react';
import {
  Alert,
  FlatList,
  Linking,
  PermissionsAndroid,
  Platform,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from 'react-native';
import TranlatorsList from '../components/TranlatorsList';
import Geolocation from 'react-native-geolocation-service';
import {fonts} from '../assets/fonts';
import appConfig from '../../app.json';
import Indicator from '../components/ActivityIndicator';
import {AuthContext} from '../context/AuthProvider';
import ErrorMsg from '../components/ErrorMsg';
import Button from '../components/Button';
// import getDistance from 'geolib/es/getDistance';
import {decodeLocationByCoordinates, calculateDistance} from '../util/util';

export default function App({navigation}) {
  const {translators, translatorsList, user, setTranslatorsList} =
    useContext(AuthContext);

  const [forceLocation, setForceLocation] = useState(false);
  const [highAccuracy, setHighAccuracy] = useState(false);
  const [myLocation, setMyLocation] = useState(null);

  const [useLocationManager, setUseLocationManager] = useState(false);
  const [location, setLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getLocation();
  }, []);

  const onRefresh = () => {
    setLoading(true);
    getLocation();
  };

  const filterTranslatorsByCity = async address => {
    var list = [];
    let trans;
    for (let x in translators) {
      translators[x].info.Adresse;
      if (
        translators[x].info.City !== null &&
        address.toLowerCase().includes(translators[x].info.City.toLowerCase())
      ) {
        list.push(translators[x].info);
      }
    }
    setTranslatorsList(list);
    setLoading(false);
  };

  const filterTranslators = async position => {
    var list = [];
    let trans;
    for (let x in translators) {
      let add = translators[x].info.Adresse + ' ' + translators[x].info.City;
      const res = await calculateDistance(position, add);
      trans = translators[x].info;
      trans.distance = res.rows[0].elements[0].distance;
      if (trans.distance.value < 1000000) list.push(trans);
    }

    list.sort(function (x, y) {
      return trans.distance.value - trans.distance.value;
    });

    setTranslatorsList(list);
    setLoading(false);
  };

  const hasPermissionIOS = async () => {
    // const openSetting = () => {
    //   Linking.openURL('app-settings:{1}').catch(() => {
    //     setError('Unable to open settings');
    //     setLoading(false);
    //   });
    // };
    const status = await Geolocation.requestAuthorization('whenInUse');

    if (status === 'granted') {
      return true;
    }

    if (status === 'denied') {
      setError('Location permission denied');
      setLoading(false);
    }

    if (status === 'disabled') {
      Alert.alert(
        `Turn on Location Services to allow "${appConfig.displayName}" to determine your location.`,
        '',
        [
          {text: 'Go to Settings', onPress: Linking.openSettings()},
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
      return;
    }

    // 23 Miracle Street, Umurolu 500102, Port Harcourt, Nigeria
    // Station Rd, Umurolu 500102, Port Harcourt, Nigeria
    //E - W Rd, Umurolu 500102, Port Harcourt, Nigeria
    Geolocation.getCurrentPosition(
      async position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        // const dummyPosition = {lat: 57.046259, lng: 9.873945};

        const res = await decodeLocationByCoordinates(pos);
        // we intialise address to user address incase the location decoder return null, so the user address will be used
        var add = user.profile.Adresse + ' ' + user.profile.City;
        // filterTranslators(add);

        if (res !== null) add = res[0].formattedAddress;
        setMyLocation(add);
        filterTranslatorsByCity(add);

        // console.log(pos);
      },
      error => {
        setError('Unable to decode your loation');
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

  const listEmpty = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 50,
        }}>
        {error === null ? (
          !loading && (
            <Text
              style={{
                color: '#000',

                margin: 10,
                fontFamily: fonts.bold,
              }}>
              No match found for your location
            </Text>
          )
        ) : (
          <View
            style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
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
  };

  return (
    <View style={styles.mainContainer}>
      {/* <Header /> */}
      {/* {loading ? (
        <Indicator color={'#659ED6'} show={loading} size={'large'} />
      ) : ( */}
      <FlatList
        refreshing={loading}
        onRefresh={onRefresh}
        ListHeaderComponent={
          myLocation !== null && (
            <Text style={styles.myLocation}>
              Showing translators around {myLocation}
            </Text>
          )
        }
        ListEmptyComponent={listEmpty}
        keyExtractor={item => item.Email}
        data={translatorsList}
        renderItem={({item, index}) => {
          return (
            <TranlatorsList item={item} index={2} navigation={navigation} />
          );
        }}
      />
      {/* )} */}
    </View>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  filterBox: {
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textAlign: 'center',
  },
  statusText: {
    fontFamily: fonts.medium,
    color: 'green',
    fontSize: 13,
    marginTop: 10,
  },
  myLocation: {
    margin: 10,
    fontFamily: fonts.medium,
    fontSize: 15,
  },
});
