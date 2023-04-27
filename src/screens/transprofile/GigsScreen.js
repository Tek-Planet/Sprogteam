import React, {useEffect, useState} from 'react';
import {View, Text, FlatList} from 'react-native';
import {GigListFull} from '../../components';
import {fonts} from '../../assets/fonts';
import {getGiGs} from '../../data/data';
import {colors} from '../../assets/colors';
import {useTranslation} from 'react-i18next';

const GigsScreen = ({route}) => {
  const {t} = useTranslation();

  const {profile} = route.params;
  const [reloadgigs, setReloadGigs] = useState(true);

  const {Id} = profile;

  const [gigs, setGigs] = useState(null);
  async function fetchData() {
    // You can await here

    const res = await getGiGs(Id);
    setGigs(res);
    setReloadGigs(false);
  }

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={{flex: 1, backgroundColor: colors.white}}>
      <FlatList
        style={{marginBottom: 50}}
        ListEmptyComponent={
          !reloadgigs && (
            <Text
              style={{
                color: '#000',
                textAlign: 'center',
                margin: 10,
                fontFamily: fonts.light,
                fontSize: 16,
              }}>
              {t('common:no') + ' ' + t('common:gig') + ' ' + t('common:found')}
            </Text>
          )
        }
        keyExtractor={item => item.ID}
        data={gigs}
        renderItem={({item, index}) => {
          // console.log(item.request);
          return <GigListFull item={item} index={index} />;
        }}
      />
    </View>
  );
};

export default GigsScreen;
