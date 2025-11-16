import React, {useEffect, useState} from 'react';
import {View, StyleSheet, FlatList, Text} from 'react-native';
import {fonts} from '../../assets/fonts';
import {useNavigation, useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {
  CustomEmptyList,
  CustomError,
  CustomInput,
  CustomLoader,
  GigItem,
  Header,
} from '../../components';
import {
  useGetMostOrderedGigsQuery,
  useSearchGigQuery,
} from '../../rtk/services';
import {width} from '../../utils';

const SearchScreen = () => {
  const navigation: any = useNavigation();
  const [filter, setFilter] = useState<any>('');
  const [search, setSearch] = useState<any>('');
  const [skip, setSkip] = useState<boolean>(true);

  const {data, error, isLoading, isFetching} = useSearchGigQuery(filter, {
    refetchOnMountOrArgChange: true,
    skip: filter.length === 0 ? true : false,
  });

  const {data: mostOrdered, error: mostOrderedError} =
    useGetMostOrderedGigsQuery('', {
      refetchOnMountOrArgChange: true,
    });

  const [users, setUsers] = useState<any>(mostOrdered);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  useEffect(() => {
    if (mostOrdered && mostOrdered?.length > 0) {
      setUsers(mostOrdered);
    }
    if (data && data?.length > 0) {
      setUsers(data);
    }
  }, [data, mostOrdered]);

  return (
    <View style={{...styles.container}}>
      <Header headerTitle={t('search')} showRightIcon />

      <View style={{padding: spacing.ten}}>
        <CustomInput
          showleftIcon
          placeholder={t('common:search') + ' ' + t('common:gig')}
          leftIconName="search"
          onTextChange={setSearch}
          value={search}
          onEnterPress={() => {
            setFilter(search);
          }}
        />

        {data?.length === 0 &&
          !isLoading &&
          !isFetching &&
          filter.length > 3 && (
            <CustomEmptyList
              message={
                t('common:no') +
                ' ' +
                t('common:record') +
                ' ' +
                t('common:for') +
                ' ' +
                filter
              }
            />
          )}
        {error && (
          <View style={{marginTop: spacing.twenty}}>
            <CustomError message={'error fetching data'} />
          </View>
        )}

        {(isLoading || isFetching) && <CustomLoader color={colors.main} />}
        {mostOrdered === users && (
          <Text
            style={{
              ...styles.text,
            }}>
            Most Ordered Gigs
          </Text>
        )}
        <FlatList
          // numColumns={2}
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 13,
          }}
          keyExtractor={item => item?.ID}
          data={users ? users : []}
          renderItem={({item}) => {
            return (
              // <UserCardItem
              //   onPress={() => {
              //     navigation.navigate('GigNav', {
              //       screen: 'GigProfileDetails',
              //       params: {item},
              //     });
              //   }}
              //   onContact={() => {
              //     navigation.navigate('Chats', {
              //       item,
              //     });
              //   }}
              //   onClickFavourite={() => {}}
              //   item={item}
              //   key={item.Id}
              //   title={t('common:details')}
              // />
              <GigItem item={item} />
            );
          }}
        />
      </View>
    </View>
  );
};

export default SearchScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },

    text: {
      color: colors.black,
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: 16,
      fontFamily: fonts.bold,
    },
  });
