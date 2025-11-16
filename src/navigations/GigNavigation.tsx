/* eslint-disable prettier/prettier */
import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  CreateOfferScreen,
  GigByServiceIdScreen,
  GigDetailsScreen,
  GigManagerScreen,
  GigProfileDetailsScreen,
} from '../screens/gigs';
import {GigType, SelectOptionType} from '../types';
import CreateGigScreen from '../screens/gigs/CreateGigScreen';
export type GigStackParams = {
  GigDetails: {
    item: any;
  };
  CreateGig: {
    item: GigType | undefined;
  };
  GigByServiceId: {
    service: SelectOptionType;
  };
  GigProfileDetails: {
    item: any;
    serviceId: string;
  };
  CreateOffer: {
    item: any;
    itemType: string;
  };
  GigManager: {
    item: GigType;
  };
};

const GigStack = createNativeStackNavigator<GigStackParams>();

const AuthNavigation = () => {
  return (
    <GigStack.Navigator
      screenOptions={{
        headerShown: false,
      }}>
      <GigStack.Screen name="CreateOffer" component={CreateOfferScreen} />
      <GigStack.Screen name="GigDetails" component={GigDetailsScreen} />
      <GigStack.Screen name="CreateGig" component={CreateGigScreen} />
      <GigStack.Screen name="GigByServiceId" component={GigByServiceIdScreen} />
      <GigStack.Screen
        name="GigProfileDetails"
        component={GigProfileDetailsScreen}
      />

      <GigStack.Screen name="GigManager" component={GigManagerScreen} />
    </GigStack.Navigator>
  );
};

export default AuthNavigation;
