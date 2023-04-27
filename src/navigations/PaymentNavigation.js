import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import LandingPage from '../screens/payment/LandingPage';

import {Icon} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {fonts} from '../assets/fonts';

const RootStack = createNativeStackNavigator();

function PaymentNavigation({navigation}) {
  const {t} = useTranslation();

  const headerBack = location => {
    return (
      <Icon
        type={'ionicon'}
        name={'chevron-back'}
        size={26}
        onPress={() => {
          if (location) navigation.navigate(location);
          else navigation.goBack();
        }}
        color="#fff"
      />
    );
  };

  return (
    <RootStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#659ED6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: fonts.medium,
        },
      }}>
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Landing"
        component={LandingPage}
      />
    </RootStack.Navigator>
  );
}

export default PaymentNavigation;
