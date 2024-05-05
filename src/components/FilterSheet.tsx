import React, {useCallback, useMemo, useRef, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';

import {fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';

import BottomSheet from '@gorhom/bottom-sheet';
import {useTranslation} from 'react-i18next';

import baseStyles from '../assets/styles';
import {
  CountryPicker,
  CustomButton,
  CustomLanguageDropDown,
  CustomTopTab,
} from '.';
import {SelectOptionType, TabItem} from '../types';
import {useAppSelector} from '../rtk/hooks';
import {useGetLanguagesQuery, useGetSubServicesQuery} from '../rtk/services';
import {initialSelect, width} from '../utils';

interface FilterSheetProps {
  setFilterParameters: (
    country: string,
    fromLanguage: string,
    toLanguage: string,
    serviceId: string,
  ) => void;

  setShowFileSheet: (val: Boolean) => void;
  countryValue: string;
  language: SelectOptionType;
  setLanguage: (val: SelectOptionType) => void;

  tolanguage: SelectOptionType;
  setToLanguage: (val: SelectOptionType) => void;
  serviceId: string;
  selected: any;
  setSelected: (val: any) => void;
}

function FilterSheet(props: FilterSheetProps) {
  const {
    setShowFileSheet,
    setFilterParameters,
    countryValue,
    language,
    setLanguage,
    tolanguage,
    setToLanguage,
    serviceId,
    selected,
    setSelected,
  } = props;
  const {user} = useAppSelector(state => state.user);
  const {data, error, isLoading} = useGetLanguagesQuery('', {});

  const {data: subServices, error: subServicesError} = useGetSubServicesQuery(
    serviceId,
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  const [country, setCountry] = useState(
    countryValue.length > 0 ? countryValue : 'Select',
  );
  const [countryCallingCode, setCountryCallingCode] = useState('+00');

  const bottomSheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ['80%', '90%'], []);

  // callbacks
  const handleSheetChanges = useCallback((index: number) => {
    if (index === -1) setShowFileSheet(false);
  }, []);

  return (
    <BottomSheet
      backgroundStyle={{...baseStyles.elevation}}
      handleIndicatorStyle={{
        backgroundColor: colors.main,
        width: 60,
        height: 10,
      }}
      enablePanDownToClose={true}
      ref={bottomSheetRef}
      index={0}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}>
      <View style={{...styles.contentContainer}}>
        {/* horizontal list */}

        <Text
          style={{
            ...styles.title,
            fontFamily: fonts.bold,
            textAlign: 'center',
          }}>
          {t('common:filter_header')}
        </Text>

        <Text
          style={{
            ...styles.title,
            marginBottom: spacing.ten,
            textAlign: 'center',
          }}>
          {t('common:filter_subheader')}
        </Text>

        {subServices && subServices.length > 0 && (
          <View>
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:category')}
            </Text>
            <CustomTopTab
              selected={selected}
              setSelected={setSelected}
              tabItems={subServices}
              isButton={true}
            />
          </View>
        )}

        {/* country picker */}
        <Text style={styles.title}>{t('common:country')}</Text>
        <CountryPicker
          code={'DK'}
          setCountryCallingCode={setCountryCallingCode}
          setCountry={setCountry}
          country={country}
        />

        {/* from langage to language */}

        <CustomLanguageDropDown
          label={t('common:from') + ' ' + t('common:language')}
          value={language}
          options={data ? data : []}
          setValue={setLanguage}
          title={t('common:available') + ' ' + t('common:language')}
          showSearch
        />

        <CustomLanguageDropDown
          label={t('common:to') + ' ' + t('common:language')}
          value={tolanguage}
          options={data ? data : []}
          setValue={setToLanguage}
          title={t('common:available') + ' ' + t('common:language')}
          showSearch
        />

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-evenly',
          }}>
          <View style={{width: width * 0.45}}>
            <CustomButton
              buttonTitle={t('common:apply')}
              onTap={() => {
                setFilterParameters(
                  country,
                  language.value,
                  tolanguage.value,
                  selected.value,
                );
              }}
            />
          </View>
          <View style={{width: width * 0.45}}>
            <CustomButton
              buttonTitle={t('common:reset')}
              onTap={() => {
                setCountry('Select');
                setLanguage(initialSelect());
                setToLanguage(initialSelect());
                setSelected({});
                setFilterParameters('Select', 'Select', 'Select', 'Select');
              }}
            />
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}

export default FilterSheet;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    contentContainer: {
      // flex: 1,
      backgroundColor: colors.white,
      padding: spacing.ten,
    },

    title: {
      color: colors.black,
      fontSize: 16,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
      paddingHorizontal: spacing.five,
    },
  });
