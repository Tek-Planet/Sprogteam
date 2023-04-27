import React, {useContext, useEffect, useState} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import SplashScreen from '../screens/SplashScreen';
import MainNavigation from './MainNavigation';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';
import VersionCheck from 'react-native-version-check';
import {Linking} from 'react-native';
import {
  checkFirstLaunch,
  getAuthToken,
  getBookings,
  getDetails,
  getInbox,
  getPedingCount,
  registerDevice,
  saveLocation,
} from '../data/data';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  baseURL,
  hasLocationPermission,
  setHeaders,
  toastNew as toast,
} from '../util/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import jwt_decode from 'jwt-decode';
import messaging from '@react-native-firebase/messaging';
import {Alert, Platform} from 'react-native';
import Geolocation from 'react-native-geolocation-service';

axios.defaults.baseURL = baseURL + '/api';

const loadToken = async () => {
  const tiktok = await getAuthToken();

  if (tiktok) {
    const decodedToken = jwt_decode(tiktok.token);
    // console.log(new Date(decodedToken.exp * 1000));
    // if t
    if (decodedToken.exp * 1000 < Date.now()) {
      console.log('expire');
      //  logout user
      toast('session expired, Login you out', 'info');
      try {
        await AsyncStorage.removeItem('user');
        await AsyncStorage.removeItem('authTokens');
      } catch (e) {
        // error reading value
        console.log(e);
      }
    } else await setHeaders(tiktok.secret, tiktok.token);
  }
};

loadToken();

const Routes = () => {
  const {
    setAuth,
    user,
    setUser,
    setIsInterpreter,
    setReload,
    reload,
    reloadInbox,
    setReloadInbox,
    isLoading,
    setBookings,
    bookings,
    setIsLoading,
    setInbox,
    setFirstLaunch,
    setLocation,
    location,
    setPendingBookings,
  } = useContext(AuthContext);

  useEffect(() => {
    const interval = setInterval(() => {
      setReload(!reload);
    }, 60000);
    return () => clearInterval(interval);
  }, []);

  async function fetchData() {
    const fLaunch = await checkFirstLaunch();
    setFirstLaunch(fLaunch);

    // get userdetails
    const res = await getDetails();

    if (res.msg === 'success') {
      // onlinePresence('Online', 'online');
      setUser(res);
      // console.log('eho ', res.profile.interpreter);
      setIsInterpreter(res.profile.interpreter);
      setAuth(true);
    }

    setIsLoading(false);
  }

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
      console.log('Authorization status:', authStatus);
    }
  }

  useEffect(() => {
    updateChecker();
    requestUserPermission();
    fetchData();
  }, []);

  // backfroud operation to get booking at interval
  useEffect(() => {
    // socket = io('http://127.0.0.1:3000');
    // socket.emit("login", {userName}, "let log you")
    if (user && user !== null) {
      setReload(!reload);
      setReloadInbox(!reloadInbox);
      getToken(user.profile.Id);
      getLocation();
    }
  }, [user]);

  useEffect(() => {
    if (reload) {
      if (user !== null) reloadBooking();
    }

    if (reloadInbox) {
      refreshInbox();
    }
  }, [reload, reloadInbox]);

  async function reloadBooking() {
    const res = await getBookings(user);
    if (res.length > 0) setBookings(res);
    setReload(false);
  }

  async function refreshInbox() {
    if (user !== null) {
      const inboxRes = await getInbox(user.profile.Id);
      setInbox(inboxRes);
      setReloadInbox(false);
    }
  }

  const getToken = async userName => {
    try {
      const token = await messaging().getToken();
      // storetoken
      const body = {
        token: token.toString(),
        userId: userName,
        deviceType: Platform.OS,
        createdAt: new Date().getTime(),
        email: userName,
      };

      registerDevice(body);

      // console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  // background operation to mark booking as complete or not
  useEffect(() => {
    // markAsComplete();
    async function fetchData() {
      // You can await here
      const res = await getPedingCount(bookings, user);
      setPendingBookings(res);
    }
    if (bookings.length > 0 && user) fetchData();
  }, [bookings]);

  const updateBooking = (status, bookingId) => {
    axios
      .put(`/orders/${status}/${bookingId}`)
      .then(res => {
        if (res.data.msg === 'success') {
          console.log('success');
        } else {
          console.log('Unable to update status please try again');
        }
      })
      .catch(err => {
        console.log('from here', err);
      });
  };

  const updateChecker = async () => {
    try {
      var res = await VersionCheck.needUpdate();
      if (res !== undefined && res?.isNeeded) {
        console.log('Doing this');
        Linking.openURL(res.storeUrl); // open store if update is needed.
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    var unsubscribe = messaging().onMessage(async remoteMessage => {
      if (remoteMessage.notification.title === 'Booking Notification') {
        setReload(true);
      }

      // console.log(remoteMessage.notification.title);
    });

    // unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
    //   if (
    //     remoteMessage.notification.title.includes('new message from') &&
    //     remoteMessage.data !== undefined
    //   ) {
    //     const data = remoteMessage.data;
    //     // console.log('Go to Chats', remoteMessage.data);

    //     //  navigation.navigate(remoteMessage.data.type);

    //     navigation.navigate('OtherNav', {
    //       screen: 'ChatScreen',
    //       params: {
    //         info: data,
    //         inboxID: data.inboxID,
    //         type: 2,
    //       },
    //     });
    //   }
    // });

    return unsubscribe;
  }, []);

  useEffect(() => {
    user !== null && location !== null && !isSaving && saveMylocation();
  }, [location]);

  const [isSaving, setIsSaving] = useState(false);
  const saveMylocation = () => {
    setIsSaving(true);
    const body = {
      latitude: location.lat,
      longitude: location.lng,
      userId: user.profile.Id,
    };

    saveLocation(body);
  };

  // get user location

  const getLocation = async () => {
    const hasPermission = await hasLocationPermission();

    if (!hasPermission) {
      return;
    }

    Geolocation.getCurrentPosition(
      async position => {
        const pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        setLocation(pos);
        console.log(pos);
      },
      error => {
        Alert.alert('Unable to decode your loation');
        console.log(error);
      },
      {
        accuracy: {
          android: 'high',
          ios: 'best',
        },
        enableHighAccuracy: false,
        timeout: 15000,
        maximumAge: 10000,
        distanceFilter: 0,
        forceRequestLocation: false,
        forceLocationManager: false,
      },
    );
  };

  if (isLoading) {
    return <SplashScreen />;
  } else {
    return (
      <SafeAreaView style={{flex: 1}}>
        <NavigationContainer>
          <MainNavigation />
        </NavigationContainer>
      </SafeAreaView>
    );
  }
};

export default Routes;
// https://mobile.sprogteam.dk/api/authenticate/login
