import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {fontSize} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';

import {
  QuoteListItem,
  CustomInput,
  CustomLoader,
  Header,
  CustomEmptyList,
} from '../../components';
import {useAppSelector} from '../../rtk/hooks';

import {QuoteType} from '../../types';
import {useGetQuotesQuery} from '../../rtk/services';
import {RootStackParams} from '../../navigations/MainNavigation';
import {dateToMilliSeconds, getCurrentDate} from '../../utils';

type Props = NativeStackScreenProps<RootStackParams>;

const QuoteScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const {user} = useAppSelector(state => state.user);

  // console.log(user.Id);
  const [filter, setFilter] = useState<string>('');

  const {data, error, isLoading, isFetching} = useGetQuotesQuery('', {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const [filterData, setFilterData] = useState<QuoteType[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          item.QuoteStatusId === 2 &&
          dateToMilliSeconds(item.DeadlineDate) >
            dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filteredData);
    }
  }, [data]);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        location="CreateQuote"
        headerTitle={t('common:quotes')}
        showRightIcon
      />

      {isLoading && <CustomLoader color={colors.main} />}

      <View style={{padding: spacing.ten}}>
        <CustomInput
          showleftIcon
          placeholder={t('common:search') + ' ' + t('common:quote')}
          leftIconName="search"
          onTextChange={setFilter}
          value={filter}
          onEnterPress={() => {
            // onSubmit();
          }}
        />
        {filterData?.length === 0 && !isLoading && <CustomEmptyList />}

        <FlatList
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 10,
          }}
          keyExtractor={item => item.QuoteID.toString()}
          data={filterData}
          renderItem={({item, index}) => {
            return (
              <QuoteListItem
                onPress={() => {
                  navigation.navigate('QuoteDetails', {item});
                }}
                item={item}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default QuoteScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#fff',
      padding: 10,
      borderColor: '#2260A6',
      borderWidth: 2,
      borderRadius: 30,
      width: '100%',
      height: spacing.fiften * 4.3,
      marginBottom: 10,
    },
    buttonText: {
      color: '#2260A6',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
  });

const qdat = [
  {
    AcceptAmount: 0,
    ClientId: '273059a0-6f11-4fd6-9a64-298b2db041bf',
    CreateBy: '273059a0-6f11-4fd6-9a64-298b2db041bf',
    CreateDate: '2023-10-30T09:31:23.319Z',
    CurrencyId: 1,
    CustomerAmount: 0,
    CustomerServiceChargeAmount: 0,
    CustomerServiceChargePer: 0,
    DeadlineDate: '2023-10-31T00:00:00.000Z',
    DeadlineNewDate: null,
    DeadlineNewTime: null,
    DeadlineTime: '2023-10-30T02:00:00.000Z',
    Descriptions:
      'Herfra tilbyder vi oversættelses- og tolkningsopgaver i alle afskygninger. Vores talentfulde og alsidige tolke og oversættere tilbyder tolkning og oversættelse på mere end 60 forskellige sprog og dialekter. Vi aktiverer også gerne vores store netværk, for at imødekomme netop dine behov. Vi byder på både generalister og specialister foruden en stærk vifte af andre relevante sprog- og kulturmæssige ydelser. Se eventuelt listen over de tjenester vi tilbyder nederst på siden og kontakt os endelig hvis du har spørgsmål eller behov for assistance til en opgave.',
    EstimatedBudget: 100,
    FromLanguageId: 11,
    GID: 0,
    IsActive: true,
    IsPaymentPaid: false,
    PaymentTransactionId: null,
    QuoteFile:
      'https://sprogteamdev.blob.core.windows.net/writtentask/WhatsApp%20Image%202023-09-29%20at%2011.12.12.jpeg',
    QuoteID: 21,
    QuoteStatusId: 1,
    ServiceId: 6,
    TaskId: 1,
    Title: 'Check 101',
    ToLanguageId: 14,
    TotalAmount: 0,
    TranslatorAmount: 0,
    TranslatorId: null,
    TranslatorServiceChargeAmount: 0,
    TranslatorServiceChargePer: 0,
    UpdateBy: null,
    UpdateDate: '0001-01-01T00:00:00.000Z',
    VerificationFile: null,
  },
];
