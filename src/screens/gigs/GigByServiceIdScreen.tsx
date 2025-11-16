import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {
  CustomEmptyList,
  CustomError,
  CustomLoader,
  FilterSheet,
  Header,
  UserCardItem,
} from '../../components';
import {useGetGigsByServiceIdQuery} from '../../rtk/services';
import {GigStackParams} from '../../navigations/GigNavigation';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {SelectOptionType} from '../../types';
import {initialSelect} from '../../utils';
import {setGigState, changeRoute} from '../../rtk/features/user/userSlice';

type Props = NativeStackScreenProps<GigStackParams, 'GigByServiceId'>;

const GigByServiceIdScreen = ({route}: Props) => {
  const {authenticated} = useAppSelector(state => state.user);
  const dispatch = useAppDispatch();

  const {service} = route.params;
  const navigation: any = useNavigation();
  const [showFileSheet, setShowFileSheet] = useState<Boolean>(false);
  const [selected, setSelected] = useState<any>({});
  const [country, setCountry] = useState<string>(
    '',
    // user?.Country ? user?.Country : 'Denmark',
  );

  const [fromLanguage, setFromLanguage] = useState<any>('');
  const [toLanguage, setToLanguage] = useState<any>('');

  const [language, setLanguage] = useState<SelectOptionType>(initialSelect());
  const [toLanguageOb, setToLanguageOb] = useState<SelectOptionType>(
    initialSelect(),
  );

  const [subServiceId, setSubServiceId] = useState<any>('');

  const serviceId: any = service.value;

  const {data, error, isLoading, isFetching} = useGetGigsByServiceIdQuery(
    {serviceId, country, fromLanguage, toLanguage, subServiceId},
    {
      refetchOnMountOrArgChange: true,
      refetchOnReconnect: true,
    },
  );

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const setFilterParameters = (
    countryLocal: string,
    fromLanguageLocal: string,
    toLanguageLocal: string,
    subServiceIdLocal: string,
  ) => {
    if (fromLanguageLocal !== 'Select')
      setFromLanguage(parseInt(fromLanguageLocal));
    else setFromLanguage('');
    if (toLanguageLocal !== 'Select') setToLanguage(parseInt(toLanguageLocal));
    else setToLanguage('');
    if (countryLocal !== 'Select') setCountry(countryLocal);
    else setCountry('');
    if (subServiceIdLocal !== 'Select') setSubServiceId(subServiceIdLocal);
    else setSubServiceId('');

    setShowFileSheet(false);
  };

  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <View style={{...styles.container}}>
        <Header
          headerTitle={service.label + ' ' + t('service')}
          showleftIcon
          showRightIcon
          showSort
          onSortClick={() => {
            setShowFileSheet(!showFileSheet);
          }}
        />

        {data?.length === 0 && !isLoading && (
          <CustomEmptyList
            message={`${data.length} ${service.label} translators found`}
          />
        )}
        {error && (
          <View style={{marginTop: spacing.twenty}}>
            <CustomError message={'error fetching data'} />
          </View>
        )}

        {(isLoading || isFetching) && <CustomLoader />}
        <View style={{padding: spacing.ten}}>
          <FlatList
            numColumns={2}
            contentContainerStyle={{
              paddingBottom: spacing.twenty * 4,
            }}
            keyExtractor={item => item?.Id}
            data={isLoading ? [] : data}
            renderItem={({item, index}) => {
              return (
                <UserCardItem
                  onPress={() => {
                    navigation.navigate('GigProfileDetails', {
                      item,
                      serviceId,
                    });
                  }}
                  onContact={() => {
                    if (authenticated)
                      navigation.navigate('Chats', {
                        item,
                      });
                    else {
                      // save the  gig to state
                      dispatch(setGigState(item));
                      dispatch(changeRoute('Chats'));
                      navigation.navigate('Login');
                    }
                  }}
                  onClickFavourite={() => {}}
                  item={item}
                  key={item.Id}
                  title={t('common:details')}
                />
              );
            }}
          />
        </View>

        {/* filter shett */}

        {showFileSheet && (
          <FilterSheet
            setFilterParameters={setFilterParameters}
            setShowFileSheet={setShowFileSheet}
            countryValue={country}
            language={language}
            setLanguage={setLanguage}
            tolanguage={toLanguageOb}
            setToLanguage={setToLanguageOb}
            serviceId={serviceId}
            selected={selected}
            setSelected={setSelected}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
};

export default GigByServiceIdScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 1,
      backgroundColor: colors.white,
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
