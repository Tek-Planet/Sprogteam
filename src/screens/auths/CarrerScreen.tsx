import React from 'react';
import {View, Text, ScrollView, StyleSheet} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton, Header} from '../../components';
import {useNavigation, useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {width} from '../../utils';
import {hand, lan, lan2, stars} from '../../assets/images';

const CarrerScreen = () => {
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
      <Header headerTitle={t('common:career')} showDrawer />
      <View style={{flex: 1}}>
        <ScrollView>
          {/* bottom section */}
          <View style={{margin: spacing.ten}}>
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:become_part')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:become_part_body')} :
            </Text>

            {/*become_part_condition  */}
            <Text style={{...styles.text}}>
              {t('common:become_part_condition')} :
            </Text>
            {/* criminal record section */}

            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:clean_record')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:clean_record_body')} :
            </Text>

            {/* bilingua */}
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:bilingua')}
            </Text>
            <Text style={{...styles.text}}>{t('common:bilingua_body')} :</Text>

            {/* experience */}
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:experience')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:experience_body')} :
            </Text>

            {/* translation area */}

            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:translation_area')}
            </Text>
            <Text style={{...styles.text}}>{t('common:label2')}</Text>
            <Text style={{...styles.text}}>
              {t('common:medical_translation')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:marketing_translation')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:technical_translation')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:authorized') + ' ' + t('common:translation')}
            </Text>

            {/* written condition */}

            <Text
              style={{
                ...styles.title,
                textAlign: 'justify',
              }}>
              {t('common:written_trans_condition')}
            </Text>
            <Text style={{...styles.text, textAlign: 'left'}}>
              {t('common:written_trans_condition_body')} :
            </Text>

            {/* written condition */}

            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:copy_writter')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:copy_writter_body')} :
            </Text>
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:proof_read')}
            </Text>
            <Text style={{...styles.text}}>
              {t('common:proof_read_body')} :
            </Text>
            <Text style={{...styles.text}}>{t('common:others_text')} :</Text>

            <View style={{width: width * 0.5, marginVertical: spacing.ten}}>
              <CustomButton
                onTap={() => {
                  navigation.navigate('AccountType');
                }}
                padding={2}
                buttonTitle={t('common:apply')}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default CarrerScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      textAlign: 'justify',
      fontFamily: fonts.light,
      marginVertical: spacing.five,
    },
    title: {
      fontFamily: fonts.medium,
      fontSize: fontSize.medium,
      color: colors.black,
    },
  });
