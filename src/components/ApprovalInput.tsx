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
  Image,
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
import {spacing} from '../assets/spacing';
import {shape} from '../assets/images';

type Props = NativeStackScreenProps<AuthStackParams>;

const ApprovalInput = ({navigation}: Props) => {
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
          <Icon
            name="search"
            size={26}
            color={colors.lightGray}
            style={styles.leftIcon}
          />
          <TextInput
            placeholder={t('common:Search') + ' ' + t('common:Bookings')}
            autoCapitalize="none"
            placeholderTextColor={colors.gray}
            style={[styles.textInput]}
          />
          <TouchableOpacity>
            <Ionicons
              name="options-outline"
              size={20}
              color={colors.lightGray}
              style={styles.rightIcon}
            />
          </TouchableOpacity>
        </View>
        <View style={[styles.View]}>
          <View
            style={{
              flexDirection: 'column',
              padding: spacing.five,

              marginLeft: SPACING * 2,
            }}>
            <Text
              style={{
                color: colors.black,
                fontFamily: fonts.medium,
                fontWeight: '500',
                fontSize: 17,
              }}>
              {t('common:A-G5-45512')}
            </Text>
            <Text style={{color: colors.gray, fontSize: 16}}>
              {t('common:18/06/2023')}
            </Text>
          </View>
          <TouchableOpacity>
            <Feather
              name="chevron-right"
              size={20}
              color={colors.black}
              style={{marginRight: SPACING, marginTop: SPACING}}
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
                fontFamily: fonts.medium,
                fontWeight: '500',
                fontSize: 20,
              }}>
              {t('common:H-U7-173895')}
            </Text>
            <View
              style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <Text
                style={{
                  color: colors.gray,
                  fontSize: 17,
                }}>
                {t('common:18/06/2023')}
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
                      {t('commnon:Start') + ' ' + t('common:Time')}
                    </Text>
                    <Text style={styles.activity}>{t('common:02:30pm')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('commnon:End') + ' ' + t('common:Time')}
                    </Text>
                    <Text style={styles.activity}>{t('common:01:08pm')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Duration')}</Text>
                    <Text style={styles.activity}>
                      {t('common:60') + ' ' + t('common:days')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Type')}</Text>
                    <Text style={styles.activity}>
                      {t('common:Any') + ' ' + t('common:Type')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Language')}</Text>
                    <Text style={styles.activity}>{t('common:English')}</Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Department')}</Text>
                    <Text style={styles.activity}>
                      {t('common:Xyz') + ' ' + t('common:department')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>{t('commnon:Petitioner')}</Text>
                    <Text style={styles.activity}>
                      {t('common:Petitioner')}
                    </Text>
                  </View>
                  <View
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={styles.title}>
                      {t('commnon:Reason') +
                        ' ' +
                        t('common:for') +
                        ' ' +
                        t('common:attendance')}
                    </Text>
                    <Text style={styles.activity}>
                      {t('common:The') + ' ' + t('common:citizen')}
                    </Text>
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
                      style={{
                        marginLeft: spacing.fiften * 9,
                        alignSelf: 'center',
                      }}
                    />
                    <Text style={styles.activity}>{t('common:Active')}</Text>
                  </View>
                </View>
                <View style={styles.inner}>
                  <Text
                    style={{
                      color: colors.black,
                      fontWeight: '700',
                      fontSize: 18,
                    }}>
                    {t('common:Extend') +
                      ' ' +
                      t('common:the') +
                      ' ' +
                      t('common:time') +
                      ' ' +
                      t('common:request')}
                  </Text>
                  <View
                    style={{
                      flexDirection: 'row',
                      flex: 1,
                      marginTop: SPACING * 2,
                    }}>
                    <Image
                      source={shape}
                      style={{
                        height: '40%',
                        width: '20%',
                        borderRadius: SPACING * 2,
                      }}
                    />
                    <View style={{flexDirection: 'column'}}>
                      <Text
                        style={{
                          color: '#778080',
                          paddingLeft: SPACING,
                          fontWeight: '600',
                        }}>
                        {t('common:Kende') +
                          ' ' +
                          t('common:Attila') +
                          ' ' +
                          t('common:request') +
                          ' ' +
                          t('common:to') +
                          ' ' +
                          t('common:change')}
                      </Text>
                      <Text
                        style={{
                          color: '#778080',
                          paddingLeft: SPACING,
                          fontWeight: '600',
                        }}>
                        {t('common:Ending') +
                          ' ' +
                          t('common:Time') +
                          ' ' +
                          t('common:10') +
                          ' ' +
                          t('common:sep') +
                          ' ' +
                          t('common:12:30pm')}
                      </Text>
                      <View
                        style={{
                          flexDirection: 'row',
                          justifyContent: 'flex-end',
                          marginRight: spacing.fiften,
                        }}>
                        <TouchableOpacity style={styles.button_Blue}>
                          <Text style={styles.inner_text}>
                            {t('common:approve')}
                          </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.button}>
                          <Text style={styles.inner_text}>
                            {t('common:Decline')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </View>
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
      paddingRight: spacing.fiften * 2,
      fontWeight: '600',
    },
    box: {
      width: SPACING * 32,
      borderWidth: 1,
      flexDirection: 'row',
      justifyContent: 'space-between',
      height: SPACING * 70,
      borderRadius: SPACING * 3,
      borderColor: '#ccc',
      padding: 4,
      marginBottom: 16,
    },
    inner_text: {
      fontSize: 17,
      color: 'white',
      alignSelf: 'center',
      fontWeight: '500',
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'android' ? 0 : -12,
      padding: SPACING * 1.8,
      fontSize: 17,
      fontWeight: '500',
    },
    inner: {
      width: SPACING * 28,
      borderWidth: 1,
      marginTop: SPACING * 2,
      justifyContent: 'space-between',
      height: SPACING * 20,
      borderRadius: SPACING * 3,
      borderColor: '#ccc',
      padding: spacing.ten * 1.5,
    },
    View: {
      marginVertical: 8,
      flexDirection: 'row',
      width: '100%',
      borderWidth: 1,
      justifyContent: 'space-between',
      borderRadius: SPACING * 9,
      height: spacing.twenty * 2.9,
      borderColor: '#BBBBBB',
    },
    rightIcon: {
      marginRight: SPACING * 2,
      marginTop: SPACING * 2,
    },
    leftIcon: {
      marginLeft: SPACING * 2.5,
      marginTop: SPACING * 1.5,
    },
    displayText: {
      fontSize: 18,
    },
    button: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#FF5842',
      borderRadius: SPACING * 6,
      width: '50%',
      height: spacing.fiften * 3,
      marginTop: SPACING * 2,
      marginRight: spacing.twenty * 2,
    },
    button_Blue: {
      justifyContent: 'center',
      alignSelf: 'center',
      backgroundColor: '#2260A6',
      borderRadius: SPACING * 6,
      width: '50%',
      height: spacing.fiften * 3,
      marginTop: SPACING * 2,
      marginRight: spacing.ten,
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
      marginVertical: SPACING,
    },
  });

export default ApprovalInput;
