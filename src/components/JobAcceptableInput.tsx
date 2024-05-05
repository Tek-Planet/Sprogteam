/* eslint-disable react-native/no-inline-styles */
/* eslint-disable prettier/prettier */
import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {fontSize, fonts} from '../assets/fonts';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {colorTypes} from '../assets/colors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {AuthStackParams} from '../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {spacing} from '../assets/spacing';

type Props = NativeStackScreenProps<AuthStackParams>;

const JobAcceptableInput = ({}: Props) => {
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <View style={[styles.box, {marginTop: SPACING}]}>
      <View style={styles.inner_box}>
        <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
          <Text
            style={{
              color: colors.black,
              fontSize: spacing.ten * 1.8,
              fontWeight: '700',
            }}>
            {t('common:Password')}
          </Text>
        </View>
        <TouchableOpacity>
          <Feather
            name="chevron-right"
            size={20}
            color={colors.black}
            style={styles.rightIcon}
          />
        </TouchableOpacity>
      </View>
      <View style={{padding: spacing.ten * 1.5}}>
        <Text style={styles.title}>
          {t('common:Language') +
            ', ' +
            t('common:Team') +
            ' ' +
            t('common:encourages') +
            ' ' +
            t('common:our') +
            ', ' +
            t('common:users') +
            ' ' +
            t('common:to') +
            ' ' +
            t('common:change') +
            ' ' +
            t('common:their') +
            ' ' +
            t('common:password') +
            ' ' +
            t('common:every') +
            ' ' +
            t('common:3') +
            ' ' +
            t('common:months') +
            ', ' +
            t('common:to') +
            ' ' +
            t('common:optimize') +
            ' ' +
            t('common:IT') +
            ' ' +
            t('common:security') +
            ' ' +
            t('common:as') +
            ' ' +
            t('common:soon') +
            '.'}
        </Text>
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: 16,
      justifyContent: 'center',
      alignItems: 'center',
    },
    rightIcon: {
      marginRight: SPACING * 2,
      marginTop: SPACING * 2,
    },
    title: {
      fontSize: 16,
      color: '#778080',
      margin: spacing.five,
      fontWeight: '600',
      textAlign: 'justify',
    },
    box: {
      width: SPACING * 32,
      borderWidth: 1,
      flexDirection: 'column',
      justifyContent: 'space-between',
      height: spacing.fiften * 20,
      borderRadius: SPACING * 3,
      borderColor: '#ccc',
      // padding: 8,
      marginBottom: 12,
    },
    textInput: {
      flex: 1,
      // marginTop: Platform.OS === 'android' ? 0 : -12,
      padding: SPACING * 1.3,
      fontSize: 17,
      fontWeight: '500',
    },
    inner_box: {
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      backgroundColor: '#E7E8ED',
      justifyContent: 'space-between',
      borderRadius: spacing.fiften * 2,
      borderColor: '#E7E8ED',
      height: spacing.fiften * 3.5,
    },
  });

export default JobAcceptableInput;
