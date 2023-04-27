import React from 'react';
import {Text} from 'react-native';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';

const TextBoxTitle = ({title, showAsh, ...rest}) => {
  return (
    <Text
      {...rest}
      style={{
        fontSize: 15,
        fontFamily: fonts.medium,
        margin: 5,
        textAlign: 'justify',
        color: colors.black,
      }}>
      {title}
      {!showAsh && <Text style={{color: '#FF0727'}}> *</Text>}
    </Text>
  );
};

export default TextBoxTitle;
