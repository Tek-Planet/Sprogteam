import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Image,
  Alert,
} from 'react-native';

import Header from '../../components/Header';
import TranlatorsList from '../../components/TranlatorsList';
import {fonts} from '../../assets/fonts';
import {AuthContext} from '../../context/AuthProvider';

import {useTranslation} from 'react-i18next';

import {
  getSkills,
  getTranslatorsByCountry,
  getTranslatorsByServiceId,
} from '../../data/data';

const HomeScreen = ({navigation, route}) => {
  const {id, serviceName} = route.params;
  // console.log(id, serviceName);
  const {location, transInfo, user} = useContext(AuthContext);
  var defaultCountry =
    user.profile.Country === null || user.profile.Country === undefined
      ? 'Denmark'
      : user.profile.Country;
  const {t} = useTranslation();
  // console.log(user.profile.Country);
  const [refreshing, setRefreshing] = useState(true);

  const [translators, setTranslators] = useState([]);
  const [translatorList, setTranslatorList] = useState([]);

  const [translatorSaved, setTranslatorSaved] = useState([]);

  const [policeApproved, setPoliceApproved] = useState(false);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState('');
  const [country, setCountry] = useState('');
  const [code, setCode] = useState('');

  const skills = getSkills();

  const fetchTranslators = async (Id, location) => {
    setRefreshing(true);

    const res = await getTranslatorsByServiceId(Id, location);
    if (res.length > 0) {
      setTranslators(res);
    } else {
      setCountry(defaultCountry);
    }

    setTranslatorList(res);
    // setRefreshing(false);
  };

  const fetchTranslatorsByCountry = async (Id, country) => {
    setRefreshing(true);

    const res = await getTranslatorsByCountry(Id, country);
    if (res.length > 0) {
      setTranslators(res);

      // setRefreshing(false);
    }

    setTranslatorList(res);
    setRefreshing(false);
  };

  const fetchTranslatorsByLocation = async () => {
    if (location !== null) fetchTranslators(id, location);
    else
      Alert.alert(
        'Unable to decode you location, check location settings and try again',
      );
  };

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
        if (language.value === current) {
          list.push(translator);
          break;
        }
      }
    }

    setTranslatorList(list);
  };

  const checkForServices = serviceID => {
    let list = [];
    for (let translator of translators) {
      let services = translator.info.services;
      for (let service of services) {
        if (service.value === serviceID) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
    setTranslatorSaved(list);
  };

  const checkForCountry = () => {
    let list = [];
    for (let translator of translators) {
      if (
        translator?.info?.Country !== null &&
        translator?.info?.Country.toLowerCase().includes(country.toLowerCase())
      ) {
        list.push(translator);
      }
    }
    setTranslatorList(list);
    setTranslatorSaved(list);
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
          translator.info.LastName.toString().includes(current) ||
          translator?.info?.State?.toString().includes(current) ||
          translator?.info?.Country?.toString().includes(current)
        ) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
  };

  const searchGIG = current => {
    setFilter(current);
    let list = [];
    for (let translator of translators) {
      let gigs = translator.info.gig;
      for (let gig of gigs) {
        if (
          gig.title.toLowerCase().includes(current.toLowerCase()) ||
          gig.title.toLowerCase().includes(current.toLowerCase()) ||
          gig.languageName.toLowerCase().includes(current.toLowerCase()) ||
          gig.service.toLowerCase().includes(current.toLowerCase())

          //  translator.info.City.toLowerCase().includes(current.toLowerCase()) ||
          //  translator.info.Zipcode.toString().includes(current)
        ) {
          list.push(translator);
          break;
        }
      }
    }
    setTranslatorList(list);
  };

  const onRefresh = async () => {
    setRefreshing(true);
    fetchTranslators(id, location);
  };

  useEffect(() => {
    country.length > 0 && fetchTranslatorsByCountry(id, country);
  }, [country]);

  // this one here lsiten to token
  useEffect(() => {
    // setCountry(defaultCountry);
    if (location !== null) fetchTranslators(id, location);
    else {
      console.log(location);
      setCountry(defaultCountry);
    }
    //
  }, []);

  const listheader = () => {
    return (
      <View>
        {/* <View
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
                marginStart: 0,
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
                  setTranslatorList(translatorSaved);
                  setPoliceApproved(false);
                }
              }}
              checked={policeApproved}
            />
            <Text style={[styles.filterText, {flex: 1}]}>
              {t('common:police_approved')}
            </Text>
          </View>
        </View> */}
        {/* this take the skills list */}
        <ScrollView style={{margin: 10, marginStart: 0}} horizontal>
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
                    backgroundColor:
                      selected === item.value ? '#659ED6' : '#fff',
                  },
                ]}>
                <Image
                  source={item.image}
                  style={{width: 30, height: 30, borderRadius: 100}}
                />
                <Text
                  style={[
                    styles.filterText,
                    {
                      color: selected === item.value ? '#fff' : '#000',
                      marginStart: 10,
                    },
                  ]}>
                  {item.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        searchLanguage={searchGIG}
        navigation={navigation}
        showSearchBar={true}
        setCountry={setCountry}
        code={code}
        setCode={setCode}
        // locationSearch={fetchTranslatorsByLocation}
      />

      {(id === 1 || id === 3 || id === 6) && listheader()}

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
                fontFamily: fonts.light,
              }}>
              No {serviceName}
              {' translators '}
              {location !== null ? 'around you' : 'in ' + country}
            </Text>
          )
        }
        keyExtractor={item => item.info.Id}
        data={translatorList}
        renderItem={({item}) => {
          return (
            <TranlatorsList
              item={item.info}
              index={1}
              navigation={navigation}
              info={transInfo}
              filter={filter}
              skillId={selected}
            />
          );
        }}
      />
    </View>
  );
};

export default HomeScreen;

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
});
