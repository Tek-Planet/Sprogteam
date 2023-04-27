import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, TouchableOpacity, StyleSheet} from 'react-native';
import Header from '../components/Header';
import {fonts} from '../assets/fonts';
import {AuthContext} from '../context/AuthProvider';
import dayjs from 'dayjs';
import {getNews} from '../data/data';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/colors';

const NewsScreen = ({navigation}) => {
  const {user} = useContext(AuthContext);
  const {t} = useTranslation();

  // console.log(user);
  const [refreshing, setRefreshing] = useState(true);

  const [news, setNews] = useState([]);

  async function fetchData() {
    // You can await here
    const columm =
      user.profile.interpreter || user.profile.interpreter === 1
        ? 'onlyTranslator'
        : 'onlyCustomer';

    const res = await getNews(columm);
    setNews(res);
    setRefreshing(false);
  }

  useEffect(() => {
    if (user && user !== null) {
      fetchData();
    }
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchData();
  };

  return (
    <View>
      {/* <Header navigation={navigation} /> */}

      <FlatList
        refreshing={refreshing}
        onRefresh={onRefresh}
        ListEmptyComponent={
          !refreshing && (
            <Text
              style={{
                color: colors.black,
                textAlign: 'center',
                margin: 10,
                fontFamily: fonts.bold,
              }}>
              No News At this Time
            </Text>
          )
        }
        style={styles.root}
        data={news}
        ItemSeparatorComponent={() => {
          return <View style={styles.separator} />;
        }}
        keyExtractor={item => {
          return item.createdAt;
        }}
        renderItem={item => {
          return (
            <View style={styles.container}>
              <View style={styles.content}>
                <View style={styles.contentHeader}>
                  <TouchableOpacity
                    onPress={() => navigation.navigate('Message')}>
                    <Text style={styles.name}>{item.item.Heading}</Text>
                  </TouchableOpacity>
                  <Text style={[styles.name, {fontSize: 12}]}>
                    {' '}
                    {dayjs(item.createdAt).format('DD-MM-YYYY HH:mm A')}
                  </Text>
                </View>
                <Text style={styles.body}>{item.item.Body}</Text>
                <TouchableOpacity
                  onPress={() =>
                    navigation.navigate('OtherNav', {
                      screen: 'NewsDetails',
                      params: {info: item.item},
                    })
                  }>
                  <Text style={styles.continue}>
                    {t('common:continue') + ' ' + t('common:reading')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          );
        }}
      />
    </View>
  );
};

export default NewsScreen;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: colors.white,
    shadowColor: 'grey',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.9,
    shadowRadius: 5,
    elevation: 5,
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

  name: {
    fontSize: 16,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  body: {
    fontSize: 16,
    fontFamily: fonts.light,
    textAlign: 'justify',
    color: colors.black,
  },
  continue: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: fonts.medium,
    color: colors.main,
  },
});
