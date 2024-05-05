import React, {useEffect} from 'react';
import {Image, View, StyleSheet, Text, StatusBar} from 'react-native';

import {logo} from '../assets/images';
import {fontSize, fonts} from '../assets/fonts';
import {colorTypes, colors} from '../assets/colors';
import {useTranslation} from 'react-i18next';
import {spacing} from '../assets/spacing';

const SplashScreen = () => {
  const styles = getStyles(colors);

  return (
    <View style={styles.container}>
      <StatusBar
        translucent
        barStyle={'light-content'}
        backgroundColor={colors.main}
      />
      <Image resizeMode="contain" style={styles.image} source={logo} />
    </View>
  );
};
``;
export default SplashScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#0c67ca',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 10,
    },

    image: {
      height: 150,
      width: 150,
      borderRadius: 100,
    },

    header: {
      fontSize: spacing.fiften * 6,
      fontFamily: fonts.bold,
      marginTop: 15,
      color: colors.main,
    },

    subHeader: {
      fontSize: fontSize.bold,
      fontFamily: fonts.medium,
      color: colors.main,
      marginRight: spacing.twenty * 2.5,
      alignSelf: 'flex-end',
    },
  });
