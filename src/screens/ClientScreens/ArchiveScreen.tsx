import React, {useCallback, useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {fontSize} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';

import {
  BookingListItem,
  CustomEmptyList,
  CustomInput,
  CustomLoader,
  Header,
} from '../../components';
import {useGetBookingsQuery} from '../../rtk/services/bookings';
import {BookingModel} from '../../types';
import {dateToMilliSeconds, getCurrentDate, timeToString} from '../../utils';
import {RootStackParams} from '../../navigations/MainNavigation';
import MonthPicker from 'react-native-month-year-picker';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<RootStackParams, 'Archive'>;

const ArchiveScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [filter, setFilter] = useState<string>('');
  const [monthFilter, setMonthFilter] = useState<string>('');

  const [date, setDate] = useState(new Date());
  const [show, setShow] = useState(false);

  const {data, error, isLoading, isFetching} = useGetBookingsQuery('', {
    // pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const [filterData, setFilterData] = useState<BookingModel[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          item.DateTimeStart.includes(monthFilter) &&
          dateToMilliSeconds(item.DateTimeEnd) <
            dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filteredData);
    }
  }, [data, monthFilter]);

  const onValueChange = useCallback(
    (event, newDate) => {
      const selectedDate = newDate || date;
      setShow(false);
      setDate(selectedDate);

      const splittedDate = timeToString(selectedDate);
      let month: any = splittedDate.month;
      let year: any = splittedDate.year;
      if (month === 12) {
        month = 0o1;
        year += 1;
      } else month = selectedDate === date ? month : month + 1;
      month = month > 9 ? month : '0' + month;

      setMonthFilter((year + '-' + month).toString());
    },
    [date],
  );

  useEffect(() => {
    const splittedDate = timeToString(new Date());
    let month: any = splittedDate.month;
    let year: any = splittedDate.year;

    month = month > 9 ? month : '0' + month;

    setMonthFilter((year + '-' + month).toString());
  }, []);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header showleftIcon headerTitle={t('common:archive')} />

      {isLoading && <CustomLoader color={colors.main} />}

      <View style={{padding: spacing.ten}}>
        <CustomInput
          showleftIcon
          placeholder={t('common:search') + ' ' + t('common:bookings')}
          leftIconName="search"
          onTextChange={setFilter}
          value={filter}
          onEnterPress={() => {
            // onSubmit();
          }}
        />
        {filterData?.length === 0 && !isLoading && (
          <CustomEmptyList
            message={
              t('common:no') +
              ' ' +
              t('common:record') +
              ' ' +
              t('common:for') +
              ' ' +
              monthFilter
            }
          />
        )}

        <FlatList
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 10,
          }}
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
      </View>

      <View
        style={{
          flexDirection: 'row',
          right: 25,
          position: 'absolute',
        }}>
        <Feather
          onPress={() => {
            setShow(!show);
          }}
          name="calendar"
          size={25}
          color={colors.main}
          style={{marginEnd: spacing.twenty}}
        />

        <Feather
          onPress={() => {
            setMonthFilter('');
          }}
          name="list"
          size={25}
          color={colors.main}
        />
      </View>
      {show && (
        <MonthPicker
          onChange={onValueChange}
          value={date}
          // locale="ko"
        />
      )}
    </View>
  );
};

export default ArchiveScreen;

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
