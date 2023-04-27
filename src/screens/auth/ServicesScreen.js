import React, {useContext, useState} from 'react';
import {View, Text, StyleSheet} from 'react-native';

import Button from '../../components/Button';
import TextBoxTitle from '../../components/TextBoxTitle';
import {AuthContext} from '../../context/AuthProvider';

import Indicator from '../../components/ActivityIndicator';
import axios from 'axios';

import {useTranslation} from 'react-i18next';
import {CheckBox} from 'react-native-elements';
import {toastNew as toast} from '../../util/util';
import {ProfileHeader} from '../../components';
import {fonts} from '../../assets/fonts';

const ServicesScreen = ({navigation, route}) => {
  const {email} = route.params;
  // const email = 'techauth@gmail.com';

  const {available_services} = useContext(AuthContext);
  const {t} = useTranslation();

  // console.log(available_services);

  const initialState = {label: t('common:select'), value: 0};

  // const [services, setServices] = useState(initialState);
  // const [myServices, setMyServices] = useState(
  //   user && user !== null && user.profile.services,
  // );

  const [loading, setLoading] = useState(false);
  const [level, setLevel] = useState(initialState);
  const [error, setError] = useState(null);

  const [checkedAuthorized, setCheckedAuthorized] = useState(false);
  const [checkeGuilder, setCheckeGuilder] = useState(false);
  const [checkedInterpreter, setCheckedInterpreter] = useState(false);
  const [checkedTranlator, setCheckedTranlator] = useState(false);
  const [checkedLyricist, setCheckedLyricist] = useState(false);
  const [checkedProofReading, setCheckedProofReading] = useState(false);

  // console.log(email);

  const goNext = async () => {
    setError(null);
    setLoading(true);
    var operation;

    // console.log(data);

    if (checkedAuthorized) {
      operation = await save(1);
      console.log('1', operation);
    }
    if (checkeGuilder) {
      operation = await save(2);
      console.log('2', operation);
    }
    if (checkedInterpreter) {
      operation = await save(3);
      console.log('3', operation);
    }
    if (checkedLyricist) {
      operation = await save(4);
      console.log('4', operation);
    }
    if (checkedProofReading) {
      operation = await save(5);
      console.log('5', operation);
    }
    if (checkedTranlator) {
      operation = await save(6);
      console.log('6', operation);
    }

    navigation.replace('Info', {
      email: email,
    });
  };

  const save = async value => {
    setError(null);

    const data = {
      InterpreterId: email,
      ServiceId: value,
    };

    // console.log(data);

    try {
      let res = await axios.post('/services', data);
      return res.data.msg;
    } catch (err) {
      toast(err.message, 'error');
      console.log(err);
      setLoading(false);
      return err.message;
    }
  };

  return (
    <View style={{flex: 1}}>
      <ProfileHeader name={'AddServices'} />

      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
          backgroundColor: '#fff',
          margin: 5,
        }}>
        <View>
          <Text
            style={[styles.text, {fontFamily: fonts.bold, marginVertical: 15}]}>
            {t('common:register_service')}
          </Text>
          <TextBoxTitle
            title={t('common:available') + ' ' + t('common:services')}
          />

          <View style={{marginTop: 15}}>
            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckedAuthorized(!checkedAuthorized);
                }}
                checked={checkedAuthorized}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[0].label}
                  showAsh={true}
                />
              </View>
            </View>

            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckeGuilder(!checkeGuilder);
                }}
                checked={checkeGuilder}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[1].label}
                  showAsh={true}
                />
              </View>
            </View>

            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckedInterpreter(!checkedInterpreter);
                }}
                checked={checkedInterpreter}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[2].label}
                  showAsh={true}
                />
              </View>
            </View>

            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckedLyricist(!checkedLyricist);
                }}
                checked={checkedLyricist}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[3].label}
                  showAsh={true}
                />
              </View>
            </View>

            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckedProofReading(!checkedProofReading);
                }}
                checked={checkedProofReading}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[4].label}
                  showAsh={true}
                />
              </View>
            </View>

            <View style={styles.checkBoxRow}>
              <CheckBox
                onPress={() => {
                  setCheckedTranlator(!checkedTranlator);
                }}
                checked={checkedTranlator}
              />
              <View style={styles.checkBoxTextWrapper}>
                <TextBoxTitle
                  title={available_services[5].label}
                  showAsh={true}
                />
              </View>
            </View>
          </View>
        </View>
        {/* {user && user !== null && (
          <View>
            <TextBoxTitle title={t('common:services')} />

            <FlatList
              numColumns={2}
              data={myServices}
              renderItem={({item, index}) => {
                return (
                  <View
                    style={{
                      margin: 3,
                      borderRadius: 10,
                      padding: 8,
                      borderWidth: 1,
                      borderColor: '#ccc',
                      flexDirection: 'row',
                      minWidth: 85,
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}>
                    <Text style={{marginEnd: 5}}>{item.label}</Text>
                    <Icon
                      type="MaterialCommunityIcons"
                      name="close"
                      size={14}
                      color="#E43F5A"
                      onPress={() => {
                        delLanguage(item.value);
                      }}
                      style={{
                        position: 'absolute',
                        right: 5,
                        backgroundColor: '#fff',
                        borderRadius: 100,
                        margin: 5,
                      }}
                    />
                  </View>
                );
              }}
              keyExtractor={item => item.value}
            />
          </View>
        )} */}

        {/* <Text>{JSON.stringify}</Text> */}
        {/* <CustomDropDown
          value={services}
          language={skills}
          setValue={setServices}
        /> */}

        {/* {services.value !== 0 && listItem(services)} */}
        {loading ? (
          <Indicator color={'#659ED6'} show={loading} size={'large'} />
        ) : (
          <Button
            onPress={() => goNext()}
            bGcolor={'#659ED6'}
            buttonTitle={'continue'}
          />
        )}
      </View>
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

  checkBoxTextWrapper: {marginStart: -20},
  text: {
    fontFamily: fonts.medium,
    marginStart: 10,
  },
});
