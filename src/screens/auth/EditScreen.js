import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet} from 'react-native';
import axios from 'axios';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';

import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';

import {Icon} from 'react-native-elements';

import dayjs from 'dayjs';
import Calendar from '../../components/Calendar';

import {getUser, storeDetails} from '../../data/data';
import {useTranslation} from 'react-i18next';
import {CountryPickerModal} from '../../components';
import {colors} from '../../assets/colors';

const SignUp = ({navigation}) => {
  const {setUser, user} = useContext(AuthContext);
  const {t} = useTranslation();

  const [email, setEmail] = useState(user.profile.Email);
  const [firstName, setFirstName] = useState(user.profile.FirstName);
  const [lastName, setLastName] = useState(user.profile.LastName);
  const [companyName, setCompanyName] = useState(
    user.profile.CompanyName && user.profile.CompanyName !== undefined
      ? user.profile.CompanyName
      : null,
  );
  const [address, setAddress] = useState(user.profile.Adresse);
  const [city, setCity] = useState(user.profile.City);
  const [state, setState] = useState(user.profile.State);
  const [country, setCountry] = useState(user.profile.Country);
  const [zipcode, setZipCode] = useState(user.profile.Zipcode.toString());
  const [telephone, setTelephone] = useState(user.profile.PhoneNumber);
  const [loading, setLoading] = useState(false);
  const [countryCallingCode, setCountryCallingCode] = useState('');
  const [error, setError] = useState('');
  const [about, setAbout] = useState(
    user.profile.About && user.profile.About !== undefined
      ? user.profile.About
      : null,
  );

  const [DOB, setDOB] = useState(
    user.profile.DOB && user.profile.DOB !== undefined
      ? user.profile.DOB
      : null,
  );
  const [calendarVisible, setCalendarVisible] = useState(false);

  const [EAN, setEAN] = useState(
    user.profile.EAN && user.profile.EAN !== null ? user.profile.EAN : 0,
  );
  const [CVR, setCVR] = useState(
    user.profile.CVR && user.profile.CVR !== null ? user.profile.CVR : 0,
  );

  const calendarEvents = (bool, dt) => {
    setCalendarVisible(false);
    if (dt !== 'cancel') {
      setDOB(dayjs(dt).format('DD:MM:YYYY').toString());
    }
  };

  const postDataToDb = async oldUser => {
    try {
      var res = await axios.put(`/users/record`, oldUser);
      setLoading(false);
      if (res.data.msg === 'success') {
        var details = await getUser(email);
        await storeDetails(details);
        setUser(details);
        navigation.goBack();
      } else {
        console.log(res.data.err.originalError);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message);
    }
  };

  const addUser = () => {
    const newUser = {
      Email: email,
      FirstName: firstName,
      LastName: lastName,
      Adresse: address,
      City: city,
      State: state,
      Zipcode: zipcode,
      About: about,
      PhoneNumber: telephone,
      DOB: DOB,
      Country: country,

      CVR: CVR,
      EAN: EAN,
      CompanyName: companyName,
    };

    // console.log(newUser);

    postDataToDb(newUser);
  };

  const save = () => {
    if (firstName === null) setError('firstName cannot be empty');
    else if (lastName === null) {
      setError('lastName cannot be empty');
    } else if (
      (user.profile.CompanyStatus === 'Public' ||
        user.profile.CompanyStatus === 'Private') &&
      companyName === null
    )
      setError('company name cannot be empty');
    else if (address === null) setError('address cannot be empty');
    else if (city === null) setError('city cannot be empty');
    else if (state === null) setError('state cannot be empty');
    else if (zipcode === null) setError('zipcode cannot be empty');
    else if (telephone === null) setError('telephone cannot be empty');
    else if (
      (user.profile.interpreter || (user && user.profile.interpreter === 1)) &&
      about === null
    )
      setError('about you cannot be empty');
    else {
      setLoading(true);
      setError('');

      addUser();
    }
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={{flex: 1, alignItems: 'center', backgroundColor: colors.white}}>
        <View
          style={{
            marginStart: 8,
            marginEnd: 8,
            marginTop: 10,
            backgroundColor: colors.white,
            width: '90%',
            padding: 20,
            borderRadius: 10,
            elevation: 2,
            marginBottom: 20,
          }}>
          <View>
            {/* firsname */}

            <View>
              <TextBoxTitle
                title={
                  user.profile.CompanyStatus === 'Public' ||
                  user.profile.CompanyStatus === 'Private'
                    ? t('common:contact') +
                      ' ' +
                      t('common:person') +
                      ' ' +
                      t('common:first') +
                      t('common:name')
                    : t('common:first') + t('common:name')
                }
              />
              <TextBox
                name="person-outline"
                value={firstName}
                onChangeText={val => setFirstName(val)}
                placeholderTextColor="#fafafa"
              />

              {/* firsname */}
              <TextBoxTitle
                title={
                  user.profile.CompanyStatus === 'Public' ||
                  user.profile.CompanyStatus === 'Private'
                    ? t('common:contact') +
                      ' ' +
                      t('common:person') +
                      ' ' +
                      t('common:last') +
                      t('common:name')
                    : t('common:last') + t('common:name')
                }
              />
              <TextBox
                name="person"
                value={lastName}
                onChangeText={val => setLastName(val)}
                placeholderTextColor="#fafafa"
              />
            </View>

            {(user.profile.CompanyStatus === 'Public' ||
              user.profile.CompanyStatus === 'Private') && (
              <View>
                <TextBoxTitle
                  title={t('common:company') + ' ' + t('common:name')}
                />
                <TextBox
                  name="person-add"
                  value={companyName}
                  onChangeText={val => setCompanyName(val)}
                  placeholderTextColor="#fafafa"
                />

                {/* {user.profile.CompanyStatus === 'Public' && (
                <View>
                  <TextBoxTitle title="Department Name" />
                  <TextBox
                    value={lastName}
                    onChangeText={val => setLastName(val)}
                    placeholderTextColor="#fafafa"
                  />
                </View>
              )} */}
              </View>
            )}
            {/* Adreess */}
            <TextBoxTitle title={t('common:address')} />
            <TextBox
              name="location"
              value={address}
              onChangeText={val => setAddress(val)}
              placeholderTextColor="#fafafa"
            />
            <TextBoxTitle title={t('common:city')} />
            <TextBox
              name="location-outline"
              value={city}
              onChangeText={val => setCity(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title={t('common:state')} />
            <TextBox
              name="map"
              value={state}
              onChangeText={val => setState(val)}
              placeholderTextColor="#fafafa"
            />

            {/* <TextBoxTitle title={t('common:country')} />
            <TextBox
              name="map"
              value={country}
              onChangeText={val => setCountry(val)}
              placeholderTextColor="#fafafa"
            /> */}

            <View style={{}}>
              <TextBoxTitle title={t('common:country')} />
              <View style={{flex: 1, flexDirection: 'row'}}>
                <View style={{flex: 1}}>
                  <TextBox
                    name="map-outline"
                    value={country}
                    placeholderTextColor="#fafafa"
                  />
                </View>
                <CountryPickerModal
                  showFlag={true}
                  code={'DK'}
                  setCountryCallingCode={setCountryCallingCode}
                  setCountry={setCountry}
                  visisble={false}
                />
              </View>
            </View>

            <TextBoxTitle title={t('common:zipcode')} />
            <TextBox
              name="code-outline"
              value={zipcode}
              keyboardType={'numeric'}
              onChangeText={val => setZipCode(val)}
              placeholderTextColor="#fafafa"
            />

            {/* Telephone */}
            <TextBoxTitle title={t('common:phone')} />
            <TextBox
              name="call-outline"
              value={telephone}
              onChangeText={val => setTelephone(val)}
              placeholderTextColor="#fafafa"
            />

            {(user.profile.CompanyStatus === 'Private' ||
              user.profile.CompanyStatus === 'Public') && (
              <View>
                <TextBoxTitle
                  title="EAN"
                  showAsh={user.profile.CompanyStatus === 'Private' && true}
                />
                <TextBox
                  name="receipt"
                  keyboardType={'numeric'}
                  value={EAN.toString()}
                  onChangeText={val => setEAN(val)}
                  placeholderTextColor="#fafafa"
                />

                <TextBoxTitle title="CVR" />
                <TextBox
                  name="receipt-outline"
                  keyboardType={'numeric'}
                  value={CVR.toString()}
                  onChangeText={val => setCVR(val)}
                  placeholderTextColor="#fafafa"
                />
              </View>
            )}
            {/* DOB */}

            {/* translator related fields */}
            {(user.profile.CompanyStatus === undefined ||
              user.profile.CompanyStatus === null ||
              user.profile.CompanyStatus === 'Person') && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{flex: 1}}>
                  <TextBoxTitle title={t('common:date_of_birth')} />
                  <View style={{flexDirection: 'row'}}>
                    <View style={{flex: 0.5}}>
                      <TextBox
                        name="calendar"
                        editable={false}
                        keyboardType={'numeric'}
                        value={DOB}
                        placeholderTextColor="#fafafa"
                      />
                    </View>
                    <Icon
                      type={'feather'}
                      onPress={() => {
                        setCalendarVisible(true);
                      }}
                      name={'calendar'}
                      size={25}
                      color={'#659ED6'}
                      style={{margin: 10, marginTop: 5}}
                    />
                  </View>
                </View>
              </View>
            )}
            {user &&
              (user.profile.interpreter ||
                (user && user.profile.interpreter === 1)) && (
                <View>
                  <TextBoxTitle title={t('common:about_you')} />
                  <TextBox
                    name="information"
                    value={about}
                    onChangeText={val => setAbout(val)}
                    placeholderTextColor="#fafafa"
                    placeholder={'Short note about you'}
                  />

                  {/* account */}
                  {/* <TextBoxTitle
                    title={t('common:account') + ' ' + t('common:number')}
                  />
                  <TextBox
                    name="card"
                    value={account}
                    onChangeText={val => setAccount(val)}
                    placeholderTextColor="#fafafa"
                  /> */}

                  {/* sunheld */}
                  {/* <TextBoxTitle title="Sundhedstolk" showAsh={true} />
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <CheckBox
                      checked={checkedSunheld}
                      onPress={() => {
                        checkedSunheld
                          ? setCheckedSunheld(false)
                          : setCheckedSunheld(true);
                      }}
                    />
                    <TextBoxTitle title="Yes" showAsh={true} />
                  </View> */}
                </View>
              )}
            <View style={{marginTop: 10}}>
              {error.length > 0 && <ErrorMsg error={error} />}
              {loading ? (
                <Indicator color={'#659ED6'} show={loading} size={'large'} />
              ) : (
                <Button
                  onPress={() => save()}
                  bGcolor={'#659ED6'}
                  buttonTitle={t('common:save')}
                />
              )}
              {/* <Button
                onPress={() => alert('Hello')}
                bGcolor={'#659ED6'}
                buttonTitle={'Say Hello'}
              />

              <Button
                onPress={() => save()}
                bGcolor={'#659ED6'}
                buttonTitle={'Submit Now'}
              /> */}
            </View>
          </View>
        </View>
        {calendarVisible && (
          <Calendar
            isDateTimePickerVisible={calendarVisible}
            mode={'date'}
            calendarEvents={calendarEvents}
          />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  pickerItem: {backgroundColor: colors.white, color: '#000'},
});
