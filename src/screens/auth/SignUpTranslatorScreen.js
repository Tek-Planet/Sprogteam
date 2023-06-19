import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Linking,
  StyleSheet,
} from 'react-native';
import axios from 'axios';
import Calendar from '../../components/Calendar';
import {fonts} from '../../assets/fonts';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';
import {CheckBox} from 'react-native-elements';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {Icon} from 'react-native-elements';
import dayjs from 'dayjs';
import {useTranslation} from 'react-i18next';
import {usePasswordValidation} from '../../util';
import AntDesign from 'react-native-vector-icons/AntDesign';

import {getServerToken, storeUserName} from '../../data/data';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {authBaseUrl, dimention, setHeaders} from '../../util/util';
import {SelectCountryModal, SignUpHeader} from '../../components';
import {colors} from '../../assets/colors';

const SignUpTranslatorScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const [terms, setTerms] = useState(false);

  const [calendarVisible, setCalendarVisible] = useState(false);

  const [email, setEmail] = useState(route?.params?.email);
  const [checkedMale, setCheckedMale] = useState(null);
  const [firstName, setFirstName] = useState(null);
  const [companyName, setCompanyName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [address, setAddress] = useState(null);
  const [city, setCity] = useState(null);
  const [country, setCountry] = useState('');
  const [countryCallingCode, setCountryCallingCode] = useState('');
  const [state, setState] = useState(null);
  const [zipcode, setZipCode] = useState(null);
  const [telephone, setTelephone] = useState(null);
  const [password, setPassword] = useState(null);
  const [confirmPassword, setConfirmPassword] = useState(null);
  const [checkedFemale, setCheckedFemale] = useState(false);
  const [checkedCustomer, setCheckedCustomer] = useState(false);
  const [checkedTranlator, setCheckedTranlator] = useState(false);
  const [checkedSunheld, setCheckedSunheld] = useState(false);
  const [checkedPerson, setCheckedPerson] = useState(false);
  const [checkedPrivateCompany, setCheckedPrivateCompany] = useState(false);
  const [checkedPublicCompany, setCheckedPublicCompany] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [about, setAbout] = useState(null);
  const [account, setAccount] = useState(null);
  const [EAN, setEAN] = useState(null);
  const [CVR, setCVR] = useState(0);
  const [DOB, setDOB] = useState(null);
  const [companyStatus, setCompanyStatus] = useState('Person');
  const [departmentId, setDepartmentID] = useState(null);
  const [showPassword, setShowPassword] = useState(true);
  const [showConfirmPassword, setShowConfirmPassword] = useState(true);

  const [checkedLevelOne, setCheckedLevelOne] = useState(false);
  const [checkedLevelTwo, setCheckedLevelTwo] = useState(false);
  const [checkedLevelThree, setCheckedLevelThree] = useState(false);
  const [categoryId, setCategoryId] = useState(null);

  const [validLength, hasNumber, upperCase, lowerCase, match, specialChar] =
    usePasswordValidation({
      firstPassword: password,
      secondPassword: confirmPassword,
    });

  const calendarEvents = (bool, dt) => {
    setCalendarVisible(false);
    if (dt !== 'cancel') {
      setDOB(dayjs(dt).format('DD:MM:YYYY').toString());
    }
  };

  const signUp = async () => {
    if (email === null) setError('email cannot be empty');
    else if (firstName === null) setError('firstName cannot be empty');
    else if (lastName === null) setError('lastName cannot be empty');
    else if (address === null) setError('address cannot be empty');
    else if (city === null) setError('city cannot be empty');
    // else if (state === null) setError('state cannot be empty');
    else if (country === null) setError('country cannot be empty');
    else if (zipcode === null) setError('zipcode cannot be empty');
    else if (telephone === null) setError('telephone cannot be empty');
    else if (password === null) setError('Password cannot be empty');
    else if (confirmPassword === null)
      setError('confirmPassword cannot be empty');
    else if (password !== confirmPassword) setError('password mismatch');
    // else if (checkedTranlator && about === null)
    //   setError('about you cannot be empty');
    else if (checkedTranlator && categoryId === null)
      setError('select a category');
    else {
      // console.log('move on');
      setLoading(true);
      setError('');
      addUser();
    }
  };

  const addFeeTranslator = async id => {
    try {
      // store the username for future usage
      await storeUserName(email);
      // var details = await getUser(email);

      navigation.replace('NewKYC', {
        email: id,
      });
    } catch (error) {
      setLoading(false);
      console.log('catch @ fee', error.message);
    }
  };

  const addRole = async (userId, roleId) => {
    const data = {
      UserId: userId,
      RoleId: roleId,
    };

    let res;
    try {
      res = await axios.post(`/users/roles`, data, {timeout: 10000});
      console.log(res.data.msg);
      return res.data.msg;
    } catch (err) {
      console.log(err);
      setLoading(false);
      return 'error';
    }
  };

  const addUser = async () => {
    let companyname = firstName + ' ' + lastName;

    const newUser = {
      // UserName: email,
      Email: email.toLowerCase(),
      Phone: countryCallingCode + telephone,
      FirstName: firstName,
      LastName: lastName,
      Adresse: address,
      Zipcode: parseInt(zipcode),
      City: city,
      State: state,
      GenderId: checkedMale ? 2 : 1,
      AccountNumber: account,
      About: about,
      Sunheld: checkedSunheld,
      DOB: DOB,
      Password: password,
      CompanyStatus: companyStatus,
      ConfirmPassword: password,
      // for the customer
      CVR: parseInt(CVR),
      EAN: EAN,
      CompanyName: companyname,
      CreateAt: new Date().toISOString,
      Country: country,
      CategoryId: parseInt(categoryId),
    };

    var endPoint;
    let res;
    endPoint = `${authBaseUrl}/register`;

    try {
      res = await axios.post(endPoint, newUser);

      // console.log(res.data.user);
      // console.log(res.data.token);

      if (res.data.status === 'success' || res.data.status === 'Success') {
        // start of successful sign up

        const token = await getServerToken(
          email,
          // tempToken,
          res.data.token,
        );

        // console.log('token ', token);

        if (token !== null) {
          // set axios header

          await setHeaders(token.secret, token.token);

          addRole(res.data.user.id, '1cf787b6-f0d6-499b-aabf-59f54fb43f13');

          addFeeTranslator(res.data.user.id);
        } else {
          setError('Unable to authenticate you, please login to continue');
          setLoading(false);
        }

        //

        // end of successful signup
      } else {
        if (res.data.status === 'error') {
          setError(res.data.message);
        } else {
          setError(res.data.message[0].description);
        }

        setLoading(false);
      }
    } catch (error) {
      if (error.message === 'Request failed with status code 500') {
        setError('Email belongs to another account');
      } else if (error.message === 'Request failed with status code 401') {
        setError('Invalid credentials');
      } else setError(error.message);
      // [Error: Request failed with status code 500]
      setLoading(false);
      // [Error: Request failed with status code 401]
      console.log(' say it' + error);
    }

    // end of register user
  };

  const resetCategry = () => {
    setCheckedLevelOne(false);
    setCheckedLevelTwo(false);
    setCheckedLevelThree(false);
    setCategoryId(null);
  };

  return (
    <KeyboardAwareScrollView>
      <View
        style={{
          flex: 1,
          backgroundColor: '#fff',
          alignItems: 'center',
        }}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{
            position: 'absolute',
            left: 20,
            top: 20,
          }}>
          <AntDesign
            name={'back'}
            size={26}
            color={'#000'}
            style={{padding: 5}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('LanguageSelector')}
          style={{
            position: 'absolute',
            right: 20,
            top: 20,
          }}>
          <Image
            style={{
              height: 30,
              width: 30,
            }}
            source={require('../../assets/imgs/language.png')}
          />
        </TouchableOpacity>
        <Image
          resizeMode="contain"
          style={{
            height: 60,
            width: 60,
            marginTop: 20,
            borderRadius: 100,
          }}
          source={require('../../assets/imgs/logo.png')}
        />

        <View
          style={{
            marginStart: 8,
            marginEnd: 8,
            marginTop: 10,
            backgroundColor: '#fff',
            width: '90%',
            padding: 20,
            borderRadius: 10,
            elevation: 2,
            marginBottom: 20,
          }}>
          {/* <TitleHeader title={t('common:create_new_user')} /> */}

          <SignUpHeader page={1} />

          {/* usetype */}

          <View>
            {/* Email; */}
            <TextBoxTitle title={t('common:email')} />
            <TextBox
              name="mail-outline"
              onChangeText={val => setEmail(val.trim())}
              placeholderTextColor="#fafafa"
              value={email}
              editable={false}
            />

            {/* firsname */}

            <View>
              <TextBoxTitle title={t('common:first') + t('common:name')} />
              <TextBox
                name="person-outline"
                onChangeText={val => setFirstName(val)}
                placeholderTextColor="#fafafa"
              />

              {/* firsname */}
              <TextBoxTitle title={t('common:last') + t('common:name')} />
              <TextBox
                name="person"
                onChangeText={val => setLastName(val)}
                placeholderTextColor="#fafafa"
              />
            </View>

            {/* Adreess */}
            <TextBoxTitle title={t('common:address')} />
            <TextBox
              name="location"
              onChangeText={val => setAddress(val)}
              placeholderTextColor="#fafafa"
            />
            <TextBoxTitle title={t('common:city')} />
            <TextBox
              name="location-outline"
              onChangeText={val => setCity(val)}
              placeholderTextColor="#fafafa"
            />
            {/* <TextBoxTitle title={t('common:state')} />
            <TextBox
              name="map"
              onChangeText={val => setState(val)}
              placeholderTextColor="#fafafa"
            /> */}

            <View style={{}}>
              <TextBoxTitle title={t('common:country')} />
              <SelectCountryModal
                // showFlag={true}
                code={'DK'}
                setCountryCallingCode={setCountryCallingCode}
                setCountry={setCountry}
                visisble={false}
              />
            </View>

            <TextBoxTitle title={t('common:zipcode')} />
            <TextBox
              name="code-outline"
              keyboardType={'numeric'}
              onChangeText={val => setZipCode(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title={t('common:phone')} />
            <View style={{flexDirection: 'row'}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  margin: 5,
                  fontSize: 18,
                  marginTop: 10,
                  color: colors.black,
                }}>
                {countryCallingCode}
              </Text>
              <View style={{flex: 1}}>
                <TextBox
                  name="call-outline"
                  keyboardType={'phone-pad'}
                  onChangeText={val => setTelephone(val)}
                  placeholderTextColor="#fafafa"
                />
              </View>
            </View>

            {/* dob */}

            {/* Ean */}

            {/* cvr */}

            <View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-evenly',
                }}>
                <View style={{flex: 1}}>
                  <TextBoxTitle title={t('common:date_of_birth')} />

                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <View style={{flex: 0.5}}>
                      <TextBox
                        name="calendar"
                        editable={false}
                        keyboardType={'numeric'}
                        value={DOB}
                        placeholderTextColor="#fafafa"
                      />
                    </View>
                    <View style={{marginStart: 10}}>
                      <Icon
                        type={'feather'}
                        onPress={() => {
                          setCalendarVisible(true);
                        }}
                        name={'calendar'}
                        size={30}
                        color={'#659ED6'}
                      />
                    </View>
                  </View>
                </View>
              </View>
              {/* sex */}
              <TextBoxTitle title={t('common:sex')} />

              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <CheckBox
                  onPress={() => [
                    setCheckedFemale(checkedMale),
                    setCheckedMale(!checkedMale),
                  ]}
                  checked={checkedMale}
                />
                <TextBoxTitle title={t('common:male')} showAsh={true} />

                <CheckBox
                  onPress={() => [
                    setCheckedMale(checkedFemale),
                    setCheckedFemale(!checkedFemale),
                  ]}
                  checked={checkedFemale}
                />
                <TextBoxTitle title={t('common:female')} showAsh={true} />
              </View>
            </View>

            {/* additional customer information */}
            {/* needs cutting away from here */}
            {/* additional  translator information  */}

            <View>
              {/* translator categoty  */}

              <TextBoxTitle title={t('common:category')} />
              <View style={{marginTop: 15}}>
                <View style={styles.checkBoxRow}>
                  <CheckBox
                    onPress={() => {
                      if (checkedLevelThree) {
                        resetCategry();
                      } else {
                        setCategoryId(1);
                        setCheckedLevelThree(true);
                        setCheckedLevelOne(false);
                        setCheckedLevelTwo(false);
                      }
                    }}
                    checked={checkedLevelThree}
                  />
                  <TextBoxTitle
                    title={t('common:government_approve')}
                    showAsh={true}
                  />
                </View>
                <View style={styles.checkBoxRow}>
                  <CheckBox
                    onPress={() => {
                      if (checkedLevelTwo) {
                        resetCategry();
                      } else {
                        setCategoryId(2);
                        setCheckedLevelOne(false);
                        setCheckedLevelTwo(true);
                        setCheckedLevelThree(false);
                      }
                    }}
                    checked={checkedLevelTwo}
                  />
                  <View style={styles.checkBoxTextWrapper}>
                    <TextBoxTitle
                      title={t('common:state_approve')}
                      showAsh={true}
                    />
                  </View>
                </View>
                <View style={styles.checkBoxRow}>
                  <CheckBox
                    onPress={() => {
                      if (checkedLevelOne) {
                        resetCategry();
                      } else {
                        setCategoryId(3);
                        setCheckedLevelOne(true);
                        setCheckedLevelTwo(false);
                        setCheckedLevelThree(false);
                      }
                    }}
                    checked={checkedLevelOne}
                  />
                  <TextBoxTitle title={t('common:others')} showAsh={true} />
                </View>
              </View>

              <TextBoxTitle title={t('common:about_you')} showAsh={true} />
              <TextBox
                name="information"
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
                  onChangeText={val => setAccount(val)}
                  placeholderTextColor="#fafafa"
                /> */}
            </View>

            {/* Password */}
            <TextBoxTitle title={t('common:password')} />
            <TextBox
              name="lock-closed"
              secureTextEntry={showPassword}
              onChangeText={val => setPassword(val)}
              placeholderTextColor="#fafafa"
            />
            {/* password validation */}
            {password?.length > 0 && (
              <View>
                {/* valide length */}
                <View style={styles.validationRow}>
                  <AntDesign
                    name={upperCase ? 'checkcircle' : 'closecircle'}
                    size={18}
                    color={upperCase ? 'green' : 'red'}
                  />
                  <Text
                    style={[styles.text, {color: upperCase ? 'green' : 'red'}]}>
                    {t('common:error_uppercase')}
                  </Text>
                </View>
                {/* lowwercase  check*/}

                <View style={styles.validationRow}>
                  <AntDesign
                    name={lowerCase ? 'checkcircle' : 'closecircle'}
                    size={18}
                    color={lowerCase ? 'green' : 'red'}
                  />
                  <Text
                    style={[styles.text, {color: lowerCase ? 'green' : 'red'}]}>
                    {t('common:error_lowwercase')}
                  </Text>
                </View>

                {/* number check */}
                <View style={styles.validationRow}>
                  <AntDesign
                    name={hasNumber ? 'checkcircle' : 'closecircle'}
                    size={18}
                    color={hasNumber ? 'green' : 'red'}
                  />
                  <Text
                    style={[styles.text, {color: hasNumber ? 'green' : 'red'}]}>
                    {t('common:error_number')}
                  </Text>
                </View>

                {/* special character check */}

                {/* number check */}
                <View style={styles.validationRow}>
                  <AntDesign
                    name={specialChar ? 'checkcircle' : 'closecircle'}
                    size={18}
                    color={specialChar ? 'green' : 'red'}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: specialChar ? 'green' : 'red'},
                    ]}>
                    {t('common:error_alpha_numeric')}
                  </Text>
                </View>

                {/* Uper case check */}
                <View style={styles.validationRow}>
                  <AntDesign
                    name={validLength ? 'checkcircle' : 'closecircle'}
                    size={18}
                    color={validLength ? 'green' : 'red'}
                  />
                  <Text
                    style={[
                      styles.text,
                      {color: validLength ? 'green' : 'red'},
                    ]}>
                    {t('common:error_length')}
                  </Text>
                </View>
              </View>
            )}

            {/* confirm Password */}
            <TextBoxTitle
              title={t('common:confirm') + ' ' + t('common:password')}
            />
            <TextBox
              name="lock-closed"
              secureTextEntry={showConfirmPassword}
              onChangeText={val => setConfirmPassword(val)}
              placeholderTextColor="#fafafa"
            />

            {/* number check */}
            {confirmPassword?.length > 0 && (
              <View style={styles.validationRow}>
                <AntDesign
                  name={match ? 'checkcircle' : 'closecircle'}
                  size={18}
                  color={match ? 'green' : 'red'}
                />
                <Text style={[styles.text, {color: match ? 'green' : 'red'}]}>
                  {t('common:error_password_match')}
                </Text>
              </View>
            )}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <View style={{marginStart: -20}}>
                <CheckBox
                  size={30}
                  onPress={() => {
                    setTerms(!terms);
                  }}
                  checked={terms}
                />
              </View>

              <TouchableOpacity
                onPress={() => Linking.openURL('https://app.sprogteam.dk')}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    width: dimention.width * 0.7,
                    color: colors.black,
                  }}>
                  I agree to Sprogteam's Terms & Conditions and Policy Privacy
                </Text>
              </TouchableOpacity>
            </View>

            <View style={{marginTop: 10}}>
              {error !== undefined && error !== null && (
                <ErrorMsg error={error} />
              )}
              {loading ? (
                <Indicator color={'#659ED6'} show={loading} size={'large'} />
              ) : (
                <Button
                  disable={!terms}
                  onPress={() => {
                    if (!terms) {
                      setError('You need to agree to terms and condition');
                      return;
                    }
                    signUp();
                    // navigation.replace('NewKYC', {
                    //   email: 'techplanet49@gmail.com',
                    // });
                  }}
                  bGcolor={'#659ED6'}
                  buttonTitle={t('common:sign_up')}
                />
              )}
            </View>

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginTop: 10,
              }}>
              <TextBoxTitle
                showAsh={true}
                title={t('common:already_have_account') + ' ?'}
              />
              <TouchableOpacity
                onPress={() => navigation.navigate('SignIn')}
                style={{
                  borderBottomWidth: 1,
                  borderColor: '#659ED6',
                }}>
                <Text
                  style={{
                    fontSize: 15,
                    fontFamily: fonts.medium,
                    alignSelf: 'center',
                    color: colors.black,
                  }}>
                  {t('common:log_in')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* calenda section */}
          {calendarVisible && (
            <Calendar
              isDateTimePickerVisible={calendarVisible}
              mode={'date'}
              calendarEvents={calendarEvents}
            />
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default SignUpTranslatorScreen;

const styles = StyleSheet.create({
  checkBoxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -20,
  },
  pickerItem: {backgroundColor: '#fff', color: '#000'},
  checkBoxTextWrapper: {marginStart: 0},
  text: {
    fontFamily: fonts.medium,
    fontSize: 13,
    margin: 5,
  },
  validationRow: {
    flexDirection: 'row',
    margin: 5,
    alignItems: 'center',
  },
});
