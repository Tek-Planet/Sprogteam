import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
  TouchableOpacity,
  Pressable,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton} from '../../components';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {isIpad, width} from '../../utils';
import {about_us, homebg, logo, logo_plain} from '../../assets/images';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import Feather from 'react-native-vector-icons/Feather';
import {useAppSelector} from '../../rtk/hooks';
import {useGetServicesQuery} from '../../rtk/services';

type Props = NativeStackScreenProps<AuthStackParams, 'Home'>;

const HomeScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {defaultLanguage} = useAppSelector(state => state.user);
  const {data: services, error} = useGetServicesQuery('');

  const teams = [
    {
      label: 'Dana ROBINSON',
      value: 'Marketing Consultant',
      image: 'https://sprogteam.dk/media/wtphts02/ucn03.png',
    },
    {
      label: 'Bernard COVA',
      value: 'Marketing - Auteur',
      image: 'https://sprogteam.dk/media/3naic10w/eurojusitlogo.png',
    },
    {
      label: 'Francis Guilbert',
      value: 'CEO',
      image: 'https://sprogteam.dk/media/jm3hrmpf/vingaadshuslogo.png',
    },
    {
      label: 'Georges WANET',
      value: 'Team Analyst',
      image: 'https://sprogteam.dk/media/qq3ffqct/aalborglogo.jpg',
    },
  ];

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <View style={{flex: 1}}>
        <Pressable
          onPress={() => {
            navigation.toggleDrawer();
          }}
          style={{
            position: 'absolute',
            left: spacing.fiften,
            zIndex: 10,
            top: 10,
          }}>
          <Feather name="menu" size={25} color={colors.white} />
        </Pressable>
        <ScrollView>
          <View>
            <ImageBackground
              style={{
                height: 300,
                alignItems: 'center',
                justifyContent: 'center',
                padding: spacing.ten,
              }}
              source={homebg}>
              <Image
                resizeMode="contain"
                style={styles.image}
                source={logo_plain}
              />

              {/* <Text
                style={{
                  ...styles.title,
                }}>
                Sprogteam
              </Text> */}

              <Text
                style={{
                  ...styles.text,
                  fontSize: fontSize.light,
                  fontFamily: fonts.medium,
                  color: colors.white,
                  textAlign: 'center',
                }}>
                {t('common:professional_text')}
              </Text>

              <CustomButton
                onTap={() => {
                  navigation.navigate('Login');
                }}
                buttonTitle={t('common:get_started').toUpperCase()}
              />
            </ImageBackground>

            {/* bottom section */}
            <View style={{margin: spacing.ten}}>
              <Text
                style={{
                  ...styles.title,
                  color: colors.black,

                  fontFamily: fonts.medium,
                }}>
                {t('common:about') + ' ' + t('common:us')} :
              </Text>

              <ImageBackground
                style={{
                  height: 200,
                }}
                source={about_us}
              />

              <Text
                style={{
                  ...styles.title,
                  color: colors.black,

                  fontFamily: fonts.medium,
                  fontSize: fontSize.medium,
                }}>
                {t('common:solid_text')}
              </Text>
              <Text style={{...styles.text, fontFamily: fonts.light}}>
                {t('common:solid_text_details')} :
              </Text>

              {/* sefives section */}

              {/* <Text
                style={{
                  ...styles.title,
                  color: colors.black,
                  textAlign: 'center',
                  fontFamily: fonts.medium,
                  marginBottom: spacing.ten,
                }}>
                {t('common:available_services')}
              </Text> */}

              {/* <FlatList
                numColumns={2}
                contentContainerStyle={{}}
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
                        }}
                        source={item.image ? item.image : logo}
                      />
                      <Text style={[styles.filterText]}>
                        {label.toUpperCase()}
                      </Text>
                    </TouchableOpacity>
                  );
                }}
              /> */}
            </View>

            {/* profesinal team section */}
            <View style={{margin: spacing.ten}}>
              <Text
                style={{
                  ...styles.title,
                  color: colors.black,

                  fontFamily: fonts.medium,
                }}>
                {t('common:team_colaboration')}
              </Text>

              <FlatList
                contentContainerStyle={{
                  paddingBottom: spacing.twenty,
                }}
                numColumns={2}
                keyExtractor={item => item.value}
                data={teams}
                renderItem={({item, index}) => {
                  return (
                    <TouchableOpacity key={index} style={{...styles.teamBox}}>
                      <Image
                        resizeMode="contain"
                        style={{
                          height: '100%',
                          width: '90%',
                          borderRadius: 100,
                          alignSelf: 'center',
                        }}
                        source={{uri: item.image}}
                      />
                    </TouchableOpacity>
                  );
                }}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default HomeScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      margin: spacing.five,
      textAlign: 'justify',
    },
    title: {
      marginTop: spacing.ten,
      fontSize: fontSize.bold,
      fontFamily: fonts.bold,
      color: colors.white,
    },
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
    seperator: {
      marginVertical: spacing.five,
    },
    image: {
      height: 80,
      width: 80,
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
    teamBox: {
      padding: 5,
      margin: 5,

      height: 110,
      width: isIpad ? width * 0.2 : width * 0.47,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
    },
  });
