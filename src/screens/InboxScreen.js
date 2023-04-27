import React, {useContext, useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
} from 'react-native';
import {AuthContext} from '../context/AuthProvider';
import {fonts} from '../assets/fonts';
import {Header, ActivityIndicator} from '../components';
import {getInbox} from '../data/data';
import {colors} from '../assets/colors';
import {useTranslation} from 'react-i18next';

const MyInbox = ({navigation}) => {
  const {t} = useTranslation();

  const {inbox, user, setInbox} = useContext(AuthContext);
  const [refreshingInbox, setRefreshingInbox] = useState(true);
  const onRefresh = async () => {
    setRefreshingInbox(true);
    fetchData();
  };

  const fetchData = async () => {
    const res = await getInbox(user.profile.Id);
    setInbox(res);
    setRefreshingInbox(false);
    // console.log(res);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header navigation={navigation} />

      {refreshingInbox && inbox.length === 0 ? (
        <ActivityIndicator size="large" show={refreshingInbox} color={'red'} />
      ) : (
        <FlatList
          refreshing={refreshingInbox}
          onRefresh={onRefresh}
          ListEmptyComponent={
            <Text
              style={{
                textAlign: 'center',
                fontFamily: fonts.light,
                color: colors.black,
                marginTop: 20,
              }}>
              {t('common:list_empty')}
            </Text>
          }
          style={styles.root}
          data={inbox}
          ItemSeparatorComponent={() => {
            return <View style={styles.separator} />;
          }}
          keyExtractor={item => {
            return item.resuil.Id;
          }}
          renderItem={item => {
            const lastMsg = item.item.lastMsg;

            var image = item.item.resuil.ProfilePicture;
            return (
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('OtherNav', {
                    screen: 'ChatScreen',
                    params: {
                      info: item.item.resuil,
                      inboxID: item.item.inboxId,
                      type: 2,
                    },
                  })
                }
                style={styles.container}>
                <View>
                  <Image
                    style={styles.image}
                    source={
                      image && image !== null && image !== 'default'
                        ? {uri: image}
                        : require('../assets/imgs/paulo.png')
                    }
                  />
                  {/* <Mcicons
                    style={{position: 'absolute', bottom: -10, right: -5}}
                    name={'circle-medium'}
                    size={36}
                    color={
                      item.item.resuil.Online === 'online' ? 'green' : 'grey'
                    }
                  /> */}
                </View>

                <View style={styles.content}>
                  <View style={styles.contentHeader}>
                    <TouchableOpacity>
                      <Text style={styles.name}>
                        {item.item.resuil.FirstName}
                      </Text>
                    </TouchableOpacity>
                    {/* <Text style={styles.time}>12:00 am</Text> */}
                  </View>
                  <Text
                    style={[
                      styles.msg,
                      !lastMsg?.status &&
                        lastMsg?.SenderId !== user?.profile?.Id && {
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
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
};

export default MyInbox;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 5,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.5,
    shadowRadius: 2,
    elevation: 5,
  },
  content: {
    marginLeft: 16,
    flex: 1,
  },

  contentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  separator: {
    height: 1,
    backgroundColor: '#CCCCCC',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 100,
  },
  time: {
    fontSize: 11,
    color: '#808080',
  },
  name: {
    marginTop: 10,
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },

  msg: {
    marginTop: 5,
    fontFamily: fonts.medium,
    color: colors.black,
  },
});
