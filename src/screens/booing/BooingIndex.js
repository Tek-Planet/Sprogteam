import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, SafeAreaView} from 'react-native';

import Header from '../../components/Header';
import BooingNavigation from '../../navigations/BooingNavigationList';

const BooingIndex = ({navigation}) => {
  return (
    <View style={{flex: 1}}>
      <Header navigation={navigation} />
      <BooingNavigation />
    </View>
  );
};

export default BooingIndex;
