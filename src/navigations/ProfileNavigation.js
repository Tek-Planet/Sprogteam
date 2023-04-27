import React from 'react';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {
  FullPublicProfile,
  ProfileReview,
  GigsScreen,
} from '../screens/transprofile';

import {Text, View} from 'react-native';

import {useTranslation} from 'react-i18next';

import AntDesign from 'react-native-vector-icons/AntDesign';

const Tab = createMaterialTopTabNavigator();

function ProfileDetailsNavigation({navigation, route}) {
  const {t} = useTranslation();
  const {profile} = route.params;

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <View
        style={{
          backgroundColor: '#fff',
          flexDirection: 'row',
          padding: 3,
          alignItems: 'center',
          paddingStart: 10,
          paddingEnd: 10,
          shadowColor: 'grey',
          shadowOffset: {width: 0, height: 1},
          shadowOpacity: 0.5,
          shadowRadius: 5,
          elevation: 5,
        }}>
        <AntDesign
          name={'back'}
          size={26}
          color={'#000'}
          style={{padding: 5}}
          onPress={() => {
            navigation.navigate('Tab');
          }}
        />
      </View>

      <Tab.Navigator
        screenOptions={({route}) => ({
          tabBarActiveTintColor: '#659ED6',
          tabBarInactiveTintColor: '#000000',

          tabBarLabel: ({focused, color}) => {
            let iconName;
            if (route.name === 'ProfileDetails') {
              iconName = focused ? 'user' : 'user';
            } else if (route.name === 'ProfileReview') {
              iconName = focused ? 'star' : 'star';
            } else {
              iconName = focused ? 'dingding' : 'dingding';
            }

            let labelName;
            if (route.name === 'ProfileDetails') {
              labelName = t('navigate:ProfileDetails');
            } else if (route.name === 'ProfileReview') {
              labelName = t('navigate:rating');
            } else {
              labelName = t('navigate:gigs');
            }

            // You can return any component that you like here!
            return (
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AntDesign
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
        initialRouteName={'ProfileDetails'}>
        <Tab.Screen
          initialParams={{profile: profile}}
          name="ProfileDetails"
          component={FullPublicProfile}
        />
        <Tab.Screen
          initialParams={{profile: profile}}
          name="GiGs"
          component={GigsScreen}
        />
        <Tab.Screen
          initialParams={{profile: profile}}
          name="ProfileReview"
          component={ProfileReview}
        />
      </Tab.Navigator>
    </View>
  );
}

export default ProfileDetailsNavigation;
