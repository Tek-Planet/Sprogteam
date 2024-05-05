import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';

import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {spacing} from '../../assets/spacing';
import {HandBookItem, Header} from '../../components';
import {faqs, handBook} from '../../utils';
import {useTranslation} from 'react-i18next';

const FAQScreen = () => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  return (
    <View style={{...styles.container}}>
      <Header headerTitle={'FAQ'} showleftIcon />

      <View style={{padding: spacing.ten}}>
        <ScrollView>
          {faqs.map((item, index) => {
            return <HandBookItem key={index.toString()} item={item} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default FAQScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#fff',
      padding: 10,
      borderColor: '#2260A6',
      borderWidth: 2,
      borderRadius: 30,
      width: '100%',
      height: spacing.fiften * 4.3,
      marginBottom: 10,
    },
    buttonText: {
      color: '#2260A6',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    Text: {
      color: colors.black,
      marginLeft: spacing.ten,
      fontSize: 18,
      fontFamily: fonts.bold,
      alignSelf: 'center',
    },
  });
