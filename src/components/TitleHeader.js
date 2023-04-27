import React, {Component} from 'react';
import {View, Text} from 'react-native';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';

const TitleHeader = ({title, ...rest}) => {
  return (
    <Text
      {...rest}
      style={{
        fontSize: 20,
        fontFamily: fonts.bold,
        margin: 5,
        textAlign: 'center',
        color: colors.black,
      }}>
      {title}
    </Text>
  );
};

export default TitleHeader;
