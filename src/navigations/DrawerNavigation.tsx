import React from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

// screens
import {DrawerContent} from './DrawerContent';

import {useWindowDimensions} from 'react-native';
import {EmptyScreen} from '../screens/ClientScreens';
import {width} from '../utils';

//init stack

const Drawer = createDrawerNavigator();

const DrawerScreen = () => {
  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerType: 'permanent',

        // drawerPosition: 'right',
        headerShown: false,
        drawerStyle: {
          width: width * 0.8,
        },
      }}
      // drawerType={dimensions.width >= 608 ? 'permanent' : 'front'}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen name="Tab" component={EmptyScreen} />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
