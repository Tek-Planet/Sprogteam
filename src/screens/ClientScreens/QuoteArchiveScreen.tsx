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

type Props = NativeStackScreenProps<RootStackParams, 'QuoteArchive'>;

const QuoteScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();

  const {colors} = useTheme();
  const styles = getStyles(colors);

  const {user} = useAppSelector(state => state.user);

  // console.log(user.Id);
  const [filter, setFilter] = useState<string>('');

  const {data, error, isLoading, isFetching} = useGetQuotesQuery('', {
    // pollingInterval: 60000,
    refetchOnMountOrArgChange: true,
  });

  const [filterData, setFilterData] = useState<QuoteType[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          dateToMilliSeconds(item.DeadlineDate) <
          dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filteredData);
    }
  }, [data]);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        showleftIcon
        headerTitle={t('common:archive') + ' ' + t('common:quotes')}
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
          renderItem={({item}) => {
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
