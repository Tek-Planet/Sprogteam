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
import CustomDropDown from '../components/CustomDropDown';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {fonts} from '../assets/fonts';

const ServicesScreen = () => {
  const {user, setUser} = useContext(AuthContext);
  const {t} = useTranslation();

  const initialState = {label: t('common:select'), value: 0};

  const [services, setServices] = useState(initialState);
  const [myServices, setMyServices] = useState(
    user && user !== null && user.profile.services,
  );

  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(initialState);
  const [error, setError] = useState(null);
  const [skills, setSkills] = useState([
    {
      label: t('common:authorized'),
      value: 1,
    },
    {
      label: t('common:guider'),
      value: 2,
    },
    {
      label: t('common:interpreter'),
      value: 3,
    },
    {
      label: t('common:lyricist'),
      value: 4,
    },
    {
      label: t('common:proof_reader'),
      value: 5,
    },
    {
      label: t('common:translator'),
      value: 6,
    },
  ]);

  // console.log(skills[1]);

  const getSkills = async () => {
    try {
      let res = await axios.get(`/skills`);
      if (res.data.msg === 'success') {
        console.log(res.data.result);
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    // getSkills();
  }, []);

  const save = async item => {
    setError(null);
    setLoading(true);
    const data = {
      InterpreterId: user.profile.Id,
      ServiceId: services.value,
    };

    // console.log(data);

    try {
      let res = await axios.post('/services', data);
      if (res.data.msg === 'success') {
        var details = await getUser(user.profile.Email);

        if (details.msg === 'success') {
          setMyServices(details.profile.services);
          await storeDetails(details);
          setUser(details);
        }

        Toast.show({
          type: 'success',
          text1: 'new services added',
        });
        setServices(initialState);
        // setSkills(initialState);
      } else if (res.data.msg === 'already exist') {
        setError('services ' + res.data.msg);
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
        `/services/${user.profile.Id}/${languageId}`,
      );
      if (res.data.msg === 'success') {
        Toast.show({
          type: 'success',
          text1: 'Service Removed',
        });

        var details = await getUser(user.profile.Email);

        if (details.msg === 'success') {
          setMyServices(details.profile.services);
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
          <TextBoxTitle title={t('common:services')} />

          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              marginEnd: 10,
            }}
            showsHorizontalScrollIndicator={false}>
            {myServices?.map((item, index) => {
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
                  <Text style={styles.info}>
                    {skills[item.value - 1].label}
                  </Text>
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
      <TextBoxTitle title={t('common:add') + ' ' + t('common:services')} />

      {/* <Text>{JSON.stringify}</Text> */}
      <CustomDropDown
        value={services}
        language={skills}
        setValue={setServices}
      />

      {services.value !== 0 && listItem(services)}
    </View>
  );
};

export default ServicesScreen;

const styles = StyleSheet.create({
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  pickerItem: {
    backgroundColor: '#fff',
    color: '#000',
  },
  info: {
    color: '#000',
    margin: 5,
    fontFamily: fonts.medium,
  },
});
