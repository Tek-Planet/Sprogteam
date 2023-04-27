import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import ConfirmedScreen from '../screens/booing/ConfirmedScreen';

import HistoricScreen from '../screens/booing/HistoricScreen';

import {Text, View} from 'react-native';
import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useTranslation} from 'react-i18next';

const Tab = createMaterialTopTabNavigator();

function MyTabs() {
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#659ED6',
        tabBarInactiveTintColor: '#000000',

        tabBarLabel: ({focused, color}) => {
          let iconName;
          if (route.name === 'History') {
            iconName = focused ? 'text-box-check' : 'text-box-check-outline';
          } else if (route.name === 'Confirm') {
            iconName = focused ? 'history' : 'history';
          }

          let labelName;
          if (route.name === 'History') {
            labelName = t('navigate:archive');
          } else if (route.name === 'Confirm') {
            labelName = t('navigate:confirm');
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
      })}
      initialRouteName={'Confirm'}>
      <Tab.Screen name="Confirm" component={ConfirmedScreen} />
      <Tab.Screen name="History" component={HistoricScreen} />
    </Tab.Navigator>
  );
}

export default MyTabs;
