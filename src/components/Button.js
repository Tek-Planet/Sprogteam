import React from 'react';
import {Text, TouchableOpacity, StyleSheet} from 'react-native';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';

const Button = ({buttonTitle, testColor, disable, bGcolor, ...rest}) => {
  let color = testColor ? testColor : colors.white;
  let bgColor = bGcolor ? bGcolor : colors.main;

  return (
    <TouchableOpacity
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disable ? '#B2CEEA' : bgColor,
        },
      ]}
      {...rest}>
      <Text style={[styles.buttonText, {color: color}]}>{buttonTitle}</Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    margin: 5,
    padding: 10,
    borderRadius: 10,
  },

  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontFamily: fonts.medium,
  },
});
