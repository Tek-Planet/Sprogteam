import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useAppSelector, useAppDispatch} from '../rtk/hooks';
import {ClientNavigation, GigNavigation} from './index';
import {
  ArchiveScreen,
  ArchiveWrittenTranslationScreen,
  AwaitingApprovalScreen,
  CreateQouteScreen,
  HandBookScreen,
  OrderInterpreterScreen,
  OrderInterpreterAnonymous,
  QuoteArchiveScreen,
  QuoteAwaitingApproval,
  WrittenScreen,
  TranslatorsScreen,
  BookInterpreterScreen,
  BookingDetails,
  QuoteDetailsScreen,
  PrivacyScreen,
  ProfileScreen,
  CreateWritenScreen,
  WrittenBookingDetails,
  AddRatingScreen,
  EditBookingScreen,
} from '../screens/ClientScreens';
import AwaitingWrittenTranslationScreen from '../screens/ClientScreens/AwaitingWrittenTranslationScreen';
import AcceptableBehaviourScreen from '../screens/ClientScreens/AcceptableBehaviourScreen';
import {
  BookingModel,
  QuoteType,
  SelectOptionType,
  UserModel,
  WrittenBooking,
} from '../types';
import {ChatsScreen, InboxScreen} from '../screens/shared';
import {TabParams} from './ClientNavigation';
import {
  ChangePasswordScreen,
  ContactUsScreen,
  DeleteAccountScreen,
  EditProfileScreen,
  EnterPasswordScreen,
  LanguageSelector,
} from '../screens/auths';
import {PaymentScreen} from '../screens/payment';
import {LanguageManager} from '../screens/gigs';

export type RootStackParams = {
  Tab: TabParams;
  OrderInterpreterAnonymous: undefined;
  AwaitingApproval: undefined;
  Archive: undefined;
  Written: undefined;
  AwaitingWrittenTranslation: undefined;
  ArchiveWrittenTranslation: undefined;
  HandBook: undefined;
  CreateQuote: undefined;
  QuoteArchive: undefined;
  AcceptableBehaviour: undefined;
  QuoteAwaitingApproval: undefined;
  OrderInterpreter: undefined;
  Tanslators: {
    searchParameter: any;
  };
  BookInterpreter: {
    interpreter: UserModel;
    selectedLanguage: SelectOptionType;
  };

  BookingDetails: {
    item: any;
    reload?: any;
    bookingId?: number;
  };
  Inbox: undefined;
  Chats: {
    item: UserModel;
  };
  QuoteDetails: {
    item: QuoteType;
  };
  Payment: {
    item: QuoteType;
  };
  GigNav: {
    screen: any;
  };
  Privacy: undefined;
  Profile: undefined;
  EnterPassword: undefined;
  EditProfile: undefined;
  ChangePassword: {
    password: string;
  };
  ContactUs: undefined;
  CreateWriten: undefined;
  WrittenBookingDetails: {
    item: WrittenBooking;
  };
  LanguageManager: undefined;
  LanguageSelector: undefined;
  Addrating: {
    info: any;
    userDetails: any;
  };
  DeleteAccount: undefined;
  EditBooking: {
    item: BookingModel;
  };
};

const RootStack = createNativeStackNavigator<RootStackParams>();

const MainNavigation = () => {
  const {gigState, currentRoute} = useAppSelector(state => state.user);

  // if (user?.role === 'jobseeker') return <JobSeekerNavigation />;
  // else if (user.role === 'customer') return <CustomerNavigation />;

  return (
    <RootStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName={
        gigState ? (currentRoute === 'Chats' ? 'Chats' : 'GigNav') : 'Tab'
      }>
      <RootStack.Screen name="Tab" component={ClientNavigation} />
      <RootStack.Screen
        name="OrderInterpreterAnonymous"
        component={OrderInterpreterAnonymous}
      />
      <RootStack.Screen
        name="BookInterpreter"
        component={BookInterpreterScreen}
      />
      <RootStack.Screen
        name="AwaitingApproval"
        component={AwaitingApprovalScreen}
      />
      <RootStack.Screen name="Archive" component={ArchiveScreen} />
      <RootStack.Screen name="Written" component={WrittenScreen} />
      <RootStack.Screen
        name="AwaitingWrittenTranslation"
        component={AwaitingWrittenTranslationScreen}
      />
      <RootStack.Screen
        name="ArchiveWrittenTranslation"
        component={ArchiveWrittenTranslationScreen}
      />
      <RootStack.Screen name="HandBook" component={HandBookScreen} />
      <RootStack.Screen name="Privacy" component={PrivacyScreen} />
      <RootStack.Screen name="CreateQuote" component={CreateQouteScreen} />
      <RootStack.Screen name="QuoteArchive" component={QuoteArchiveScreen} />
      <RootStack.Screen
        name="QuoteAwaitingApproval"
        component={QuoteAwaitingApproval}
      />
      <RootStack.Screen
        name="AcceptableBehaviour"
        component={AcceptableBehaviourScreen}
      />
      <RootStack.Screen
        name="OrderInterpreter"
        component={OrderInterpreterScreen}
      />
      <RootStack.Screen name="Tanslators" component={TranslatorsScreen} />
      <RootStack.Screen name="BookingDetails" component={BookingDetails} />
      <RootStack.Screen name="Inbox" component={InboxScreen} />
      <RootStack.Screen name="Chats" component={ChatsScreen} />
      <RootStack.Screen name="QuoteDetails" component={QuoteDetailsScreen} />
      <RootStack.Screen name="GigNav" component={GigNavigation} />
      <RootStack.Screen name="Profile" component={ProfileScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfileScreen} />
      <RootStack.Screen name="EnterPassword" component={EnterPasswordScreen} />
      <RootStack.Screen name="ContactUs" component={ContactUsScreen} />

      <RootStack.Screen
        name="ChangePassword"
        component={ChangePasswordScreen}
      />

      <RootStack.Screen name="CreateWriten" component={CreateWritenScreen} />
      <RootStack.Screen
        name="WrittenBookingDetails"
        component={WrittenBookingDetails}
      />
      <RootStack.Screen name="Payment" component={PaymentScreen} />
      <RootStack.Screen name="LanguageManager" component={LanguageManager} />
      <RootStack.Screen name="LanguageSelector" component={LanguageSelector} />
      <RootStack.Screen name="Addrating" component={AddRatingScreen} />
      <RootStack.Screen name="DeleteAccount" component={DeleteAccountScreen} />
      <RootStack.Screen name="EditBooking" component={EditBookingScreen} />
    </RootStack.Navigator>
  );
};

export default MainNavigation;
