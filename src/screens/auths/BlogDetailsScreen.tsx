import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
  Pressable,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomButton, Header} from '../../components';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {blogs, width} from '../../utils';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<AuthStackParams, 'BlogDetails'>;

const BlogDetailsScreen = ({route, navigation}: Props) => {
  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [blog, setBlog] = useState(route.params.item);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        headerTitle={t('common:blog') + ' ' + t('common:details')}
        showleftIcon
      />
      <View style={{flex: 1}}>
        <ScrollView>
          {/* bottom section */}
          <View style={{margin: spacing.ten}}>
            <ImageBackground
              resizeMode="stretch"
              style={{
                height: 200,
                marginVertical: spacing.ten,
              }}
              source={blog.image}
            />

            <Text
              style={{
                ...styles.title,
              }}>
              {blog.label}
            </Text>
            <Text style={{...styles.text, fontFamily: fonts.light}}>
              {blog.value} :
            </Text>

            <View
              style={{
                width: width * 0.5,
                marginVertical: spacing.ten,
                alignSelf: 'center',
              }}></View>

            {/* our work section */}
            <Text
              style={{
                ...styles.title,
              }}>
              {t('common:latest') + ' ' + ' ' + t('common:post')}
            </Text>

            {blogs.map((item, index) => {
              return (
                <Pressable
                  onPress={() => {
                    setBlog(item);
                  }}
                  key={index}
                  style={{...styles.teamBox}}>
                  <Text
                    style={{
                      ...styles.filterText,
                      paddingEnd: spacing.ten,
                    }}>
                    {item.label.substring(0, 50)}
                  </Text>

                  <Feather
                    name={'chevron-right'}
                    size={20}
                    color={colors.black}
                  />
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default BlogDetailsScreen;

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
      flex: 1,
    },

    teamBox: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: spacing.ten,
      marginVertical: spacing.ten,
      margin: 5,
      borderRadius: 30,
      shadowColor: 'grey',
      shadowOffset: {width: 0, height: 1},
      shadowOpacity: 0.5,
      shadowRadius: 5,
      elevation: 5,
      backgroundColor: '#fff',
      paddingHorizontal: spacing.fiften,
    },
  });
