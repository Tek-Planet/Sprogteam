import React from 'react';
import Feather from 'react-native-vector-icons/Feather';
import SPACING from './SPACING';
import {fontSize, fonts} from '../assets/fonts';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useTheme} from '@react-navigation/native';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Icon from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {spacing} from '../assets/spacing';

type Props = NativeStackScreenProps<AuthStackParams>;

const DepartmentsInput = ({navigation}: Props) => {
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: colors.lightGray,
                }}>
                {t('common:Vester') +
                  ' ' +
                  t('common:Faedlledvej') +
                  ' ' +
                  t('common:19')}
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
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('common:Possibly') + '.' + t('common:ean')}
                    </Text>
                    <Text style={styles.activity}>{t('commnon:57980000')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      marginBottom: SPACING,
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Town')}</Text>
                    <Text style={styles.activity}>{t('common:Aalborg')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('commnon:Zip') + ' ' + t('common:code') + '.'}
                    </Text>
                    <Text style={styles.activity}>{t('9000')}</Text>
                  </View>
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
              {t('common:Aats') + ' ' + t('common:Office')}
            </Text>
            <Text style={{color: colors.lightGray}}>
              {t('common:Vester') +
                ' ' +
                t('common:Faedlledvej') +
                ' ' +
                t('common:19')}
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
      marginRight: spacing.twenty * 5.5,
      fontWeight: '600',
    },
    box: {
      width: SPACING * 32,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: SPACING * 22,
      borderRadius: SPACING * 3,
      borderColor: '#ccc',
      padding: 8,
      marginBottom: 12,
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
    buttonText: {
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
      marginVertical: spacing.ten,
    },
  });

export default DepartmentsInput;
