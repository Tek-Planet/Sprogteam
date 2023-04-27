import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
// import InboxScreen from '../screens/InboxScreen';
import {
  ProfileScreen,
  NewsScreen,
  PublicProfile,
  GeneralScreen,
  RatingScreen,
} from '../screens';

import {LandingPage, PaymentPage, SuccessPage} from '../screens/payment';
import {KycScreen, NewKycScreen, PaymentOptionScreen} from '../screens/kyc';
import ContactUsScreen from '../screens/ContactUsScreen';
import BookingScreen from '../screens/bookings/BookingScreen';
import EditBookingScreen from '../screens/bookings/EditBookingScreen';
import EditTimeScreen from '../screens/bookings/EditTimeScreen';
import ChatScreen from '../screens/ChatScreen';
import BookingDetailsScreen from '../screens/bookings/BookingDetailsScreen';
import BookingResponseScreen from '../screens/bookings/BookingResponseScreen';
import AddRatingScreen from '../screens/AddRatingScreen';
import NearbyScreen from '../screens/NearbyScreen';
import NewsDetaislScreen from '../screens/NewsDetaislScreen';
import EditScreen from '../screens/auth/EditScreen';
import DirectionScreen from '../screens/DirectionScreen';
import TermsScreen from '../screens/TermsScreen';
import TranslateHandbook from '../screens/TranslateHandbook';
import PrivatePolice from '../screens/PrivatePolice';

import BooingScreen from '../screens/bottomtab/BooingScreen';
import LanguageScreen from '../screens/auth/LanguageScreen';
import SkillsScreen from '../screens/SkillsScreen';
import ManageServicesScreen from '../screens/ManageServicesScreen';

import ServicesScreen from '../screens/ServicesScreen';
import {Icon} from 'react-native-elements';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {fonts} from '../../src/assets/fonts';
import {useTranslation} from 'react-i18next';

import RequestNavigation from './RequestNavigation';
import ProfileNavigation from './ProfileNavigation';
import PaymentNavigation from './PaymentNavigation';
import {
  ViewGigScreen,
  GigBookingScreen,
  GigBookingScreenB,
} from '../screens/gigs';
import {AvailabilityScreen} from '../screens';
import {colors} from '../assets/colors';
import {DeleteAccountScreen} from '../screens/auth';

const RootStack = createNativeStackNavigator();
const Stack = createNativeStackNavigator();

function OtherStackScreen({navigation}) {
  const {t} = useTranslation();

  const headerBack = location => {
    return (
      <AntDesign
        onPress={() => {
          if (location) navigation.navigate(location);
          else navigation.goBack();
        }}
        name={'back'}
        size={26}
        color={colors.white}
      />
    );
  };

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: true,
        headerStyle: {
          backgroundColor: '#659ED6',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: fonts.medium,
        },
        headerLeft: () => (
          <Icon
            type={'ionicon'}
            name={'chevron-back'}
            size={26}
            onPress={() => navigation.navigate('Profile')}
            color="#fff"
          />
        ),
      }}>
      {/* <RootStack.Screen name="Inbox" component={InboxScreen} /> */}
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Profile"
        component={ProfileScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="General"
        component={GeneralScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack('General'),
          title: t('common:rating'),
        }}
        name="RatingScreen"
        component={RatingScreen}
      />
      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:contact'),
        }}
        name="Contact"
        component={ContactUsScreen}
      />
      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:nearby_interpreter'),
        }}
        name="Nearby"
        component={NearbyScreen}
      />
      <RootStack.Screen
        options={{
          title: t('common:edit'),
          headerLeft: () => headerBack(null),
          headerShown: false,
        }}
        name="EditTime"
        component={EditTimeScreen}
      />
      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:order'),
        }}
        name="Order"
        component={BookingScreen}
      />
      <RootStack.Screen
        options={{title: 'Gem', headerLeft: () => headerBack(null)}}
        name="EditOrder"
        component={EditBookingScreen}
      />

      <RootStack.Screen
        options={{
          title: t('common:rating'),
          headerShown: false,
        }}
        name="Rating"
        component={AddRatingScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
          headerLeft: () => headerBack(null),
          title: t('navigate:chats'),
        }}
        name="ChatScreen"
        component={ChatScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
          headerLeft: () => headerBack(null),
          title: t('common:booking') + ' ' + t('common:details'),
        }}
        name="BookingDetails"
        component={BookingDetailsScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,

          title: t('common:booking') + ' ' + t('common:response'),
        }}
        name="BookingResponse"
        component={BookingResponseScreen}
      />
      <RootStack.Screen
        name="NewsDetails"
        options={{
          headerLeft: () => headerBack(null),
          title: t('navigate:news') + ' ' + t('common:details'),
        }}
        component={NewsDetaislScreen}
      />
      <RootStack.Screen
        options={{
          headerLeft: () => headerBack('General'),
          title: t('common:edit') + ' ' + t('common:profile'),
        }}
        name="Edit"
        component={EditScreen}
      />
      <RootStack.Screen
        options={{title: t('common:direction')}}
        name="Direction"
        component={DirectionScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:privacy_policy'),
        }}
        name="PrivatePolice"
        component={PrivatePolice}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:consumer_terms'),
        }}
        name="BehaviorPolice"
        component={TermsScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:interpreter_castle'),
        }}
        name="TranslateHandbook"
        component={TranslateHandbook}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:calendar'),
        }}
        name="Booing"
        component={BooingScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:add') + ' ' + t('common:language'),
        }}
        name="AddLanguage"
        component={LanguageScreen}
      />
      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:skills'),
        }}
        name="Skills"
        component={SkillsScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:skills'),
        }}
        name="ManageServices"
        component={ManageServicesScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('common:services'),
        }}
        name="Services"
        component={ServicesScreen}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          title: t('navigate:news'),
        }}
        name="News"
        component={NewsScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="RequestNav"
        component={RequestNavigation}
      />

      <RootStack.Screen
        options={{
          headerLeft: () => headerBack(null),
          headerShown: false,
        }}
        name="FullProfileNav"
        component={ProfileNavigation}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="PaymentNav"
        component={PaymentNavigation}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="PublicProfile"
        component={PublicProfile}
      />

      {/* payment section */}
      {/* index of payment page */}
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="LandingPage"
        component={LandingPage}
      />
      {/* pament page */}

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Payment"
        component={PaymentPage}
      />
      {/* success page */}
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Success"
        component={SuccessPage}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="ViewGiG"
        component={ViewGigScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="KYC"
        component={KycScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="NewKYC"
        component={NewKycScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="PaymentOption"
        component={PaymentOptionScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="GigBooking"
        component={GigBookingScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="GigBookingB"
        component={GigBookingScreenB}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Availability"
        component={AvailabilityScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="DeleteAccount"
        component={DeleteAccountScreen}
      />
    </RootStack.Navigator>
  );
}

export default OtherStackScreen;
