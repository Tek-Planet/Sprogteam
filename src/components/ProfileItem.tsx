import {useTheme} from '@react-navigation/native';
import * as React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import baseStyles from '../assets/styles';
import {spacing} from '../assets/spacing';

interface ProfileItemProps {
  value?: string;
  title: string;
}

const ProfileItem = (props: ProfileItemProps) => {
  const {value, title} = props;
  const {colors} = useTheme();
  const styles = getStyles(colors);
  return (
    <View
      style={{
        marginBottom: spacing.fiften,
      }}>
      <Text
        style={{
          ...styles.profileText,
          ...baseStyles.opacity,
          fontSize: fontSize.regular,
          marginBottom: spacing.five,
        }}>
        {title}
      </Text>
      <Text
        style={{
          ...styles.profileText,
        }}>
        {value}
      </Text>
    </View>
  );
};
export default ProfileItem;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    profileText: {
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      color: colors.black,
      lineHeight: 26,
      textAlign: 'justify',
    },
  });
