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
import {
  DefaultTheme,
  ExtendedTheme,
  NavigationContainer,
} from '@react-navigation/native';
import {Alert, Linking, Platform, View} from 'react-native';
import {colors} from '../assets/colors';
import {CustomStatusBar} from '../components';

import {getStoredLanguage} from '../utils';
import messaging from '@react-native-firebase/messaging';

import {
  areNotificationsEnabled,
  openNotificationSettings,
} from '../../NotificationHelper.js';

import VersionCheck from 'react-native-version-check';

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

  const updateChecker = async () => {
    try {
      var res = await VersionCheck.needUpdate();
      if (res !== undefined && res?.isNeeded) {
        Linking.openURL(res.storeUrl); // open store if update is needed.
      }
    } catch (error) {
      console.log(error);
    }
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
    colors: colors,
  };

  if (loading) return <SplashScreen />;

  return (
    <NavigationContainer theme={MyTheme}>
      <View style={{flex: 1, backgroundColor: '#000000'}}>
        <CustomStatusBar />
        <BaseNavigation />
      </View>
    </NavigationContainer>
  );
};

export default Routes;
