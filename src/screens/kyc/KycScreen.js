import React, {useContext, useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {KycList, ProfileHeader} from '../../components';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {getDocs} from '../../data/data';
import {FAB} from 'react-native-paper';
import {useTranslation} from 'react-i18next';

const KycScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const {docs, setDocs, user} = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (route.params?.doc) {
      setDocs(route.params?.doc);
    }
  }, [route.params?.doc]);

  async function fetchData() {
    // You can await here

    console.log('fetching data');

    const res = await getDocs(user.profile.Id);

    setDocs(res);

    // console.log(res);

    setLoading(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {/* <Header navigation={navigation} /> */}
      <ProfileHeader />
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
        onPress={() => navigation.navigate('NewKYC')}
      />

      <FlatList
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !loading && (
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                margin: 10,
                fontFamily: fonts.light,
                fontSize: 16,
              }}>
              {t('common:start_verify')}
            </Text>
          )
        }
        keyExtractor={item => item.DID}
        data={docs}
        renderItem={({item, index}) => {
          // console.log(item.request);
          return <KycList item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default KycScreen;
