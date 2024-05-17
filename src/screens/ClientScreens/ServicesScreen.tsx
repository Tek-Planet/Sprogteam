import React from 'react';
// import SPACING from './SPACING';
import {
  View,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {useNavigation, useTheme} from '@react-navigation/native';
import {spacing} from '../../assets/spacing';
import {Header} from '../../components';
import {getServices, isIpad, width} from '../../utils';
import {fonts} from '../../assets/fonts';
import baseStyles from '../../assets/styles';
import {useAppSelector} from '../../rtk/hooks';
import {useGetServicesQuery} from '../../rtk/services';
import {logo} from '../../assets/images';

const ServicesScreen = () => {
  const navigation: any = useNavigation();
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {authenticated} = useAppSelector(state => state.user);
  const {defaultLanguage} = useAppSelector(state => state.user);

  const {data: services, error} = useGetServicesQuery('');

  console.log(error);

  return (
    <View style={{...styles.container, ...baseStyles.padding}}>
      <Header
        showDrawer={authenticated ? false : true}
        headerTitle={t('common:services')}
        showRightIcon
      />
      <View style={{marginTop: 5}}>
        <FlatList
          numColumns={2}
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 10,
          }}
          keyExtractor={item => item.value}
          data={services ? services : []}
          renderItem={({item, index}) => {
            let label: string =
              defaultLanguage?.code === 'dk'
                ? item?.labeldk || item?.label
                : item?.label;
            return (
              <TouchableOpacity
                key={index}
                onPress={() => {
                  // console.log(item.value);
                  navigation.navigate('GigNav', {
                    screen: 'GigByServiceId',
                    params: {service: item},
                  });
                }}
                style={[styles.filterBox]}>
                <Image
                  resizeMode="contain"
                  style={{
                    height: 80,
                    width: 80,
                  }}
                  source={item.image ? item.image : logo}
                />
                <Text style={[styles.filterText]}>{label.toUpperCase()}</Text>
              </TouchableOpacity>
            );
          }}
        />
      </View>
    </View>
  );
};

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    filterText: {
      marginTop: 10,
      fontFamily: fonts.bold,
      fontSize: 13,
      textAlign: 'center',
      color: colors.black,
    },
    filterBox: {
      margin: 5,
      borderRadius: 10,
      height: 160,
      width: isIpad ? width * 0.2 : width * 0.45,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

export default ServicesScreen;
