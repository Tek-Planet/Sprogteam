import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import PostRequestScreen from '../screens/request/PostRequestScreen';
import MyRequestScreen from '../screens/request/MyRequestScreen';
import RequestListScreen from '../screens/request/RequestScreen';
import AppliedUsersScreen from '../screens/request/AppliedUsersScreen';
import {Icon} from 'react-native-elements';
import {useTranslation} from 'react-i18next';
import {fonts} from '../assets/fonts';

const RootStack = createNativeStackNavigator();

function RequestStackScreen({navigation}) {
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
          headerLeft: () => headerBack(null),
          title: t('common:add') + ' ' + t('common:requests'),
        }}
        name="Request"
        component={PostRequestScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:my') + ' ' + t('common:requests'),
        }}
        name="RequestList"
        component={MyRequestScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:customer') + ' ' + t('common:requests'),
        }}
        name="Requests"
        component={RequestListScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: 'Translators',
        }}
        name="AppliedUsers"
        component={AppliedUsersScreen}
      />
    </RootStack.Navigator>
  );
}

export default RequestStackScreen;
