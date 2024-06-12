import React, {useState} from 'react';
import {Text, View, StyleSheet, ScrollView, Linking} from 'react-native';
import {
  CountryPicker,
  CustomButton,
  CustomDropDown,
  CustomError,
  CustomInput,
  CustomLoader,
  CustomRadioButton,
  Header,
  SuccessModal,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useAppDispatch} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {
  errorText,
  errorValue,
  getUserType,
  height,
  initialSelect,
} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SelectOptionType, TabItem} from '../../types';
import {registerUser} from '../../rtk/features/user/userSlice';

import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {usePasswordValidation} from '../../utils/usePasswordValidation';

type Props = NativeStackScreenProps<AuthStackParams, 'SignUp'>;

const SignUpScreen = ({navigation, route}: Props) => {
  const {user} = route.params;
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [email, setEmail] = useState<string>(user.Email + '');
  const [password, setPassword] = useState<string>('');

  const [firstName, setFirstName] = useState<string>('');
  const [companyName, setCompanyName] = useState<string>('');
  const [lastName, setLastName] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [city, setCity] = useState<string>('');

  const [state, setState] = useState<string>('');
  const [zipcode, setZipCode] = useState<string>('');
  const [telephone, setTelephone] = useState<string>('');

  const [confirmPassword, setConfirmPassword] = useState<string>('');

  const [EAN, setEAN] = useState<string>('');
  const [CVR, setCVR] = useState<string>('');
  const [departmentId, setDepartmentID] = useState<string>('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [country, setCountry] = useState('Country');
  const [countryCallingCode, setCountryCallingCode] = useState('+00');
  const [userType, setuserType] = useState<SelectOptionType>(initialSelect());

  const [message, setMessage] = useState<string>('');
  const [terms, setTerms] = useState<TabItem>();

  const requiredLength = 6;
  const [validLength, hasNumber, upperCase, lowerCase, match, specialChar] =
    usePasswordValidation({password, confirmPassword, requiredLength});

  const onSubmit = async () => {
    if (terms?.value !== '1') {
      setErrorMessage('Agree to terms and condition');
      return;
    }

    setErrorMessage('');
    if (userType.value === 'Select' || userType.value === 'error') {
      setuserType(errorValue);
      return;
    }

    if (email.length === 0 || email === 'error') {
      setEmail(errorText);
      return;
    }
    if (firstName.length === 0 || firstName === 'error') {
      setFirstName(errorText);
      return;
    }
    if (lastName.length === 0 || lastName === 'error') {
      setLastName(errorText);
      return;
    }
    if (address.length === 0 || address === 'error') {
      setAddress(errorText);
      return;
    }
    if (city.length === 0 || city === 'error') {
      setCity(errorText);
      return;
    }
    // if (state.length === 0 || state === 'error') {
    //   setState(errorText);
    //   return;
    // }
    if (zipcode.length === 0 || zipcode === 'error') {
      setZipCode(errorText);
      return;
    }
    if (country === 'Country') {
      setCountry(errorText);
      return;
    }
    if (telephone.length === 0 || telephone === 'error') {
      setTelephone(errorText);
      return;
    }
    if (password.length === 0 || password === 'error') {
      setPassword(errorText);
      return;
    }
    if (confirmPassword.length === 0 || confirmPassword === 'error') {
      setConfirmPassword(errorText);
      return;
    }

    if (!match) {
      setConfirmPassword(errorText);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    let companyname;

    if (userType.value === 'Private' || userType.value === 'Public')
      companyname = companyName;
    else companyname = firstName + ' ' + lastName;

    const newUser: any = {
      Email: email.trim().toLowerCase(),
      Phone: countryCallingCode + telephone,
      FirstName: firstName,
      LastName: lastName,
      Adresse: address,
      Zipcode: parseInt(zipcode),
      City: city,
      State: state,
      GenderId: 0,
      AccountNumber: null,
      About: null,
      Sunheld: 0,
      DOB: null,
      Password: password,
      CompanyStatus: userType.value,
      ConfirmPassword: password,
      // for the customer
      CVR: 0,
      EAN: EAN.length > 0 ? EAN : null,
      CompanyName: companyname,
      CreateAt: new Date().toISOString(),
      Country: country,
      CategoryId: null,
      interpreter: false,
    };

    var response: any = await dispatch(registerUser(newUser));

    console.log(response, 'UI Log');

    if (response.payload?.message === 'successful') {
      setMessage('Registration Successful');
      setModalVisible(true);
    } else {
      console.log(response, 'some erro');
      setErrorMessage('Unable to create your account');
      setLoading(false);
    }
  };

  let userTypes = getUserType();

  return (
    <View style={{...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:personal') + ' ' + t('common:information')}
      />

      {loading && <CustomLoader color={colors.main} />}
      <KeyboardAwareScrollView>
        <ScrollView>
          <View
            style={{margin: spacing.ten, paddingBottom: spacing.fiften * 2}}>
            <CustomDropDown
              label={t('common:user') + ' ' + t('common:type')}
              value={userType}
              options={userTypes}
              setValue={setuserType}
              // title={t('common:select') + ' ' + t('common:userTypes')}
            />
            <CustomInput
              showleftIcon
              leftIconName="mail"
              placeholder={t('common:email')}
              onTextChange={setEmail}
              value={email}
              editable={false}
            />
            <CustomInput
              showleftIcon
              leftIconName="user"
              placeholder={
                userType.value === 'Private' || userType.value === 'Public'
                  ? t('common:contact') +
                    ' ' +
                    t('common:person') +
                    ' ' +
                    t('common:first') +
                    ' ' +
                    t('common:name')
                  : t('common:first') + ' ' + t('common:name')
              }
              onTextChange={setFirstName}
              value={firstName}
            />
            <CustomInput
              showleftIcon
              leftIconName="user"
              placeholder={
                userType.value === 'Private' || userType.value === 'Public'
                  ? t('common:contact') +
                    ' ' +
                    t('common:person') +
                    ' ' +
                    t('common:last') +
                    ' ' +
                    t('common:name')
                  : t('common:last') + ' ' + t('common:name')
              }
              onTextChange={setLastName}
              value={lastName}
            />

            {(userType.value === 'Private' || userType.value === 'Public') && (
              <View>
                <CustomInput
                  showleftIcon
                  leftIconName="users"
                  placeholder={t('common:company') + ' ' + t('common:name')}
                  onTextChange={setCompanyName}
                  value={companyName}
                />

                <CustomInput
                  showleftIcon
                  leftIconName="users"
                  placeholder={t('common:department') + ' ' + t('common:name')}
                  onTextChange={setDepartmentID}
                  value={departmentId}
                />
              </View>
            )}

            <CustomInput
              showleftIcon
              leftIconName="map"
              placeholder={t('common:address')}
              onTextChange={setAddress}
              value={address}
            />

            <CustomInput
              showleftIcon
              leftIconName="map"
              placeholder={t('common:city')}
              onTextChange={setCity}
              value={city}
            />

            {/* <CustomInput
              showleftIcon
              leftIconName="map"
              placeholder={t('common:state')}
              onTextChange={setState}
              value={state}
            /> */}

            <CustomInput
              showleftIcon
              leftIconName="map"
              placeholder={t('common:zipcode')}
              onTextChange={setZipCode}
              value={zipcode}
              keyBoardType={'number-pad'}
            />

            <CountryPicker
              code={'DK'}
              setCountryCallingCode={setCountryCallingCode}
              setCountry={setCountry}
              country={country}
            />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text
                style={{
                  fontFamily: fonts.bold,
                  margin: 5,
                  fontSize: 18,
                  marginTop: 10,
                  color: colors.black,
                  marginEnd: spacing.five,
                  width: 50,
                }}>
                {countryCallingCode}
              </Text>
              <View style={{flex: 1}}>
                <CustomInput
                  placeholder={t('common:phone') + ' ' + t('common:number')}
                  onTextChange={setTelephone}
                  value={telephone}
                />
              </View>
            </View>
            {(userType.value === 'Private' || userType.value === 'Public') && (
              <View>
                <CustomInput
                  showleftIcon
                  leftIconName="book"
                  placeholder={t('common:EAN')}
                  onTextChange={setEAN}
                  value={EAN}
                />

                <CustomInput
                  showleftIcon
                  leftIconName="new"
                  placeholder={t('common:CVR')}
                  onTextChange={setCVR}
                  value={CVR}
                />
              </View>
            )}
            <CustomInput
              showleftIcon
              placeholder={t('common:password')}
              leftIconName="lock"
              onTextChange={setPassword}
              value={password}
              isSecure
            />

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

            <CustomInput
              showleftIcon
              placeholder={t('common:confirm') + ' ' + t('common:password')}
              leftIconName="lock"
              onTextChange={setConfirmPassword}
              value={confirmPassword}
              isSecure
            />
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
            {<CustomError message={erroMessage} />}

            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
              }}>
              <CustomRadioButton
                selected={terms}
                setSelected={setTerms}
                options={[{title: '', value: '1'}]}
              />
              <TouchableOpacity
                style={{flex: 1}}
                onPress={() => Linking.openURL('https://app.sprogteam.dk')}>
                <Text
                  style={{
                    fontFamily: fonts.medium,
                    color: colors.black,
                    marginEnd: spacing.ten,
                  }}>
                  I agree to Sprogteam's Terms & Conditions and Policy Privacy
                </Text>
              </TouchableOpacity>
            </View>
            <CustomButton
              buttonTitle={t('common:continue')}
              onTap={() => {
                onSubmit();
              }}
            />

            <View style={styles.view}>
              <Text style={styles.signUp}>
                {t('common:already') +
                  ' ' +
                  t('common:have') +
                  ' ' +
                  t('common:an') +
                  ' ' +
                  t('common:account')}
              </Text>
              <TouchableOpacity
                onPress={() => {
                  navigation.navigate('Login');
                }}>
                <Text
                  style={[
                    {color: colors.main},
                    {fontSize: fontSize.light, fontFamily: fonts.medium},
                  ]}>
                  {' ' + t('common:sign') + '' + t('common:in')}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {modalVisible && (
            <SuccessModal
              modalVisible={modalVisible}
              setModalVisible={setModalVisible}
              message={message}
              closeModal={() => {
                navigation.replace('Login');
              }}
            />
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SignUpScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
    },
    header: {
      // marginVertical: spacing.ten,
      fontSize: height * 0.03,
      color: colors.black,
      fontFamily: fonts.medium,
    },
    view: {
      flexDirection: 'row',
      justifyContent: 'center',
      marginTop: spacing.ten / 4,
    },
    signUp: {
      fontSize: fontSize.light,
      color: colors.black,
      alignSelf: 'flex-start',
      fontWeight: '400',
    },
    text: {
      fontFamily: fonts.medium,
      fontSize: 13,
      margin: 5,
      color: colors.black,
    },
    validationRow: {
      flexDirection: 'row',
      margin: 5,
      alignItems: 'center',
    },
  });

// olubiyi@gmail.com
// ho@gmail.com
