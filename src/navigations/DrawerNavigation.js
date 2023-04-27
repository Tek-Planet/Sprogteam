import 'react-native-gesture-handler';
import React, {useEffect} from 'react';

import {createDrawerNavigator} from '@react-navigation/drawer';

// screens
import {DrawerContent} from './DrawerContent';
import BottomTab from './BottomTab';
import OtherNavigation from './OtherNavigation';

import {useWindowDimensions} from 'react-native';

//init stack

const Drawer = createDrawerNavigator();

const DrawerScreen = ({navigation}) => {
  const dimensions = useWindowDimensions();
  return (
    <Drawer.Navigator
      screenOptions={{
        // drawerType: dimensions.width >= 768 ? 'permanent' : 'front',
        drawerPosition: 'right',
        headerShown: false,
      }}
      // drawerType={dimensions.width >= 608 ? 'permanent' : 'front'}
      drawerContent={props => <DrawerContent {...props} />}>
      <Drawer.Screen navs={navigation} name="Tab" component={BottomTab} />
    </Drawer.Navigator>
  );
};

export default DrawerScreen;
