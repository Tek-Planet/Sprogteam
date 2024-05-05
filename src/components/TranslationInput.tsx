import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {fontSize, fonts} from '../assets/fonts';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {spacing} from '../assets/spacing';

type Props = NativeStackScreenProps<AuthStackParams>;

const TranslationInput = ({navigation}: Props) => {
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const {colors} = useTheme();

  return (
    <ScrollView>
      <View
        style={{
          flex: 1,
        }}>
        <View style={styles.View}>
          <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:18/06/2023') +
                ' ' +
                t('common:-') +
                ' ' +
                t('common:18/06/2023')}
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
        <View style={styles.View}>
          <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:18/06/2023') +
                ' ' +
                t('common:-') +
                ' ' +
                t('common:18/06/2023')}
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
        <View style={[styles.box, {marginTop: SPACING}]}>
          <View
            style={{
              flexDirection: 'column',
              marginLeft: SPACING * 2,
              marginTop: SPACING,
            }}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: colors.lightGray,
                }}>
                {t('common:18/06/2023') +
                  ' ' +
                  t('common:-') +
                  ' ' +
                  t('common:18/06/2023')}
              </Text>
              <TouchableOpacity>
                <Feather name="chevron-right" size={20} color={colors.black} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 1}}>
              <View style={styles.drawerContent}>
                <View style={styles.userSection}>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginTop: SPACING,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('commnon:From') + ' ' + t('common:language')}
                    </Text>
                    <Text style={styles.activity}>{t('common:Danish')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('commnon:For') + ' ' + t('common:language')}
                    </Text>
                    <Text style={styles.activity}>{t('common:English')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Status')}</Text>
                    <MaterialCommunityIcons
                      name="circle-medium"
                      size={20}
                      color={colors.green}
                      style={{alignSelf: 'center'}}
                    />
                    <Text style={styles.activity}>{t('common:Delivered')}</Text>
                  </View>
                  <TouchableOpacity style={styles.inner_button}>
                    <Text style={styles.inner_buttonText}>
                      {t('common:Details')}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.View}>
          <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:18/06/2023') +
                ' ' +
                t('common:-') +
                ' ' +
                t('common:18/06/2023')}
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
        <View style={styles.View}>
          <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:18/06/2023') +
                ' ' +
                t('common:-') +
                ' ' +
                t('common:18/06/2023')}
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
        <View style={styles.View}>
          <View style={[styles.textInput, {marginLeft: spacing.ten * 1.5}]}>
            <Text
              style={{
                color: colors.black,
                fontSize: spacing.ten * 1.8,
                fontWeight: '700',
              }}>
              {t('common:01010')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:18/06/2023') +
                ' ' +
                t('common:-') +
                ' ' +
                t('common:18/06/2023')}
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
      </View>
    </ScrollView>
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
    drawerContent: {
      flex: 1,
    },
    userSection: {
      // paddingLeft: 20,
    },
    title: {
      fontSize: 16,
      marginVertical: SPACING,
      color: '#778080',
      paddingRight: spacing.fiften * 9,
      fontWeight: '600',
    },
    box: {
      width: SPACING * 32,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: SPACING * 29,
      borderRadius: SPACING * 3,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 12,
    },
    inner_button: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#2260A6',
      padding: 10,
      borderRadius: SPACING * 6,
      width: '60%',
      height: spacing.fiften * 3.5,
      marginTop: SPACING * 1.5,
    },
    inner_buttonText: {
      color: '#fff',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? 0 : -12,
      padding: SPACING * 1.3,
      fontSize: 17,
      fontWeight: '500',
    },
    View: {
      marginVertical: spacing.ten,
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      justifyContent: 'space-between',
      borderRadius: spacing.fiften * 1.5,
      borderColor: '#ccc',
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
    },
    button: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#FF5842',
      padding: 10,
      borderRadius: SPACING * 6,
      width: '80%',
      height: spacing.fiften * 4.3,
      marginTop: SPACING * 1.5,
    },
    inner_buttonText: {
      color: '#fff',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    activity: {
      color: '#444A64',
      fontSize: fontSize.intermediate,
      fontWeight: '700',
      marginVertical: SPACING,
    },
  });

export default TranslationInput;
