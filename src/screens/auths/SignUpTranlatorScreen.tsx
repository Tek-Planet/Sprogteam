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
  DatePicker,
  Header,
  PageIndicator,
  SuccessModal,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {errorText, errorValue, height, initialSelect, width} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {SelectOptionType, TabItem} from '../../types';
import {registerUser} from '../../rtk/features/user/userSlice';
import {TouchableOpacity} from 'react-native';
import AntDesign from 'react-native-vector-icons/AntDesign';
import {usePasswordValidation} from '../../utils/usePasswordValidation';
type Props = NativeStackScreenProps<AuthStackParams, 'SignUpTranslator'>;

const SignUpTranlatorScreen = ({navigation, route}: Props) => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {user} = route.params;

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

  const [about, setAbout] = useState<string>('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [country, setCountry] = useState('Country');
  const [countryCallingCode, setCountryCallingCode] = useState('+00');
  const [category, setCategory] = useState<SelectOptionType>(initialSelect());

  const [message, setMessage] = useState<string>('');

  const [DOB, setDOB] = useState<Date | undefined | 'error'>(undefined);
  const requiredLength = 6;
  const [validLength, hasNumber, upperCase, lowerCase, match, specialChar] =
    usePasswordValidation({password, confirmPassword, requiredLength});

  const radioOption: TabItem[] = [
    {title: t('common:male'), value: '2'},
    {
      title: t('common:female'),
      value: '1',
    },
  ];

  const categories: SelectOptionType[] = [
    {label: t('common:government_approve'), value: '1'},
    {
      label: t('common:state_approve'),
      value: '2',
    },
    {
      label: t('common:others'),
      value: '3',
    },
  ];

  const [selected, setSelected] = useState<TabItem>(radioOption[0]);
  const [terms, setTerms] = useState<TabItem>();

  const onSubmit = async () => {
    if (terms?.value !== '1') {
      setErrorMessage('Agree to terms and condition');
      return;
    }

    setErrorMessage('');

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
    if (category.value === 'Select' || category.value === 'error') {
      setCategory(errorValue);
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

    setLoading(true);
    setErrorMessage('');

    let companyname = firstName + ' ' + lastName;

    const newUser: any = {
      Email: email.trim().toLowerCase(),
      Phone: countryCallingCode + telephone,
      FirstName: firstName,
      LastName: lastName,
      Adresse: address,
      Zipcode: parseInt(zipcode),
      City: city,
      State: state,
      GenderId: parseInt(selected.value),
      AccountNumber: null,
      About: about,
      Sunheld: 0,
      DOB: DOB,
      Password: password,
      CompanyStatus: 'Person',
      ConfirmPassword: password,
      // for the customer
      CVR: 0,
      EAN: null,
      CompanyName: companyname,
      CreateAt: new Date().toISOString(),
      Country: country,
      CategoryId: parseInt(category.value),
      interpreter: true,
    };

    var response: any = await dispatch(registerUser(newUser));

    if (response.payload?.message === 'successful') {
      setEmail(response.payload?.Id);
      setMessage('Registration Successful');
      setModalVisible(true);
    } else {
      console.log(response, 'some erro');
      setErrorMessage('Unable to create your account');
      setLoading(false);
    }
  };

  return (
    <View style={{...styles.container}}>
      <Header
        showleftIcon
        headerTitle={t('common:personal') + ' ' + t('common:information')}
      />
      <View style={{alignItems: 'center'}}>
        <PageIndicator pageNum={1} ofPage={3} />
      </View>

      {loading && <CustomLoader color={colors.main} />}
      <KeyboardAwareScrollView>
        <ScrollView>
          <View
            style={{
              margin: spacing.ten,
              paddingBottom: spacing.twenty * 5,
            }}>
            <CustomInput
              showleftIcon
              leftIconName="mail"
              placeholder={t('common:email')}
              onTextChange={setEmail}
              value={email}
            />
            <CustomInput
              showleftIcon
              leftIconName="user"
              placeholder={
                category.value === 'Private' || category.value === 'Public'
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
                category.value === 'Private' || category.value === 'Public'
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

            <DatePicker
              date={DOB}
              setDate={setDOB}
              title={
                t('common:date') +
                ' ' +
                t('common:of') +
                ' ' +
                t('common:birth')
              }
            />

            <CustomRadioButton
              label={t('common:sex')}
              selected={selected}
              setSelected={setSelected}
              options={radioOption}
            />

            <CustomDropDown
              label={t('common:category')}
              value={category}
              options={categories}
              setValue={setCategory}
              title={t('common:category')}
            />

            <CustomInput
              placeholder={t('common:about')}
              onTextChange={setAbout}
              value={about}
              height={100}
            />

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
                navigation.replace('AddLanguage', {userId: email});
              }}
            />
          )}
        </ScrollView>
      </KeyboardAwareScrollView>
    </View>
  );
};

export default SignUpTranlatorScreen;

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
