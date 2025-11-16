import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, FlatList} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';

import {
  WrittenListItem,
  CustomEmptyList,
  Header,
  CustomLoader,
} from '../../components';
import {useGetWrittenQuery} from '../../rtk/services';
import {WrittenBooking} from '../../types';
import {dateToMilliSeconds, getCurrentDate} from '../../utils';
import {RootStackParams} from '../../navigations/MainNavigation';

type Props = NativeStackScreenProps<RootStackParams, 'Written'>;

const WrittenScreen = ({navigation}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {data, error, isLoading} = useGetWrittenQuery(
    '',

    {
      // pollingInterval: 60000,
      refetchOnMountOrArgChange: true,
    },
  );

  const [filterData, setFilterData] = useState<WrittenBooking[]>([]);

  useEffect(() => {
    if (data) {
      const filteredData = data.filter(
        item =>
          item.Salaryinterpreter === 2 &&
          dateToMilliSeconds(item.Deadline) >
            dateToMilliSeconds(getCurrentDate().toString()),
      );

      setFilterData(filterData);
    }
  }, [data]);

  return (
    <ScrollView>
      <View style={{...styles.container, ...baseStyles.padding}}>
        <Header
          headerTitle={t('common:written') + ' ' + t('common:booking')}
          showleftIcon
          showRightIcon
          location="CreateWriten"
        />
        {isLoading && <CustomLoader color={colors.main} />}

        <View style={{padding: spacing.ten}}>
          {filterData?.length === 0 && !isLoading && <CustomEmptyList />}
          <FlatList
            contentContainerStyle={{
              paddingBottom: spacing.twenty * 10,
            }}
            keyExtractor={item => item.Id.toString()}
            data={filterData}
            renderItem={({item, index}) => {
              return (
                <WrittenListItem
                  onPress={() => {
                    navigation.navigate('WrittenBookingDetails', {item});
                  }}
                  item={item}
                />
              );
            }}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default WrittenScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
  });
