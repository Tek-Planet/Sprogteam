import React, {useState, useContext, useEffect} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, FlatList} from 'react-native';

import Header from '../../components/Header';

import {CheckBox} from 'react-native-elements';
import {fonts} from '../../assets/fonts';
import {AuthContext} from '../../context/AuthProvider';

import {ScrollView} from 'react-native';

import {useTranslation} from 'react-i18next';
import {getBookingToken} from '../../util/util';
import {
  getTranslators,
  getTranslatorsLocally,
  storeTranslators,
} from '../../data/data';
import {TranlatorsListDirect} from '../../components';
import {colors} from '../../assets/colors';

const AllTranslatorsScreen = ({navigation}) => {
  const {
    translators,
    setTranslators,
    refreshing,
    setRefreshing,
    info,
    user,
    auth,
    setToken,
  } = useContext(AuthContext);
  const {t} = useTranslation();

  const [translatorList, setTranslatorList] = useState(
    refreshing ? [] : translators,
  );

  const [policeApproved, setPoliceApproved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [skills, setSkills] = useState([]);
  const country = user.profile.Country ? user.profile.Country : 'Denmark';
  const checkForPoliceApproved = () => {
    let list = [];
    for (let translator of translators) {
      let languages = translator.info.languages;
      for (let language of languages) {
        if (language.PoliceApprove) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
  };

  const checkForSkills = current => {
    let list = [];
    for (let translator of translators) {
      let languages = translator.info.skills;
      for (let language of languages) {
        if (language.label === current) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
  };

  const searchLanguage = current => {
    let list = [];
    for (let translator of translators) {
      let languages = translator.info.languages;
      for (let language of languages) {
        const tempLanguage =
          language.label && language.label !== null ? language.label : '';
        if (
          tempLanguage.toLowerCase().includes(current.toLowerCase()) ||
          translator.info.City.toLowerCase().includes(current.toLowerCase()) ||
          translator.info.Zipcode.toString().includes(current) ||
          translator.info.FirstName.toString().includes(current) ||
          translator.info.LastName.toString().includes(current)
        ) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
  };

  const onRefresh = () => {
    setRefreshing(true);
    getTranslators(country);
  };

  useEffect(() => {
    const skils = [
      {label: t('common:label1'), value: 'Teknisk oversættelse'},
      {label: t('common:label2'), value: 'Juridisk oversættelse'},
      {label: t('common:label3'), value: 'Sundhedsoversættelse'},
      {label: t('common:label4'), value: 'Almen oversættelse'},
      {label: t('common:label5'), value: 'SEO-oversættelse'},
      {label: t('common:label6'), value: 'Tekstforfatter'},
      {label: t('common:label7'), value: 'Transskribering'},
      {label: t('common:label8'), value: 'Korrekturlæsning'},
      {label: t('common:label9'), value: 'Retssager'},
    ];

    setSkills(skils);
  }, []);

  const fetchData = async () => {
    // console.log(user.profile.MunicipalTasks);
    const transResLocal = await getTranslatorsLocally();

    if (transResLocal.length > 0) {
      setTranslators(transResLocal);
      setTranslatorList(transResLocal);
      setRefreshing(false);
    }
    const res = await getTranslators(country);
    if (res.length > 0) {
      setTranslators(res);
      setTranslatorList(res);
      setRefreshing(false);
      storeTranslators(res);
    }
    setRefreshing(false);
    const bookingToken = await getBookingToken();
    setToken(bookingToken);
  };

  // this one here lsiten to token
  useEffect(() => {
    if (auth) fetchData();

    // const unsubscribe = fetchData(); //subscribe
    // return unsubscribe; //unsubscribe
  }, []);

  const listheader = () => (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-evenly',
        }}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('OtherNav', {
              screen: 'Nearby',
            })
          }
          style={[
            styles.filterBox,
            {
              backgroundColor: '#659ED6',
              width: 160,
              marginTop: 5,
              padding: 10,
              alignItems: 'center',
            },
          ]}>
          <Text style={[styles.filterText, {color: '#fff'}]}>
            {t('common:nearby_interpreter')}
          </Text>
        </TouchableOpacity>

        <View
          style={{width: '50%', flexDirection: 'row', alignItems: 'center'}}>
          <CheckBox
            onPress={() => {
              if (!policeApproved) {
                checkForPoliceApproved();
                setPoliceApproved(true);
              } else {
                setTranslatorList(translators);
                setPoliceApproved(false);
              }
            }}
            checked={policeApproved}
          />
          <Text style={[styles.filterText, {flex: 1}]}>
            {t('common:police_approved')}
          </Text>
        </View>
      </View>
      {/* this take the skills list */}
      <ScrollView style={{marginBottom: 10}} horizontal>
        {skills.map((item, index) => {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                if (selected === item.value) {
                  setSelected(null);
                  setTranslatorList(translators);
                } else {
                  setSelected(item.value);
                  checkForSkills(item.value);
                }
              }}
              style={[
                styles.filterBox,
                {
                  padding: 6,
                  backgroundColor: selected === item.value && '#659ED6',
                },
              ]}>
              <Text
                style={[
                  styles.filterText,
                  {color: selected === item.value ? '#fff' : '#000'},
                ]}>
                {item.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  return (
    <View style={{backgroundColor: colors.white, flex: 1}}>
      <Header
        searchLanguage={searchLanguage}
        navigation={navigation}
        showSearchBar={true}
      />

      {/* <Text>   {JSON.stringify(translators)}</Text> */}

      <View>
        {/* <Header/> */}
        <View style={{marginStart: 8, marginEnd: 8, marginBottom: 100}}>
          {/* fauvourite list section  */}

          <FlatList
            refreshing={refreshing}
            onRefresh={onRefresh}
            // ListHeaderComponent={listheader}
            ListEmptyComponent={
              !refreshing && (
                <Text
                  style={{
                    textAlign: 'center',
                    fontFamily: fonts.light,
                    color: colors.black,
                    marginTop: 20,
                  }}>
                  {t('common:list_empty')}
                </Text>
              )
            }
            keyExtractor={item => item.info.Id}
            data={translatorList}
            renderItem={({item}) => {
              return (
                <TranlatorsListDirect
                  item={item.info}
                  index={1}
                  navigation={navigation}
                  info={info}
                />
              );
            }}
          />
        </View>
      </View>
    </View>
  );
};

export default AllTranslatorsScreen;

const styles = StyleSheet.create({
  filterBox: {
    margin: 3,
    padding: 3,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 10,
    minWidth: 80,
  },
  filterText: {
    fontFamily: fonts.bold,
    fontSize: 12,
    textAlign: 'center',
  },
});
