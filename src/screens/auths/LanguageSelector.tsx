import React, {useState, useEffect} from 'react';
import {TouchableOpacity, Text, View, ScrollView, Image} from 'react-native';

import {fontSize, fonts} from '../../assets/fonts';
import {denmarkflag, englandflag, logo} from '../../assets/images';
import {LanguageType} from '../../types';
import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../../assets/spacing';
import {useNavigation, useTheme} from '@react-navigation/native';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {getStoredLanguage, storeLanguage} from '../../utils';
import {CustomButton, Header} from '../../components';
import {setDefaultLanguage} from '../../rtk/features/user/userSlice';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';

const LANGUAGES: LanguageType[] = [
  {image: denmarkflag, code: 'dk', label: 'Dansk'},
  {image: englandflag, code: 'en', label: 'English'},
  // {image: logo, code: 'fr', label: 'Français'},
  // {image: logo, code: 'de', label: 'German'},
  // {image: logo, code: 'es', label: 'Spanish'},
];

function LanguageSelector() {
  const {defaultLanguage} = useAppSelector(state => state.user);

  const dispatch = useAppDispatch();
  const navigation = useNavigation();

  const {colors} = useTheme();

  const {t, i18n} = useTranslation();

  const setLanguage = async (item: LanguageType) => {
    await storeLanguage(item);

    dispatch(setDefaultLanguage(item));
    return i18n.changeLanguage(item.code);
  };

  // useEffect(() => {
  //   const initialiseLanguage = async () => {
  //     var response = await getStoredLanguage();

  //     setValue(response);
  //   };

  //   initialiseLanguage();
  // }, []);

  return (
    <View
      style={{
        flex: 1,
        padding: spacing.ten,
      }}>
      <Header
        headerTitle={t('common:change') + ' ' + t('common:language')}
        showleftIcon
      />
      <View style={{flex: 1, justifyContent: 'space-between'}}>
        <ScrollView>
          {LANGUAGES.map((item, index) => {
            return (
              <TouchableOpacity
                key={index.toString()}
                onPress={() => {
                  // setModalVisible(false);
                  setLanguage(item);
                }}
                style={{
                  ...baseStyles.elevation,
                  flexDirection: 'row',
                  padding: spacing.ten,
                  margin: spacing.five,
                  backgroundColor:
                    item.code === defaultLanguage?.code
                      ? colors.main
                      : colors.white,
                  borderRadius: spacing.ten * 3,
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingEnd: spacing.twenty,
                  marginBottom: spacing.ten,
                }}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Image
                    style={{
                      width: 23,
                      height: 23,
                      marginEnd: 15,
                      borderRadius: 100,
                    }}
                    source={item.image}
                  />

                  <Text
                    style={{
                      opacity: item.code === defaultLanguage?.code ? 1 : 0.6,
                      fontFamily: fonts.medium,
                      padding: 5,
                      color:
                        item.code === defaultLanguage?.code
                          ? colors.white
                          : colors.black,
                      fontSize: fontSize.regular,
                    }}>
                    {item.label}
                  </Text>
                </View>
                {item.code === defaultLanguage?.code && (
                  <Feather
                    color={colors.white}
                    name={'check-circle'}
                    size={20}
                  />
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <CustomButton
          buttonTitle={t('common:done')}
          onTap={() => {
            navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

export default LanguageSelector;
