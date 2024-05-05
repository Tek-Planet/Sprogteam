import React, {useState} from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {fontSize, fonts} from '../assets/fonts';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {colorTypes, colors} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {useTheme} from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {spacing} from '../assets/spacing';
import {CustomButton} from '.';

type Props = NativeStackScreenProps<AuthStackParams>;

const DepartmentOverlayInput = ({navigation}: Props) => {
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const {colors} = useTheme();
  const [issue, setIssue] = useState('');

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Text style={styles.Title}>
          {t('common:Department') + ' ' + t('common:name')}
        </Text>
        <View style={styles.View}>
          <TextInput
            placeholder={t('common:Enter') + ' ' + t('common:name')}
            autoCapitalize="none"
            placeholderTextColor={colors.black}
            style={[styles.textInput]}
          />
        </View>
        <Text style={styles.Title}>{t('common:Address')}</Text>
        <View style={styles.View}>
          <TextInput
            placeholder={t('common:Enter') + ' ' + t('common:address')}
            autoCapitalize="none"
            placeholderTextColor={colors.black}
            style={[styles.textInput]}
          />
        </View>
        <Text style={styles.Title}>
          {t('common:Possibly') + '.' + t('common:ean')}
        </Text>
        <View style={styles.View}>
          <TextInput
            placeholder={
              t('common:Enter') +
              ' ' +
              t('common:Possibly') +
              '.' +
              t('common:ean')
            }
            autoCapitalize="none"
            placeholderTextColor={colors.black}
            style={[styles.textInput]}
          />
        </View>
        <Text style={styles.Title}>
          {t('common:Zip') + ' ' + t('common:code')}
        </Text>
        <View style={styles.View}>
          <TextInput
            placeholder={t('common:Enter') + ' ' + t('common:code')}
            autoCapitalize="none"
            placeholderTextColor={colors.black}
            style={[styles.textInput]}
          />
        </View>
        <Text style={styles.Title}>{t('common:Town')}</Text>
        <View style={styles.View}>
          <TextInput
            placeholder={
              t('common:Enter') +
              ' ' +
              t('common:code') +
              ' ' +
              t('common:name')
            }
            autoCapitalize="none"
            placeholderTextColor={colors.black}
            style={[styles.textInput]}
          />
        </View>
      </View>
    </ScrollView>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    Text: {
      color: 'black',
      fontSize: fontSize.intermediate,
      fontFamily: fonts.medium,
    },
    Title: {
      color: 'black',
      fontSize: fontSize.intermediate,
      fontFamily: fonts.medium,
      alignSelf: 'stretch',
      marginTop: SPACING,
      // marginLeft: spacing.ten,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? 0 : -12,
      marginLeft: SPACING * 1.8,
      fontSize: 17,
      fontWeight: '500',
      color: '#05375a',
    },
    View: {
      marginVertical: 8,
      marginBottom: spacing.fiften,
      flexDirection: 'row',
      width: spacing.twenty * 14,
      borderWidth: 1,
      borderRadius: SPACING * 9,
      borderColor: '#BBBBBB',
      height: spacing.fiften * 3.5,
    },
    rightIcon: {
      marginRight: SPACING * 2,
      marginTop: SPACING * 2,
    },
    leftIcon: {
      marginLeft: SPACING * 2.5,
      marginTop: SPACING * 2,
    },
    displayText: {
      fontSize: 18,
      marginTop: spacing.ten,
    },
  });

export default DepartmentOverlayInput;
