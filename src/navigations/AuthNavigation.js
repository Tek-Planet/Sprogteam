import React, {useContext} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import SignInScreen from '../screens/auth/SignInScreen';
import SignUpScreen from '../screens/auth/SignUpScreen';
import LanguageScreen from '../screens/auth/LanguageScreen';
import ServicesScreen from '../screens/auth/ServicesScreen';
import ForgotPasswordScreen from '../screens/auth/ForgotPasswordScreen';
import AccountConfirmScreen from '../screens/auth/AccountConfirmScreen';
import LanguageSelectionScreen from '../screens/auth/LanguageSelectionScreen';
import {AuthContext} from '../context/AuthProvider';
import {NewKycScreen} from '../screens/kyc';
import AccountSelectorScreen from '../screens/auth/AccountSelectorScreen';
import SignUpTranslatorScreen from '../screens/auth/SignUpTranslatorScreen';

const RootStack = createNativeStackNavigator();

function AuthNavigation() {
  const {firstLaunch} = useContext(AuthContext);
  //
  return (
    <RootStack.Navigator
      initialRouteName={firstLaunch ? 'LanguageSelector' : 'SignIn'}>
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="SignIn"
        component={SignInScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="SignUp"
        component={SignUpScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: true,
          headerTitle: 'Reset Password',
        }}
        name="Forgot"
        component={ForgotPasswordScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: true,
        }}
        name="AddLanguage"
        component={LanguageScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="AddServices"
        component={ServicesScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="Info"
        component={AccountConfirmScreen}
      />
      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="LanguageSelector"
        component={LanguageSelectionScreen}
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
        name="AccountSelector"
        component={AccountSelectorScreen}
      />

      <RootStack.Screen
        options={{
          headerShown: false,
        }}
        name="SignUpTranslator"
        component={SignUpTranslatorScreen}
      />
    </RootStack.Navigator>
  );
}

export default AuthNavigation;
