import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';

import {fontSize} from '../../assets/fonts';
import {useNavigation, useTheme} from '@react-navigation/native';
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
import {useGetInboxsQuery} from '../../rtk/services/message';
import {BookingModel} from '../../types';
import {dateToMilliSeconds, getCurrentDate} from '../../utils';
import {useGetServiceChargeQuery} from '../../rtk/services';

const BookingScreen = () => {
  const {t} = useTranslation();
  const navigation: any = useNavigation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  // const {user} = useAppSelector(state => state.user);

  const [filter, setFilter] = useState<string>('');

  const {data, error, isLoading, isFetching} = useGetBookingsQuery('', {
    pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const {data: Inbox} = useGetInboxsQuery('', {});

  const {data: ServiceCharge} = useGetServiceChargeQuery('', {});

  const [filterData, setFilterData] = useState<BookingModel[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          (item.StatusName === 2 || item.StatusName === 3) &&
          dateToMilliSeconds(item.DateTimeEnd) >
            dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filteredData);
    }
  }, [data]);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        location="OrderInterpreter"
        headerTitle={t('common:booking')}
        showRightIcon
      />

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
        {filterData?.length === 0 && !isLoading && <CustomEmptyList />}
        <FlatList
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 10,
          }}
          keyExtractor={item => item.BookingID.toString()}
          data={filterData}
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
    </View>
  );
};

export default BookingScreen;

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
