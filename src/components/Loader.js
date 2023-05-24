import {View, ActivityIndicator} from 'react-native';
import React from 'react';
import {colors} from '../assets/colors';

const Loader = () => {
  return (
    <View
      style={{
        width: '100%',
        height: '100%',
        position: 'absolute',
        backgroundColor: 'rgba(0,0,0,0.2)',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
      }}>
      <View
        style={{backgroundColor: colors.white, padding: 15, borderRadius: 8}}>
        <ActivityIndicator />
      </View>
    </View>
  );
};

export default Loader;
