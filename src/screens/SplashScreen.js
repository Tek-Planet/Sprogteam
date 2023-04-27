import React from 'react';
import {View, Text, Image} from 'react-native';

const SplashScreen = () => {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#0964CD',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        resizeMode="contain"
        style={{width: 200, height: 200, borderRadius: 100}}
        source={require('../assets/imgs/logo.png')}
      />
      {/* <Text
        style={{
          fontSize: 22,
          fontFamily: 'Montserrat-Bold',
          margin: 5,
          color: '#7A7A7A',
        }}>
        Sprogteam
      </Text> */}
    </View>
  );
};

export default SplashScreen;
