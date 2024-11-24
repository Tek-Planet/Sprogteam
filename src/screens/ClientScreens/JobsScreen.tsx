import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text, ScrollView} from 'react-native';

import {fontSize, fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';

import {
  QuoteListItem,
  CustomInput,
  Header,
  BookingListItem,
} from '../../components';
import {useAppSelector} from '../../rtk/hooks';

import {BookingModel, QuoteType} from '../../types';
import {
  useGetBookingsQuery,
  useGetOpenBookingsQuery,
  useGetQuotesQuery,
  useGetTranlatorLanguagesQuery,
} from '../../rtk/services';
import {RootStackParams} from '../../navigations/MainNavigation';
import {dateToMilliSeconds, getCurrentDate} from '../../utils';

type Props = NativeStackScreenProps<RootStackParams>;

const JobsScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const {user} = useAppSelector(state => state.user);

  const [filter, setFilter] = useState<string>('');

  const {
    data: quoteData,
    isLoading,
    isFetching,
  } = useGetQuotesQuery('', {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const [filterQuoteData, setFilterQuoteData] = useState<QuoteType[]>([]);

  // console.log(openBookings?.length);

  const {data} = useGetBookingsQuery('', {
    pollingInterval: 45000,
    refetchOnMountOrArgChange: true,
  });

  const userId = user.Id;
  const email = user.Email;

  const {data: userLanguages} = useGetTranlatorLanguagesQuery(
    {userId, email},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  let tuple = userLanguages ? userLanguages?.map(obj => obj.value) : [];

  // let tuple = [10, 12, 21]
  let userLanguagesToTuple: any =
    tuple.length > 0 ? '(' + tuple?.join(', ') + ')' : 'non';
  let genderId : number = user?.GenderId ? user?.GenderId : 0

  const {data: openBookings, error} = useGetOpenBookingsQuery({userLanguagesToTuple, genderId}, {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const [filterData, setFilterData] = useState<BookingModel[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          (item.StatusName === 1 || item.StatusName === 8) &&
          dateToMilliSeconds(item.DateTimeEnd) >
            dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filteredData);
    }
  }, [data]);

  useEffect(() => {
    if (quoteData) {
      const filteredData = quoteData.filter(
        item =>
          item.QuoteStatusId === 1 &&
          item.CreateBy !== user.Id &&
          dateToMilliSeconds(getCurrentDate().toISOString()) <
            dateToMilliSeconds(item.DeadlineDate),
      );

      setFilterQuoteData(filteredData);
    }
  }, [quoteData]);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        location="CreateQuote"
        headerTitle={t('common:jobs')}
        showRightIcon
      />

      {/* {isLoading && <CustomLoader color={colors.main} />} */}
      <ScrollView>
        <View style={{padding: spacing.ten}}>
          <CustomInput
            showleftIcon
            placeholder={t('common:search') + ' ' + t('common:jobs')}
            leftIconName="search"
            onTextChange={setFilter}
            value={filter}
            onEnterPress={() => {
              // onSubmit();
            }}
          />
          {/* {filterData?.length === 0 && !isLoading && <CustomEmptyList />} */}

          {/* for all quotes */}
          <Text style={styles.title}>
            {t('common:quotes') + ' ' + t('common:jobs')}{' '}
            {filterQuoteData?.length}
          </Text>

          <FlatList
            keyExtractor={item => item.QuoteID.toString()}
            data={filterQuoteData ? filterQuoteData : []}
            renderItem={({item, index}) => {
              if (item.QuoteID.toString().includes(filter))
                return (
                  <QuoteListItem
                    onPress={() => {
                      navigation.navigate('QuoteDetails', {item});
                    }}
                    item={item}
                  />
                );
              else return null;
            }}
          />

          <Text style={styles.title}>
            {t('common:direct') + ' ' + t('common:booking')}{' '}
            {filterData?.length}
          </Text>

          <FlatList
            keyExtractor={item => item.BookingID.toString()}
            data={filterData}
            renderItem={({item, index}) => {
              if (item.BookingID.toString().includes(filter))
                return (
                  <BookingListItem
                    onPress={() => {
                      navigation.navigate('BookingDetails', {item});
                    }}
                    item={item}
                  />
                );
              else return null;
            }}
          />

          {/* open boookings section */}
          <Text style={styles.title}>
            {t('common:booking') + ' ' + t('common:jobs')}{' '}
            {openBookings?.length}
          </Text>
          <FlatList
            contentContainerStyle={{
              paddingBottom: spacing.twenty,
            }}
            keyExtractor={item => item.BookingID.toString()}
            data={openBookings ? openBookings : []}
            renderItem={({item}) => {
              if (item.BookingID.toString().includes(filter))
                return (
                  <BookingListItem
                    onPress={() => {
                      navigation.navigate('BookingDetails', {item});
                    }}
                    item={item}
                  />
                );
              else return null;
            }}
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default JobsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
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
    title: {
      fontFamily: fonts.bold,
      color: colors.black,
      fontSize: 16,
      paddingHorizontal: spacing.five,
      marginVertical: spacing.ten,
    },
  });
