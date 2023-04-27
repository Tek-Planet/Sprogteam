import React, {useState, useContext, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet} from 'react-native';

import Header from '../../components/Header';

import {fonts} from '../../assets/fonts';
import {AuthContext} from '../../context/AuthProvider';
import {TranlatorsList} from '../../components';

const FavouriteScreen = ({navigation}) => {
  const {favourites, user, reloadFavourite, setReloadFavourite} =
    useContext(AuthContext);

  const [refreshing, setRefreshing] = useState(true);

  async function fetchData() {
    // You can await here
    if (favourites.length === 0) setReloadFavourite(true);
  }

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setReloadFavourite(true);
  };

  return (
    <View>
      <Header navigation={navigation} />

      <View style={{marginStart: 8, marginEnd: 8}}>
        {/* Other list section  */}

        <FlatList
          refreshing={reloadFavourite}
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
                Inge tolke at vise
              </Text>
            )
          }
          keyExtractor={item => item.info.Id}
          data={favourites}
          renderItem={({item, index}) => {
            return (
              <TranlatorsList
                key={index.toString()}
                item={item.info}
                index={index}
                favorite={true}
                filter={''}
              />
            );
          }}
        />
      </View>
    </View>
  );
};

export default FavouriteScreen;

const styles = StyleSheet.create({
  filterBox: {
    minWidth: 100,
  },

  statusText: {
    fontFamily: fonts.medium,
    color: '#000',
    fontSize: 13,
    marginTop: 10,
  },
});
