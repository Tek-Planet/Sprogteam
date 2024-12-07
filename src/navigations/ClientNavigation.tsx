import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {useTheme} from '@react-navigation/native';
import {
  booking,
  booking_focused,
  dollar_focused,
  dollar_view,
  home,
  home_focused,
  menu,
  menu_focused,
  quote,
  quote_focused,
  search,
  search_focused,
} from '../assets/images';
import {Image} from 'react-native';
import {useTranslation} from 'react-i18next';
import {BookingScreen, JobsScreen, QuoteScreen} from '../screens/ClientScreens';
import {DrawerNavigation} from '.';
import {useAppSelector} from '../rtk/hooks';
import {GigsScreen, SearchScreen} from '../screens/gigs';
import ServicesScreen from '../screens/ClientScreens/ServicesScreen';

export type TabParams = {
  Booking: undefined;
  Quote: undefined;
  Services: undefined;
  Menu: undefined;
  Search: undefined;
  Gigs: undefined;
  Jobs: undefined;
};

const BottomNav = createBottomTabNavigator<TabParams>();

const ClientNavigation = () => {
  const {colors} = useTheme();
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.user);

  return (
    <BottomNav.Navigator
      initialRouteName="Booking"
      screenOptions={({}) => ({
        headerShown: false,
        tabBarActiveTintColor: colors.main,
        tabBarInactiveTintColor: colors.black,
      })}>
      <BottomNav.Screen
        name="Booking"
        component={BookingScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image source={focused ? booking_focused : booking} />
          ),
          tabBarLabel: t('common:booking'),
        }}
      />

      {user?.interpreter && (
        <BottomNav.Screen
          name="Gigs"
          component={GigsScreen}
          options={{
            tabBarIcon: ({focused, size}) => (
              <Image source={focused ? dollar_focused : dollar_view} />
            ),
            tabBarLabel: t('common:gig'),
          }}
        />
      )}

      {user?.interpreter && (
        <BottomNav.Screen
          name="Jobs"
          component={JobsScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Image source={focused ? home_focused : home} />
            ),
            tabBarLabel: t('common:jobs'),
          }}
        />
      )}

      <BottomNav.Screen
        name="Quote"
        component={QuoteScreen}
        options={{
          tabBarIcon: ({focused}) => (
            <Image source={focused ? quote_focused : quote} />
          ),
          tabBarLabel: t('common:quote'),
        }}
      />
      {!user?.interpreter && (
        <BottomNav.Screen
          name="Services"
          component={ServicesScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Image source={focused ? home_focused : home} />
            ),
            tabBarLabel: t('common:services'),
          }}
        />
      )}
      {!user?.interpreter && (
        <BottomNav.Screen
          name="Search"
          component={SearchScreen}
          options={{
            tabBarIcon: ({focused}) => (
              <Image source={focused ? search_focused : search} />
            ),
            tabBarLabel: t('common:search'),
          }}
        />
      )}

      <BottomNav.Screen
        name="Menu"
        component={DrawerNavigation}
        options={{
          tabBarIcon: ({focused}) => (
            <Image source={focused ? menu_focused : menu} />
          ),
          tabBarLabel: t('common:menu'),
        }}
      />
    </BottomNav.Navigator>
  );
};

// job

export default ClientNavigation;
