import React from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {useTranslation} from 'react-i18next';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {career, gservice, home, info, language, logo} from '../assets/images';
import {spacing} from '../assets/spacing';

import Feather from 'react-native-vector-icons/Feather';
import {width} from '../utils';
import {useTheme} from '@react-navigation/native';
import {CustomButton} from '../components';

export function GuestDrawerContent(props: any) {
  const {navigation} = props;
  // const navigation: any = useNavigation();

  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        <View style={styles.drawerContent}>
          <Pressable
            onPress={() => {
              navigation.toggleDrawer();
            }}
            style={{position: 'absolute', right: spacing.fiften, zIndex: 10}}>
            <Feather name="x" size={25} color={colors.main} />
          </Pressable>
          <View style={styles.userInfoSection}>
            <View style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <Image
                  source={logo}
                  style={{width: 80, height: 80, borderRadius: 100}}
                />
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    ...styles.title,
                    fontSize: fontSize.bold,
                    paddingTop: spacing.fiften,
                  }}>
                  {t('common:menu')}
                </Text>
              </View>
            </View>
          </View>

          <View>
            {/* booking section */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={home} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:home')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('Home');
                }}
              />
            </View>

            {/* menu */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={info} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:about')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('About');
                }}
              />
            </View>

            {/* written booking section */}
            {/* <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={gservice} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:services')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('GuestServices');
                }}
              />
            </View> */}

            {/* career page */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => (
                  <Image style={{width: 25, height: 25}} source={career} />
                )}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:career')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('Carrer');
                }}
              />
            </View>
            {/* interpreter handbook */}
            {/* <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={faq} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>
                      {t('common:faq').toUpperCase()}
                    </Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('FAQ');
                }}
              />
            </View> */}

            {/* gig section for interpreter */}

            {/* end of gig section */}
            {/* <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={blog} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:blog')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('Blog');
                }}
              />
            </View> */}

            {/* Acceptable behaviou */}

            {/* Privacy policy */}

            {/* <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={cservice} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>
                      {t('common:contact') + ' ' + t('common:us')}
                    </Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              />
            </View> */}

            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={language} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:language')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('LanguageSelector');
                }}
              />
            </View>

            {/* <Pressable
              onPress={() => {
                navigation.navigate('OrderInterpreter');
              }}
              style={styles.button}>
              <Feather name="home" color={colors.white} size={22} />

              <Text
                style={{
                  ...styles.title,
                  marginStart: spacing.twenty,
                  color: colors.white,
                }}>
                {t('common:home')}
              </Text>
            </Pressable> */}
          </View>

          {/* submenu item */}

          <View style={{padding: spacing.ten, marginTop: spacing.fiften}}>
            <CustomButton
              buttonTitle={t('common:log_in')}
              onTap={() => {
                {
                  navigation.navigate('Login');
                  navigation.toggleDrawer();
                }
              }}
            />

            <CustomButton
              buttonTitle={t('common:sign_up')}
              onTap={() => {
                navigation.navigate('AccountType');
              }}
              bGcolor={colors.white}
              testColor={colors.main}
              borderWidth={2}
            />
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    drawerContent: {
      flex: 1,
      paddingStart: spacing.ten,
    },
    userInfoSection: {
      marginTop: -5,
      padding: 10,
      paddingStart: spacing.fiften,
    },
    title: {
      fontSize: fontSize.medium,
      marginTop: 3,
      fontFamily: fonts.bold,
      color: colors.black,
    },

    button: {
      flexDirection: 'row',
      backgroundColor: colors.main,
      borderRadius: spacing.twenty * 5,
      padding: spacing.fiften - 2,
      alignItems: 'center',
      paddingStart: spacing.twenty,
      margin: spacing.ten,
      marginTop: spacing.twenty,
    },

    menuTitle: {
      fontFamily: fonts.medium,
      fontSize: fontSize.light,
      color: colors.black,
      opacity: 0.7,
    },

    subMenuTitle: {
      fontFamily: fonts.regular,
      fontSize: fontSize.intermediate,
      color: colors.black,
      marginLeft: -spacing.twenty,
    },
    menuDrawetItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width * 0.6,
      alignItems: 'center',
      marginLeft: -spacing.twenty,
    },
    subMenuView: {marginStart: spacing.twenty * 1.8},
    subMenuDrawerItem: {marginTop: -spacing.twenty + 2},
    wrapper: {marginBottom: -spacing.ten},
  });
