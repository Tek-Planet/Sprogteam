import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import {fonts} from '../../assets/fonts';

import {useTranslation} from 'react-i18next';

import {searchGiGs} from '../../data/data';
import {ActivityIndicator, GigList, ProfileHeader} from '../../components';
import {colors} from '../../assets/colors';
import TranslatorSearchList from '../../components/TranlatorsSearchList';

const SearchScreen = () => {
  const {t} = useTranslation();

  const [filter, setFilter] = useState(null);
  const [selected, setSelected] = useState(0);
  const [gigs, setGigs] = useState([]);
  const [translatorList, setTranslatorList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showFilterText, setShowFilterText] = useState(false);

  async function fetchData() {
    // You can await here
    setLoading(true);

    const res = await searchGiGs(filter);
    if (selected === 0) setGigs(res);
    else setTranslatorList(res);
    console.log(res[0].userId);
    if (res.length === 0) setShowFilterText(true);
    setLoading(false);
  }

  const setKeyWord = val => {
    if (showFilterText) setShowFilterText(false);
    setFilter(val);
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <ProfileHeader
        onsubmit={fetchData}
        showSearchBar
        placeholder={t('common:search')}
        setValue={setKeyWord}
        filter={filter}
      />
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          margin: 10,
        }}>
        <TouchableOpacity
          style={[
            selected === 0 && {
              borderBottomWidth: 2,
              borderColor: colors.main,
            },
            {width: '50%', alignItems: 'center'},
          ]}
          onPress={() => {
            setSelected(0);
            setFilter('');
            setShowFilterText(false);
          }}>
          <Text style={styles.packagePrice}>{t('common:gig')}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            selected === 1 && {
              borderBottomWidth: 2,
              alignItems: 'center',
              borderColor: colors.main,
            },
            {width: '50%', alignItems: 'center'},
          ]}
          onPress={() => {
            setSelected(1);
            setFilter('');
            setShowFilterText(false);
          }}>
          <Text style={styles.packagePrice}>{t('common:sellers')}</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View
          style={{height: 200, alignItems: 'center', justifyContent: 'center'}}>
          <ActivityIndicator size="large" show={loading} />
        </View>
      ) : selected === 0 ? (
        gigs.length > 0 ? (
          <FlatList
            keyExtractor={(item, index) => index.toString()}
            data={gigs}
            renderItem={({item}) => {
              return <GigList customer item={item} />;
            }}
          />
        ) : (
          showFilterText &&
          filter.length > 0 && (
            <Text style={styles.noResult}>
              {t('common:no_result')} {filter}
            </Text>
          )
        )
      ) : translatorList.length > 0 ? (
        <FlatList
          keyExtractor={item => item.ID}
          data={translatorList}
          renderItem={({item}) => {
            return <TranslatorSearchList gigInfo={item} />;
          }}
        />
      ) : (
        showFilterText &&
        filter.length > 0 && (
          <Text style={styles.noResult}>
            {t('common:no_result')} {filter}
          </Text>
        )
      )}
    </View>
  );
};

export default SearchScreen;

const styles = StyleSheet.create({
  filterBox: {
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 13,
    textAlign: 'center',
  },
  packagePrice: {
    fontFamily: fonts.bold,
    margin: 10,
    fontSize: 16,
    color: colors.main,
    width: 100,
    textAlign: 'center',
  },
  noResult: {
    textAlign: 'center',
    marginTop: 50,
    fontFamily: fonts.light,
    fontSize: 16,
  },
});
