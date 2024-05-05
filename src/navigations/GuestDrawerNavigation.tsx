import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

// screens
import {GuestDrawerContent} from './GuestDrawerContent';

import {useWindowDimensions} from 'react-native';
import {width} from '../utils';
import {AboutScreen, CarrerScreen, HomeScreen} from '../screens/auths';
import ServicesScreen from '../screens/ClientScreens/ServicesScreen';

//init stack

export type GusestStackParams = {
  Home: undefined;
  About: undefined;
  Carrer: undefined;
  GuestServices: undefined;
};

const Drawer = createDrawerNavigator<GusestStackParams>();

const GuestDrawerNavigation = () => {
  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'front',
        // drawerPosition: 'right',
        headerShown: false,
        drawerStyle: {
          width: width * 0.8,
        },
      }}
      // drawerType={dimensions.width >= 608 ? 'permanent' : 'front'}
      drawerContent={props => <GuestDrawerContent {...props} />}>
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="About" component={AboutScreen} />
      <Drawer.Screen name="GuestServices" component={ServicesScreen} />
      <Drawer.Screen name="Carrer" component={CarrerScreen} />
    </Drawer.Navigator>
  );
};

export default GuestDrawerNavigation;
