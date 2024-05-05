import React from 'react';
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableOpacityProps,
  Pressable,
} from 'react-native';
import {colors} from '../assets/colors';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';

interface ButtonProps extends TouchableOpacityProps {
  buttonTitle: string;
  testColor?: string;
  disable?: boolean;
  bGcolor?: string;
  onTap: Function;
  textSize?: number;
  padding?: number;
  borderColor?: string;
  textAlign?: 'center' | 'auto' | 'left' | 'right' | 'justify' | undefined;
  borderWidth?: number;
}

const Button: React.FC<ButtonProps> = ({
  buttonTitle,
  testColor,
  disable,
  bGcolor,
  onTap,
  textSize,
  padding,
  borderColor,
  borderWidth,
  textAlign,
  ...rest
}) => {
  let color = testColor ? testColor : colors.white;
  let bgColor = bGcolor ? bGcolor : colors.main;
  borderColor = borderColor ? borderColor : colors.main;
  borderWidth = borderWidth ? borderWidth : 0;
  textAlign = textAlign ? textAlign : 'center';

  return (
    <TouchableOpacity
      onPress={() => {
        onTap();
      }}
      style={[
        styles.buttonContainer,
        {
          backgroundColor: disable ? '#B2CEEA' : bgColor,
          borderWidth: borderWidth,
          borderColor: borderColor,
        },
      ]}
      disabled={disable}
      {...rest}>
      <Text
        style={[
          styles.buttonText,
          {
            color: color,
            fontSize: textSize ? textSize : fontSize.regular,
            padding: padding ? padding : spacing.ten / 1.5,
            textAlign: textAlign,
          },
        ]}>
        {buttonTitle}
      </Text>
    </TouchableOpacity>
  );
};

export default Button;

const styles = StyleSheet.create({
  buttonContainer: {
    borderRadius: spacing.twenty * 5,
    marginVertical: spacing.ten,
    padding: spacing.five * 1.5,
  },

  buttonText: {
    padding: spacing.five,
    fontFamily: fonts.medium,
  },
});
