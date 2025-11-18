import React, {useEffect} from 'react';
import {SplashScreen} from '../screens';

import {useAppSelector, useAppDispatch} from '../rtk/hooks';
import {
  fetchUser,
  getAuthToken,
  registerDevice,
  setDefaultLanguage,
} from '../rtk/features/user/userSlice';
import {BaseNavigation} from './';
import {DefaultTheme, ExtendedTheme, NavigationContainer} from '@react-navigation/native';
import {Alert, Linking, Platform, View} from 'react-native';
import {colors} from '../assets/colors';
import {CustomStatusBar} from '../components';
import {StripeProvider} from '@stripe/stripe-react-native';
import {getStoredLanguage} from '../utils';
import messaging from '@react-native-firebase/messaging';
import VersionCheck from 'react-native-version-check';
import {
  areNotificationsEnabled,
  openNotificationSettings,
} from '../../NotificationHelper';

const Routes = () => {
  const {token, loading, user} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    updateChecker();
    requestUserPermission();
    initialiseLanguage();
    authenticateUser();
  }, []);

  const authenticateUser = async () => {
    dispatch(getAuthToken());
  };

  const initialiseLanguage = async () => {
    var response = await getStoredLanguage();
    dispatch(setDefaultLanguage(response));
  };

  useEffect(() => {
    if (token.token && token.secret) {
      // Wait for 5 seconds before dispatching the action
      // const delay = 300; // 5000 milliseconds = 5 seconds
      // const timer = setTimeout(() => {
      //   console.log('fetching user');
      //   dispatch(fetchUser());
      // }, delay);

      dispatch(fetchUser());

      // Cleanup the timer to prevent any potential memory leaks
      // return () => clearTimeout(timer);
    }
  }, [token]);

  async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL;
  }

  useEffect(() => {
    if (user && user !== null && user !== undefined) {
      getToken();
    }
  }, [user]);

  const getToken = async () => {
    try {
      await messaging().registerDeviceForRemoteMessages();

      const token = await messaging().getToken();

      // storetoken
      const body = {
        token: token.toString(),
        userId: user.Id,
        deviceType: Platform.OS,
        createdAt: new Date().getTime(),
        email: user.Id,
      };

      await dispatch(registerDevice(body));

      // console.log(response);
    } catch (error) {
      console.log(error);
    }
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
    const checkNotificationPermission = async () => {
      const enabled = await areNotificationsEnabled();
      if (!enabled) {
        Alert.alert(
          'Enable Notifications',
          'Please enable notifications in the settings to stay updated.',
          [
            {
              text: 'Cancel',
              style: 'cancel',
            },
            {
              text: 'Open Settings',
              onPress: openNotificationSettings,
            },
          ],
          {cancelable: false},
        );
      }
    };

    checkNotificationPermission();
  }, []);

  // const MyTheme: ExtendedTheme = {
  //   dark: false,
  //   colors: colors,
  // };


  const MyTheme = {
    ...DefaultTheme,
    colors:colors,
  };

  if (loading) return <SplashScreen />;

  const StripeKey =
    'pk_test_51H7dhKIIFaIFWb8DibhnahU1Fct1pIwtMI1rCppJAnn0NRJalw1x5eNZoQ6kLCcRKWsKKjsuehF1fL6QpdlQorgm00pVgb8E3d';

  return (
    <StripeProvider publishableKey={StripeKey}>
      <NavigationContainer 
       theme={MyTheme}
      >
        <View style={{flex: 1, backgroundColor:"#000000"}}>
          <CustomStatusBar />
          <BaseNavigation />
        </View>
      </NavigationContainer>
    </StripeProvider>
  );
};

export default Routes;
// com.techplanetapps.aats
// udo gem install cocoapods
// https://stackoverflow.com/questions/78114348/firebaseauth-requires-cocoapods-version-1-12-0-which-is-not-satisfied-by-your-cu
