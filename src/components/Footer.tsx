import React from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {colors} from '../assets/colors';
import {useNavigation} from '@react-navigation/native';
import {spacing} from '../assets/spacing';
import CustomButton from './CustomButton';

import {useTranslation} from 'react-i18next';

// import

interface FooterProps {
  onPressRightIcon: () => void;
  onPressLeftIcon: () => void;
  lastPage?: boolean;
}

const Footer = ({onPressRightIcon, onPressLeftIcon, lastPage}: FooterProps) => {
  const navigation = useNavigation();
  const {t} = useTranslation();

  return (
    <View style={[styles.sectionStyle]}>
      <TouchableOpacity
        style={styles.leffIconBg}
        onPress={() => {
          onPressLeftIcon();
        }}>
        <Feather
          name={'chevron-left'}
          size={25}
          style={styles.iconStyle}
          color={colors.lightGray}
        />
      </TouchableOpacity>

      {lastPage ? (
        <CustomButton
          buttonTitle={t('common:create') + ' ' + t('common:account')}
          onTap={() => {
            onPressRightIcon();
          }}
        />
      ) : (
        <TouchableOpacity
          style={{...styles.leffIconBg, borderColor: colors.main}}
          onPress={() => {
            onPressRightIcon();
          }}>
          <Feather
            name={'chevron-right'}
            size={25}
            style={styles.iconStyle}
            color={colors.main}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default Footer;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leffIconBg: {
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: 100,
    padding: spacing.five,
  },
  iconStyle: {
    margin: 5,
  },
});
