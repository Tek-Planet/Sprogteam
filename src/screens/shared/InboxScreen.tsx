import React from 'react';
import {Text, Image, View, StyleSheet, FlatList, Pressable} from 'react-native';
import {placeholder} from '../../assets/images';
import {CustomLoader, Header} from '../../components';

import {fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import baseStyles from '../../assets/styles';
import {RootStackParams} from '../../navigations/MainNavigation';
import {useGetInboxsQuery} from '../../rtk/services';
import {useAppSelector} from '../../rtk/hooks';
import {supportId} from '../../utils';

interface InboxScreenProps {}

type Props = NativeStackScreenProps<RootStackParams>;

const InboxScreen = ({navigation}: Props) => {
  const {data, error, isLoading, isFetching} = useGetInboxsQuery('', {
    refetchOnMountOrArgChange: true,
    pollingInterval: 30000,
  });
  const {user} = useAppSelector(state => state.user);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  return (
    <View style={{...baseStyles.padding, ...styles.container}}>
      <Header showleftIcon showRightIcon headerTitle={t('common:Inbox')} />
      <View style={{padding: spacing.ten}}>
        {isLoading && <CustomLoader color={colors.main} />}

        <FlatList
          contentContainerStyle={{
            paddingBottom: spacing.twenty * 4,
          }}
          keyExtractor={item => item.Id}
          data={isLoading ? [] : data}
          renderItem={({item, index}) => {
            const lastMsg = item.lastMsg;
            return (
              <Pressable
                onPress={() => {
                  navigation.navigate('Chats', {item: item});
                }}
                style={{
                  flexDirection: 'row',
                  padding: spacing.ten,
                  borderRadius: spacing.ten * 3,
                  marginBottom: spacing.ten,
                  backgroundColor: '#E7E8ED',
                }}>
                <View>
                  <Image
                    resizeMode="contain"
                    style={styles.image}
                    source={
                      item.ProfilePicture !== 'default'
                        ? {uri: item.ProfilePicture}
                        : placeholder
                    }
                  />
                </View>

                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <View>
                      <Text style={styles.name}>
                        {item.Id === supportId ? 'Support' : item.FirstName}
                      </Text>
                    </View>
                    {/* <Text style={styles.time}>12:00 am</Text> */}
                  </View>
                  <Text
                    style={[
                      styles.msg,
                      !lastMsg?.status &&
                        lastMsg?.SenderId !== user?.Id && {
                          fontFamily: fonts.bold,
                        },
                    ]}>
                    {lastMsg !== null && lastMsg.text !== null
                      ? // check if last mesage is lastMsg.isOffer
                        lastMsg.isOffer
                        ? 'Booking Offer'
                        : lastMsg.text
                      : //
                        'media'}
                  </Text>
                </View>
              </Pressable>
            );
          }}
        />
      </View>
    </View>
  );
};

export default InboxScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    image: {
      height: 50,
      width: 50,
      borderRadius: 100,
    },
    msg: {
      marginTop: 5,
      fontFamily: fonts.medium,
      color: colors.black,
    },
    content: {
      marginLeft: 16,
      flex: 1,
    },

    contentHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
    },

    name: {
      fontSize: 16,
      fontFamily: fonts.medium,
      color: colors.black,
    },
  });
