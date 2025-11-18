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
         
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={home}  />}
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
                icon={() => <Image style={styles.menuIcon} source={info} />}
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

           

            {/* career page */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => (
                  <Image style={styles.menuIcon} source={career} />
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
          

          

            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={language} />}
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
   
    wrapper: {marginBottom: -spacing.ten},

    menuIcon: {height: 20, width: 20, marginRight:spacing.fiften},
  });
