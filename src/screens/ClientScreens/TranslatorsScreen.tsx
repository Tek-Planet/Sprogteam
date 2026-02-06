import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {RootStackParams} from '../../navigations/MainNavigation';
import {
  CustomEmptyList,
  CustomLoader,
  Header,
  UserCardItem,
} from '../../components';
import {useSearchTranslatorQuery} from '../../rtk/services';

type Props = NativeStackScreenProps<RootStackParams, 'Tanslators'>;

const TranslatorsScreen = ({route, navigation}: Props) => {
  const {searchParameter} = route.params;
  let selectedLanguage = searchParameter.language;

  let language: any =
    selectedLanguage.value !== 'Select' ? selectedLanguage.value : '';
  let country = searchParameter.country;

  let zipcode = searchParameter.zipCode;
  const {data, error, isLoading} = useSearchTranslatorQuery(
    {
      country,
      zipcode,
      language,
    },
    {
      // pollingInterval: 60000,
      refetchOnMountOrArgChange: true,
    },
  );

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [zipCode, setZipCode] = useState<string>('');

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={t('common:order') + ' ' + t('interpreter')}
        showleftIcon
        showRightIcon
      />

      {data?.length === 0 && !isLoading && (
        <CustomEmptyList
          message={`${data.length} ${selectedLanguage.label} translators found in  ${country}  `}
        />
      )}
      {isLoading ? (
        <CustomLoader />
      ) : (
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
                    navigation.navigate('BookInterpreter', {
                      interpreter: item,
                      selectedLanguage,
                    });
                  }}
                  onContact={() => {
                    navigation.navigate('Chats', {
                      item,
                    });
                  }}
                  onClickFavourite={() => {}}
                  item={item}
                  key={item.Id}
                />
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default TranslatorsScreen;

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
