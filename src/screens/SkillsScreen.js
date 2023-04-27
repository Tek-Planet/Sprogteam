import React, {useEffect, useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
} from 'react-native';

import Button from '../components/Button';
import TextBoxTitle from '../components/TextBoxTitle';
import {AuthContext} from '../context/AuthProvider';

import ErrorMsg from '../components/ErrorMsg';
import Indicator from '../components/ActivityIndicator';
import axios from 'axios';

import Toast from 'react-native-toast-message';
import {getUser, storeDetails} from '../data/data';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {fonts} from '../assets/fonts';
import {CustomLanguageDropDown} from '../components';
import {colors} from '../assets/colors';

const SkillsScreen = () => {
  const {user, setUser} = useContext(AuthContext);
  const {t} = useTranslation();

  const initialState = {label: t('common:select'), value: 0};

  const [language, setLanguage] = useState(initialState);
  const [myLanguage, setMyLanguage] = useState(
    user && user !== null && user.profile.skills,
  );

  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(initialState);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([]);

  skills.sort(function (x, y) {
    let a = x.label,
      b = y.label;
    return a == b ? 0 : a > b ? 1 : -1;
  });

  const getSkills = async () => {
    try {
      let res = await axios.get(`/skills`);
      if (res.data.msg === 'success') {
        setSkills(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getSkills();
  }, []);

  const save = async item => {
    setError(null);
    setLoading(true);
    const data = {
      InterpreterId: user.profile.Id,
      SkillsId: language.value,
    };

    try {
      let res = await axios.post('/skills', data, {timeout: 3000});
      if (res.data.msg === 'success') {
        var details = await getUser(user.profile.Email);

        if (details.msg === 'success') {
          setMyLanguage(details.profile.skills);
          await storeDetails(details);
          setUser(details);
        }

        Toast.show({
          type: 'success',
          text1: 'new skill added',
        });
        setLanguage(initialState);
        // setSkills(initialState);
      } else if (res.data.msg === 'already exist') {
        setError('skills ' + res.data.msg);
      } else {
        setError('Unable to add new skills, please try again');
      }

      setLoading(false);
    } catch (err) {
      setError(err.message);
      console.log(err);
      setLoading(false);
    }
  };

  const listItem = item => {
    return (
      <View
        key={item.value}
        style={{
          margin: 3,
          borderRadius: 10,
          padding: 8,
          borderWidth: 1,
          borderColor: '#ccc',

          marginTop: 30,
        }}>
        {error !== null && <ErrorMsg error={error} />}
        {loading ? (
          <Indicator color={'#659ED6'} show={loading} size={'large'} />
        ) : (
          <Button
            onPress={() => save(item)}
            bGcolor={'#659ED6'}
            buttonTitle={'Save'}
          />
        )}
      </View>
    );
  };

  const delLanguage = async languageId => {
    try {
      const res = await axios.delete(
        `/skills/${user.profile.Id}/${languageId}`,
      );
      if (res.data.msg === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Skill Removed',
        });

        var details = await getUser(user.profile.Email);

        if (details.msg === 'success') {
          setMyLanguage(details.profile.skills);
          await storeDetails(details);
          setUser(details);
        }
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View>
      {user && user !== null && (
        <View>
          <TextBoxTitle title={t('common:skills')} />

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
                      delLanguage(item.value);
                    }}
                    style={{
                      backgroundColor: '#E43F5A',
                      borderRadius: 100,
                      width: 25,
                      height: 25,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="delete"
                      size={18}
                      color="#fff"
                    />
                  </TouchableOpacity>
                </View>
              );
            })}
          </ScrollView>
        </View>
      )}
      <TextBoxTitle title={t('common:add') + ' ' + t('common:skills')} />

      {/* <Text>{JSON.stringify}</Text> */}
      <CustomLanguageDropDown
        value={language}
        language={skills}
        setValue={setLanguage}
      />

      {language.value !== 0 && listItem(language)}
    </View>
  );
};

export default SkillsScreen;

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
