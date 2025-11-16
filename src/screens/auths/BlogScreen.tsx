import React from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Image,
  FlatList,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton, Header} from '../../components';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {blogs, isIpad, width} from '../../utils';
import {placeholder} from '../../assets/images';
import {AuthStackParams} from '../../navigations/AuthNavigation';

type Props = NativeStackScreenProps<AuthStackParams, 'Blog'>;

const BlogScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header headerTitle={t('common:blog')} showleftIcon />
      <View style={{flex: 1}}>
        <ScrollView>
          {/* bottom section */}
          <View style={{margin: spacing.ten}}>
            <ImageBackground
              style={{
                height: 200,
                marginVertical: spacing.ten,
              }}
              source={blogs[0].image}
            />

            <Text
              style={{
                ...styles.title,
              }}>
              {blogs[0].label}
            </Text>
            <Text style={{...styles.text, fontFamily: fonts.light}}>
              {blogs[0].value} :
            </Text>

            <View
              style={{
                width: width * 0.5,
                marginVertical: spacing.ten,
                alignSelf: 'center',
              }}>
              <CustomButton
                onTap={() => {
                  navigation.navigate('BlogDetails', {item: blogs[0]});
                }}
                padding={2}
                buttonTitle={t('common:read') + ' ' + t('common:more')}
              />
            </View>

            {/* our work section */}
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:all') + ' ' + t('common:post')}
            </Text>

            <FlatList
              contentContainerStyle={{
                paddingBottom: spacing.twenty,
              }}
              numColumns={2}
              keyExtractor={item => item.label}
              data={blogs}
              renderItem={({item, index}) => {
                return (
                  <View key={index} style={{...styles.teamBox}}>
                    <Image
                      resizeMode="stretch"
                      style={{
                        height: 70,
                        width: '100%',
                        alignSelf: 'center',
                      }}
                      source={item.image}
                    />
                    <Text
                      style={{
                        ...styles.filterText,
                        marginTop: spacing.ten,
                        textAlign: 'center',
                      }}>
                      {item.label.substring(0, 50)}
                    </Text>

                    <CustomButton
                      onTap={() => {
                        navigation.navigate('BlogDetails', {item});
                      }}
                      padding={1}
                      textSize={12}
                      buttonTitle={t('common:read') + ' ' + t('common:more')}
                    />
                  </View>
                );
              }}
            />
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default BlogScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      textAlign: 'justify',
    },
    title: {
      fontFamily: fonts.medium,
      fontSize: fontSize.regular,
      color: colors.black,
      marginBottom: spacing.five,
    },

    filterText: {
      fontFamily: fonts.medium,
      fontSize: 13,
      color: colors.black,
    },

    teamBox: {
      justifyContent: 'space-between',
      margin: 5,
      borderRadius: 10,
      padding: spacing.five,
      width: isIpad ? width * 0.2 : width * 0.45,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      alignItems: 'center',
      position: 'relative',
    },
  });
