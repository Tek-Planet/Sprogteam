import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {ActivityIndicator, GigList} from '../../components';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getGiGs} from '../../data/data';
import {FAB} from 'react-native-paper';
import {Header} from '../../components';
import {useTranslation} from 'react-i18next';

const GigsScreen = ({navigation}) => {
  const {t} = useTranslation();

  const {gigs, setGigs, user, reloadgigs, setReloadGigs} =
    useContext(AuthContext);

  async function fetchData() {
    // You can await here

    const res = await getGiGs(user.profile.Id);

    setGigs(res);
    setReloadGigs(false);
  }

  useEffect(() => {
    if (reloadgigs) fetchData();
  }, [reloadgigs]);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header navigation={navigation} />
      <FAB
        color="#fff"
        style={{
          position: 'absolute',
          backgroundColor: '#659ED6',
          margin: 16,
          right: 0,
          bottom: 10,
          zIndex: 1,
        }}
        small
        icon="plus"
        onPress={() => navigation.navigate('NewGig')}
      />

      <FlatList
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !reloadgigs ? (
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                margin: 10,
                fontFamily: fonts.light,
                fontSize: 16,
              }}>
              {t('common:list_empty')}
            </Text>
          ) : (
            <View style={{marginTop: 30}}>
              <ActivityIndicator size={'large'} show={reloadgigs} />
            </View>
          )
        }
        keyExtractor={item => item.ID}
        data={gigs}
        renderItem={({item, index}) => {
          // console.log(item.request);
          return <GigList item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default GigsScreen;
