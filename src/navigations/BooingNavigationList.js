import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ConfirmedScreen from '../screens/booing/ConfirmedScreenList';
import PendingScreen from '../screens/booing/PendingScreen';
import HistoricScreen from '../screens/booing/HistoryScreenList';

import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  return (
    <Tab.Navigator
      tabBarOptions={{
        activeTintColor: '#659ED6',
        inactiveTintColor: '#000000',
      }}
      screenOptions={({route}) => ({
        tabBarLabel: ({focused, color}) => {
          let iconName;
          if (route.name === 'History') {
            iconName = focused ? 'text-box-check' : 'text-box-check-outline';
          } else if (route.name === 'Booing') {
            iconName = focused ? 'history' : 'history';
          }

          let labelName;
          if (route.name === 'History') {
            labelName = 'Arkiv';
          } else if (route.name === 'Booing') {
            labelName = 'Bekræftede';
          } else {
            labelName = 'Pending';
          }

          // You can return any component that you like here!
          return (
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Ionicons
                style={{marginEnd: 5}}
                name={iconName}
                size={16}
                color={color}
              />
              <Text
                style={{
                  color: color,
                  fontFamily: 'Montserrat-Medium',
                  fontSize: 13,
                }}>
                {labelName}
              </Text>
            </View>
          );
        },
      })}>
      {/* <Tab.Screen name="Pending" component={PendingScreen} /> */}
      <Tab.Screen name="Booing" component={ConfirmedScreen} />
      <Tab.Screen name="History" component={HistoricScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;
