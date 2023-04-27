import React, {useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTab from './DrawerNavigation';
import OtherNavigation from './OtherNavigation';
import messaging from '@react-native-firebase/messaging';
import {useNavigation} from '@react-navigation/native';

const RootStack = createNativeStackNavigator();

const OtherStackScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = () => {
    var unsubscribe = messaging().onNotificationOpenedApp(remoteMessage => {
      if (
        remoteMessage.notification.title.includes('new message from') &&
        remoteMessage.data !== undefined
      ) {
        const data = remoteMessage.data;

        navigation.navigate('OtherNav', {
          screen: 'ChatScreen',
          params: {
            info: data,
            inboxID: data.inboxID,
            type: 2,
          },
        });
      }
      if (
        remoteMessage.notification.title.includes('Booking Notification') &&
        remoteMessage.data !== undefined
      ) {
        const data = remoteMessage.data;

        navigation.navigate('OtherNav', {
          screen: 'BookingDetails',
          params: {
            reload: true,
            bookingId: parseInt(data.bookingId),
          },
        });
      }
    });

    unsubscribe = messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          const data = remoteMessage.data;

          navigation.navigate('OtherNav', {
            screen: 'ChatScreen',
            params: {
              info: data,
              inboxID: data.inboxID,
              type: 2,
            },
          });
        }
      });

    return unsubscribe;
  };
  return (
    <RootStack.Navigator screenOptions={{headerShown: false}}>
      <RootStack.Screen name="Drawer" component={BottomTab} />
      <RootStack.Screen name="OtherNav" component={OtherNavigation} />
    </RootStack.Navigator>
  );
};

export default OtherStackScreen;
