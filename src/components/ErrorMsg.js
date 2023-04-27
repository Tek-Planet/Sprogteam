import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {fonts} from '../assets/fonts';

const ErrorMessage = props => {
  return (
    <View>
      {props.error !== null && (
        <Text
          style={{
            fontSize: 16,
            textAlign: 'center',
            margin: 10,
            color: 'red',
            fontFamily: fonts.medium,
          }}>
          {props.error}
        </Text>
      )}
    </View>
  );
};

export default ErrorMessage;
