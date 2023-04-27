import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

import {fonts} from '../assets/fonts';
import {AuthContext} from '../context/AuthProvider';

import {getTerms} from '../data/data';

const ChatScreen = ({navigation}) => {
  const {user, getBookings} = useContext(AuthContext);
  const [refreshing, setRefreshing] = useState(true);

  const [terms, setTerms] = useState([]);

  async function fetchData() {
    // You can await here
    const columm =
      user.profile.interpreter || user.profile.interpreter === 1
        ? 'onlyInterpreter'
        : 'onlyCustomer';

    const res = await getTerms('BehaviorPolice');
    setTerms(res);
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
    <FlatList
      refreshing={refreshing}
      onRefresh={onRefresh}
      ListEmptyComponent={
        !refreshing && (
          <Text
            style={{
              color: '#000',
              textAlign: 'center',
              margin: 10,
              fontFamily: fonts.bold,
            }}>
            empty
          </Text>
        )
      }
      style={styles.root}
      data={terms}
      ItemSeparatorComponent={() => {
        return <View style={styles.separator} />;
      }}
      keyExtractor={item => {
        return item.Description;
      }}
      renderItem={item => {
        return (
          <View style={styles.container}>
            <View style={styles.content}>
              <View style={styles.contentHeader}>
                <Text style={styles.name}>{item.item.title}</Text>
              </View>
              <Text style={styles.body}>{item.item.Description}</Text>
              {/* <TouchableOpacity
              // onPress={() =>
              //   navigation.navigate('OtherNav', {
              //     screen: 'NewsDetails',
              //     params: {info: item.item},
              //   })
              // }
              >
                <Text style={styles.continue}>Continue Reading</Text>
              </TouchableOpacity> */}
            </View>
          </View>
        );
      }}
    />
  );
};

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    borderRadius: 10,
    margin: 10,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fff',
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
    fontFamily: 'Montserrat-Medium',
  },
  body: {
    fontSize: 16,
    fontFamily: 'Montserrat-Light',
    textAlign: 'justify',
  },
  continue: {
    marginTop: 10,
    fontSize: 12,
    fontFamily: 'Montserrat-Medium',
    color: '#659ED6',
  },
});
