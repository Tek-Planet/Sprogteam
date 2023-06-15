import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import TextBoxTitle from '../../components/TextBoxTitle';

import Button from '../../components/Button';
import {AuthContext} from '../../context/AuthProvider';

import Ionicons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CheckBox} from 'react-native-elements';

import ErrorMsg from '../../components/ErrorMsg';
import Indicator from '../../components/ActivityIndicator';
import axios from 'axios';

import Toast from 'react-native-toast-message';
import {getLanguages, getUser, storeDetails} from '../../data/data';
import {useTranslation} from 'react-i18next';
import {fonts} from '../../assets/fonts';
import CustomDropDown from '../../components/CustomDropDown';
import CustomLanguageDropDown from '../../components/CustomLanguageDropDown';
import {colors} from '../../assets/colors';
import {ProfileHeader, SignUpHeader} from '../../components';

const LanguageScreen = ({navigation, route}) => {
  const {email} = route.params;

  // console.log(email);
  const {languages, setLanguages, user, setUser, auth} =
    useContext(AuthContext);
  const {t} = useTranslation();

  const initialState = {label: t('common:select'), value: 'Select'};
  const [counter, setCounter] = useState(0);

  const [language, setLanguage] = useState(initialState);
  const [myLanguage, setMyLanguage] = useState(
    user && user !== null && user.profile.languages,
  );
  const [checkedPolice, setCheckedPolice] = useState(false);
  const [policeNumber, setPoliceNumber] = useState(null);
  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(initialState);
  const [mastry, setMastry] = useState(initialState);
  const [error, setError] = useState(null);

  const levels = [
    {label: 'Authorized', value: 'Authorized'},
    {label: 'Modersprog', value: 'Modersprog'},
  ];

  const masteries = [
    {label: 'Written', value: 'Written'},
    {label: 'Speaking', value: 'Speaking'},
    {label: 'Both', value: 'Written / Speaking'},
  ];

  const fetchData = async () => {
    // console.log('here');
    const res = await getLanguages();
    // console.log(res);
    setLanguages(res);
  };

  const save = async item => {
    if (checkedPolice && policeNumber === null)
      setError('policeNumber cannot be empty');
    else if (level.value === 'Select') setError('level name cannot be empty');
    else {
      setError(null);
      setLoading(true);
      const data = {
        InterpretorName: 'techplanet49@gmail.com',
        LevelName: level.value,
        LanguageName: item.value,
        Mastery: mastry.value,
        PoliceApprove: checkedPolice ? 1 : 0,
        PoliceNumber: checkedPolice ? policeNumber : 'null',
      };

      try {
        let res = await axios.post('/languages', data);

        if (auth) {
          var details = await getUser(email);
          setUser(details);
          setMyLanguage(details.profile.languages);
          if (details.msg === 'success') {
            await storeDetails(details);
          }
        } else {
          setCounter(counter + 1);
        }

        if (res.data.msg === 'success') {
          Toast.show({
            type: 'success',
            text1: 'Language added',
          });
          setLanguage(initialState);
          setCheckedPolice(false);
          setPoliceNumber(null);
          setLevel(initialState);
        } else if (res.data.msg === 'already exist') {
          setError('language ' + res.data.msg);
        } else {
          setError('Unable to add new language');
          console.log('this stuff', res.data);
        }
        setLoading(false);
      } catch (error) {
        setError(error.message);
        console.log('something wrong');
        setLoading(false);
      }
    }
  };

  const listItem = item => {
    return (
      <View
        style={{
          margin: 3,
          borderRadius: 10,
          padding: 8,
          borderWidth: 1,
          borderColor: '#ccc',

          marginTop: 30,
        }}>
        <TextBoxTitle title={item.label} showAsh={true} />
        <Ionicons
          name="close"
          size={24}
          color="#E43F5A"
          onPress={() => {
            {
              setLanguage(initialState);
              setLevel(initialState);
            }
          }}
          style={{
            position: 'absolute',
            right: 5,
            backgroundColor: '#fff',
            borderRadius: 100,
            margin: 5,
          }}
        />
        <View
          style={{marginTop: 5, flexDirection: 'row', alignItems: 'center'}}>
          <TextBoxTitle title={t('common:authorized')} showAsh={true} />
          <CheckBox
            checked={checkedPolice}
            onPress={() => {
              checkedPolice ? setCheckedPolice(false) : setCheckedPolice(true);
            }}
          />
          <TextBoxTitle title={t('common:yes')} showAsh={true} />
        </View>
        {checkedPolice && (
          <View>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('NewKYC', {location: 'AddLanguage'})
              }>
              {policeNumber === null ? (
                <Text style={[styles.info, {color: colors.red}]}>
                  {t('common:click_here')}
                </Text>
              ) : (
                <Text style={[styles.info, {color: colors.green}]}>
                  {t('common:document') + ' ' + t('common:uploaded')}
                </Text>
              )}
            </TouchableOpacity>
          </View>
        )}
        <TextBoxTitle
          title={t('common:language') + ' ' + t('common:level')}
          showAsh={true}
        />

        <CustomDropDown
          showSearch={false}
          value={level}
          language={levels}
          setValue={setLevel}
        />

        <TextBoxTitle title={t('common:mastery')} showAsh={true} />
        <CustomDropDown
          value={mastry}
          language={masteries}
          setValue={setMastry}
        />
        {error !== null && <ErrorMsg error={error} />}
        {loading ? (
          <Indicator color={'#659ED6'} show={loading} size={'large'} />
        ) : (
          <Button
            onPress={() => save(item)}
            bGcolor={'#659ED6'}
            buttonTitle={t('common:save')}
          />
        )}
      </View>
    );
  };

  const delLanguage = async languageId => {
    try {
      const res = await axios.delete(
        `/languages/${user.profile.Id}/${languageId}`,
      );
      if (res.data.msg === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Language Removed',
        });

        var details = await getUser(user.profile.Email);

        setMyLanguage(details.profile.languages);
        setUser(details);

        if (details.msg === 'success') {
          storeDetails(details);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    languages.length === 0 && fetchData();
  }, []);

  useEffect(() => {
    if (route.params?.url) {
      setPoliceNumber(route.params?.url);
    }
  }, [route.params?.url]);

  return (
    <View
      style={{
        backgroundColor: '#fff',
        flex: 1,
        justifyContent: 'space-between',
      }}>
      <View>
        {auth ? (
          <ProfileHeader name={t('common:add') + ' ' + t('common:language')} />
        ) : (
          <View
            style={{
              padding: 10,
              paddingBottom: 0,
              margin: 10,
              marginBottom: 0,
            }}>
            <SignUpHeader page={4} />
          </View>
        )}
        <View>
          {user && user !== null && (
            <View>
              <TextBoxTitle title={t('common:language')} />

              <ScrollView
                contentContainerStyle={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  marginEnd: 10,
                }}
                showsHorizontalScrollIndicator={false}>
                {myLanguage?.map((item, index) => {
                  return (
                    <View
                      key={index}
                      style={{
                        margin: 3,
                        borderRadius: 10,
                        padding: 8,
                        borderWidth: 1,
                        borderColor: '#ccc',
                        flexDirection: 'row',
                        alignItems: 'center',
                      }}>
                      <Text style={styles.info}>{item.label}</Text>
                      <TouchableOpacity
                        onPress={() => {
                          delLanguage(item.UserLanguageId);
                        }}
                        style={{
                          backgroundColor: '#E43F5A',
                          borderRadius: 100,
                          width: 25,
                          height: 25,
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}>
                        <Ionicons name="delete" size={18} color="#fff" />
                      </TouchableOpacity>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          )}

          <View style={{padding: 5, margin: 5}}>
            <TextBoxTitle
              title={t('common:select') + ' ' + t('common:language')}
              showAsh={true}
            />

            <CustomLanguageDropDown
              value={language}
              language={languages}
              setValue={setLanguage}
            />

            {language.value !== 'Select' && listItem(language)}
          </View>
        </View>
      </View>

      {!auth && counter > 0 && (
        <View
          style={{
            alignItems: 'center',
            marginTop: 10,
          }}>
          <Text
            style={{
              fontFamily: fonts.medium,
              textAlign: 'center',
              lineHeight: 25,
              marginBottom: 10,
              color: colors.black,
            }}>
            {t('common:account_completion')}
          </Text>
          <View style={{width: '50%'}}>
            <Button
              onPress={() => {
                navigation.replace('Info', {
                  email: email,
                });
              }}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:done')}
            />
          </View>
        </View>
      )}
    </View>
  );
};

export default LanguageScreen;

const styles = StyleSheet.create({
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  pickerItem: {
    backgroundColor: '#fff',
    color: colors.black,
  },
  info: {
    color: colors.black,
    margin: 5,
    fontFamily: fonts.medium,
  },
});
