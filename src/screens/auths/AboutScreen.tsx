import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  Pressable,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton, Header} from '../../components';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {isIpad, width} from '../../utils';
import {about_plain, hand, lan, lan2, stars} from '../../assets/images';
import Feather from 'react-native-vector-icons/Feather';

const AboutScreen = () => {
  const navigation: any = useNavigation();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const users = [
    {
      label: t('common:customers'),
      value: '3000+',
      image: hand,
    },
    {
      label: t('common:employees'),
      value: '400+',
      image: stars,
    },
    {
      label:
        t('common:best') +
        ' ' +
        t('common:word') +
        ' ' +
        t('common:translated'),
      value: '',
      image: lan,
    },
    {
      label: t('common:language') + ' ' + t('common:experts'),
      value: '',
      image: lan2,
    },
  ];

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        headerTitle={t('common:about') + ' ' + t('common:us')}
        showDrawer
      />
      <View style={{flex: 1}}>
        <ScrollView>
          {/* bottom section */}
          <View style={{margin: spacing.ten}}>
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:about_commit')} :
            </Text>

            <ImageBackground
              style={{
                height: 200,
                marginVertical: spacing.ten,
              }}
              source={about_plain}
            />

            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:about_info')}
            </Text>
            <Text style={{...styles.text, fontFamily: fonts.light}}>
              {t('common:about_info_details')} :
            </Text>

            <View style={{width: width * 0.5, marginVertical: spacing.ten}}>
              <CustomButton
                onTap={() => {
                  navigation.navigate('Login');
                }}
                padding={2}
                buttonTitle={t('common:get') + ' ' + t('common:srarted')}
              />
            </View>

            {/* sefives section */}

            <FlatList
              contentContainerStyle={{
                paddingBottom: spacing.twenty,
              }}
              numColumns={2}
              keyExtractor={item => item.value}
              data={users}
              renderItem={({item, index}) => {
                return (
                  <View key={index} style={[styles.filterBox]}>
                    <Image
                      resizeMode="contain"
                      style={{
                        height: 50,
                        width: 50,
                        marginStart: spacing.ten,
                      }}
                      source={item.image}
                    />
                    <View
                      style={{
                        flex: 1,
                        alignItems: 'center',
                      }}>
                      {item.value.length > 0 && (
                        <Text
                          style={{
                            ...styles.filterText,
                            fontSize: fontSize.bold,
                          }}>
                          {item.value}
                        </Text>
                      )}

                      <Text style={[styles.filterText]}>{item.label}</Text>
                    </View>
                  </View>
                );
              }}
            />
            {/* our work section */}
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:about_ourwork')}
            </Text>
            <Text style={{...styles.text, fontFamily: fonts.light}}>
              {t('common:about_ourwork_details')} :
            </Text>

            <View style={{width: width * 0.5, marginVertical: spacing.ten}}>
              <CustomButton
                onTap={() => {
                  navigation.navigate('Login');
                }}
                padding={2}
                buttonTitle={t('common:get_started')}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default AboutScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      textAlign: 'justify',
    },
    title: {
      fontFamily: fonts.medium,
      fontSize: fontSize.medium,
      color: colors.black,
      marginBottom: spacing.five,
    },

    filterText: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: colors.black,
    },
    filterBox: {
      flexDirection: 'row',
      margin: 5,
      borderRadius: 10,
      height: 100,
      width: isIpad ? width * 0.2 : width * 0.45,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      alignItems: 'center',
    },
  });
