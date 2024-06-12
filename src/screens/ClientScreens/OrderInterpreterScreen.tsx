import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {RootStackParams} from '../../navigations/MainNavigation';
import {
  CountryPicker,
  CustomButton,
  CustomLanguageDropDown,
  CustomError,
  CustomInput,
  CustomLoader,
  DatePicker,
  Header,
} from '../../components';
import {SelectOptionType} from '../../types';
import {useGetLanguagesQuery} from '../../rtk/services/language';
import {initialLanguage} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParams>;

const OrderInterpreterScreen = ({navigation}: Props) => {
  const user = useAppSelector(state => state.user);

  const {data, error, isLoading} = useGetLanguagesQuery('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [zipCode, setZipCode] = useState<string>('');

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [language, setLanguage] = useState<SelectOptionType>(initialLanguage);
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [startTime, setStartTime] = useState<Date | undefined>(undefined);
  const [endTime, setEndTime] = useState<Date | undefined>(undefined);
  const [country, setCountry] = useState('Denmark');

  // console.log(language);
  const onSubmit = async () => {
    // if (language.value === 'Select') {
    //   setErrorMessage(t('common:select') + ' ' + t('language'));
    //   return;
    // }
    setErrorMessage('');
    let searchParameter: any = {
      language,
      zipCode,
      country,
    };
    if (date !== undefined) searchParameter.date = date;
    if (startTime !== undefined) searchParameter.startTime = startTime;
    if (endTime !== undefined) searchParameter.endTime = endTime;
    navigation.navigate('Tanslators', {searchParameter});
  };

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        headerTitle={t('common:order') + ' ' + t('interpreter')}
        showleftIcon
        showRightIcon
      />
      {isLoading ? (
        <CustomLoader />
      ) : (
        <View style={{padding: spacing.ten}}>
          <ScrollView>
            <KeyboardAwareScrollView>
              <CustomLanguageDropDown
                value={language}
                options={data ? data : []}
                setValue={setLanguage}
                title={t('common:available') + ' ' + t('common:language')}
                showSearch
              />

              <DatePicker
                date={date}
                setDate={setDate}
                title={t('common:date')}
              />

              <CustomInput
                // rightIconName="arrow-down"
                placeholder={t('common:zipcode')}
                onTextChange={setZipCode}
                value={zipCode}
                // showRightIcon
              />

              <CountryPicker
                country={country}
                code={'DK'}
                setCountry={setCountry}
              />

              <DatePicker
                date={startTime}
                setDate={setStartTime}
                title={t('common:start') + ' ' + t('common:time')}
                mode="time"
              />

              <DatePicker
                date={endTime}
                setDate={setEndTime}
                title={t('common:end') + ' ' + t('common:time')}
                mode="time"
              />

              {erroMessage.length > 0 && <CustomError message={erroMessage} />}
              <CustomButton
                buttonTitle={t('common:search')}
                onTap={() => {
                  onSubmit();
                }}
              />

              <CustomButton
                buttonTitle={t('common:order_anonymous_interpreter')}
                onTap={() => {
                  navigation.navigate('OrderInterpreterAnonymous');
                }}
                bGcolor={colors.white}
                borderColor={colors.main}
                testColor={colors.main}
                borderWidth={2}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default OrderInterpreterScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
      marginTop: spacing.ten,
    },
    buttonText: {
      color: '##2260A6',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    Text: {
      color: colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      marginTop: 2,
      fontFamily: fonts.bold,
    },
  });
