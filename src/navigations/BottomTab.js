import React, {useContext} from 'react';
import {Text} from 'react-native';

import {Icon} from 'react-native-elements';

import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import ServicesScreen from '../screens/ServicesScreen';
import HomeScreen from '../screens/bottomtab/HomeScreen';

import MyRequestScreen from '../screens/request/MyRequestScreen';
import RequestListScreen from '../screens/request/RequestScreen';

import InboxScreen from '../screens/InboxScreen';
import PendingScreen from '../screens/booing/PendingScreen';

import FavouriteScreen from '../screens/bottomtab/FavouriteScreen';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import ConfirmedScreen from '../screens/booing/ConfirmedScreenList';
import HistoryScreenList from '../screens/booing/HistoryScreenList';
import {fonts} from '../assets/fonts';
import {SearchScreen, FeedBackScreen} from '../screens/bottomtab';
import {
  GigsScreen,
  CreateNewGigScreen,
  GigDetailsScreen,
  EditGigScreen,
} from '../screens/gigs';
import AllTranslatorsScreen from '../screens/bottomtab/AllTranslatorsScreen';

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();

const MainTabScreen = ({navigation}) => {
  const {user, confirmedBookings, pendingBookings} = useContext(AuthContext);
  const {t} = useTranslation();

  return (
    <Tab.Navigator
      initialRouteName={
        user !== null &&
        (user.profile.interpreter || user.profile.interpreter === true)
          ? 'News'
          : 'Home'
      }
      screenOptions={({route}) => ({
        tabBarActiveTintColor: '#659ED6',
        tabBarInactiveTintColor: '#000000',
        tabBarStyle: [
          {
            display: 'flex',
          },
          null,
        ],
        tabBarLabelPosition: 'below-icon',

        headerShown: false,

        tabBarIcon: ({focused, color}) => {
          let iconName;
          if (route.name === 'Home' || route.name === 'Confirmed') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Inbox') {
            iconName = focused
              ? 'chatbox-ellipses'
              : 'chatbox-ellipses-outline';
          } else if (route.name === 'Pending') {
            iconName = focused ? 'people' : 'people-outline';
          } else if (route.name === 'Request') {
            iconName = focused
              ? 'git-pull-request'
              : 'git-pull-request-outline';
          } else if (route.name === 'News') {
            if (
              user !== null &&
              (user.profile.interpreter || user.profile.interpreter === true)
            )
              iconName = focused ? 'home' : 'home-outline';
            else iconName = focused ? 'newspaper' : 'newspaper-outline';
          } else if (route.name === 'Rating') {
            iconName = focused ? 'star' : 'star-outline';
          }
          // You can return any component that you like here!
          return (
            <Icon type={'ionicon'} name={iconName} size={24} color={color} />
          );
        },
        tabBarLabel: ({focused, color}) => {
          let labelName;
          if (route.name === 'Home') {
            labelName = t('navigate:home');
          } else if (route.name === 'Inbox') {
            labelName = t('navigate:inbox');
          } else if (route.name === 'Pending') {
            labelName =
              user !== null &&
              (user.profile.interpreter || user.profile.interpreter === true)
                ? t('navigate:pending_interpreter')
                : t('navigate:pending');
          } else if (route.name === 'Request') {
            labelName = t('common:requests');
          } else if (route.name === 'Rating') {
            labelName = t('navigate:rating');
          } else if (route.name === 'Confirmed') {
            labelName = t('navigate:confirm');
          }

          // You can return any component that you like here!
          return (
            <Text
              style={{
                color: color,
                fontFamily: fonts.medium,
                fontSize: 11,
                textAlign: 'center',
              }}>
              {labelName}
            </Text>
          );
        },
      })}>
      {user !== null &&
      (!user.profile.interpreter || user.profile.interpreter === false) ? (
        <Tab.Screen
          initialParams={{info: null}}
          name="Home"
          component={HomeStack}
        />
      ) : (
        <Stack.Screen
          options={
            confirmedBookings.length > 0 && {
              tabBarBadge: confirmedBookings.length,
            }
          }
          name="Home"
          component={HomeStackTranslator}
        />
      )}

      <Tab.Screen name="Inbox" component={InboxScreen} />
      <Tab.Screen
        options={
          pendingBookings.length > 0 && {
            tabBarBadge: pendingBookings.length,
          }
        }
        name="Pending"
        component={PendingScreen}
      />

      {user !== null &&
        user.profile.CanBook &&
        (!user.profile.interpreter || user.profile.interpreter === false) && (
          <Tab.Screen
            initialParams={{info: null}}
            name="Request"
            component={MyRequestScreen}
          />
        )}

      {user !== null &&
        (user.profile.interpreter || user.profile.interpreter === true) && (
          <Tab.Screen
            initialParams={{info: null}}
            name="Request"
            component={RequestListScreen}
          />
        )}

      {/* {user !== null &&
        (user.profile.interpreter || user.profile.interpreter === true) && (
          <Tab.Screen name="Rating" component={RatingScreen} />
        )} */}
    </Tab.Navigator>
  );
};

export default MainTabScreen;

const HomeStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <Stack.Screen name="Index" component={ServicesScreen} />
    <Stack.Screen name="TranslatorList" component={HomeScreen} />
    <Stack.Screen name="Confirmed" component={ConfirmedScreen} />
    <Stack.Screen name="Historic" component={HistoryScreenList} />
    <Stack.Screen name="Favourite" component={FavouriteScreen} />
    <Stack.Screen name="Search" component={SearchScreen} />
    <Stack.Screen name="AllTranslators" component={AllTranslatorsScreen} />
  </Stack.Navigator>
);

const HomeStackTranslator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <Stack.Screen name="Confirmed" component={ConfirmedScreen} />
      <Stack.Screen name="Historic" component={HistoryScreenList} />
      <Stack.Screen name="Gigs" component={GigsScreen} />
      <Stack.Screen name="NewGig" component={CreateNewGigScreen} />
      <Stack.Screen name="EditGig" component={EditGigScreen} />
      <Stack.Screen name="GigDetails" component={GigDetailsScreen} />
      <Stack.Screen name="FeedBack" component={FeedBackScreen} />
    </Stack.Navigator>
  );
};
