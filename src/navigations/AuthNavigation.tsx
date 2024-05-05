import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  BlogDetailsScreen,
  BlogScreen,
  EmailVerificationScreen,
  FAQScreen,
  LanguageSelector,
  OTPScreen,
  SignInScreen,
  SignUpScreen,
  ResetPasswordScreen,
  SignUpTranlatorScreen,
  AddLanguage,
  AddServicesScreen,
  AccountTypeScreen,
  ContactUsScreen,
} from '../screens/auths';
import GuestDrawerNavigation from './GuestDrawerNavigation';
import {RegisterModel, SelectOptionType} from '../types';
import ServicesScreen from '../screens/ClientScreens/ServicesScreen';
import {GigNavigation} from '.';

export type AuthStackParams = {
  Login: undefined;
  SignUp: {
    user: RegisterModel;
  };

  Home: undefined;
  Drawer: undefined;
  FAQ: undefined;
  LanguageSelector: undefined;
  Blog: undefined;
  BlogDetails: {
    item: SelectOptionType;
  };
  GuestServices: undefined;
  GigNav: undefined;
  EmailVerification: {
    user: RegisterModel;
  };

  OTP: {
    user: RegisterModel;
  };
  ResetPassword: {
    user: RegisterModel;
  };

  SignUpTranslator: {
    user: RegisterModel;
  };

  AddLanguage: {
    userId: string;
  };
  AddServices: {
    userId: string;
  };
  AccountType: undefined;
  ContactUs: undefined;
};

const AuthStack = createNativeStackNavigator<AuthStackParams>();

const AuthNavigation = () => {
  return (
    <AuthStack.Navigator
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Drawer">
      <AuthStack.Screen name="Drawer" component={GuestDrawerNavigation} />
      <AuthStack.Screen name="Login" component={SignInScreen} />
      <AuthStack.Screen name="SignUp" component={SignUpScreen} />

      <AuthStack.Screen name="FAQ" component={FAQScreen} />
      <AuthStack.Screen name="LanguageSelector" component={LanguageSelector} />
      <AuthStack.Screen name="Blog" component={BlogScreen} />
      <AuthStack.Screen name="BlogDetails" component={BlogDetailsScreen} />
      <AuthStack.Screen name="GuestServices" component={ServicesScreen} />
      <AuthStack.Screen name="GigNav" component={GigNavigation} />
      <AuthStack.Screen
        name="EmailVerification"
        component={EmailVerificationScreen}
      />

      <AuthStack.Screen name="OTP" component={OTPScreen} />
      <AuthStack.Screen name="ResetPassword" component={ResetPasswordScreen} />
      <AuthStack.Screen
        name="SignUpTranslator"
        component={SignUpTranlatorScreen}
      />

      <AuthStack.Screen name="AddLanguage" component={AddLanguage} />
      <AuthStack.Screen name="AddServices" component={AddServicesScreen} />
      <AuthStack.Screen name="AccountType" component={AccountTypeScreen} />
      <AuthStack.Screen name="ContactUs" component={ContactUsScreen} />
    </AuthStack.Navigator>
  );
};

export default AuthNavigation;
