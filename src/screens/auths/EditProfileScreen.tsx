import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  CountryPicker,
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  Header,
  SuccessModal,
} from '../../components';

import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {fetchUser, updateUserRecord} from '../../rtk/features/user/userSlice';
import {useAppDispatch, useAppSelector} from '../../rtk/hooks';
import {RootStackParams} from '../../navigations/MainNavigation';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type Props = NativeStackScreenProps<RootStackParams, 'EditProfile'>;

const EditProfileScreen = ({navigation}: Props) => {
  const {user} = useAppSelector(state => state.user);
  const [loading, setLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  const [message, setMessage] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [firstName, setFirstName] = useState(user.FirstName);
  const [lastName, setLastName] = useState(user.LastName);
  const [companyName, setCompanyName] = useState(
    user.CompanyName && user.CompanyName !== undefined
      ? user.CompanyName
      : null,
  );
  const [address, setAddress] = useState(user.Adresse);
  const [city, setCity] = useState(user.City);
  const [state, setState] = useState(user.State);

  const [zipcode, setZipCode] = useState(user.Zipcode + '');
  const [telephone, setTelephone] = useState(user.PhoneNumber);

  const [about, setAbout] = useState(
    user.About && user.About !== undefined ? user.About : null,
  );

  const [DOB, setDOB] = useState(
    user.DOB && user.DOB !== undefined ? user.DOB : null,
  );

  const [cvr, setCvr] = useState<string>(user?.CVR ? user.CVR + '' : '');

  const [EAN, setEAN] = useState(user.EAN && user.EAN !== null ? user.EAN : 0);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [country, setCountry] = useState(
    user?.Country ? user?.Country : 'Country',
  );
  const [countryCallingCode, setCountryCallingCode] = useState('');

  const onSubmit = async () => {
    let body: any = {};

    body = {
      Id: user.Id,
      FirstName: firstName,
      LastName: lastName,
      Adresse: address,
      City: city,
      State: state,
      Zipcode: zipcode,
      PhoneNumber:
        telephone !== null && telephone !== user.PhoneNumber
          ? countryCallingCode + telephone
          : telephone,
      Country: country,
    };

    if (user.CompanyStatus === 'Person') {
      body.About = about;
      body.DOB = DOB;
    } else {
      body.CVR = cvr;
      body.EAN = EAN;
      body.CompanyName = companyName;
    }

    setLoading(true);
    var response = await dispatch(updateUserRecord(body));

    if (response.payload) {
      setMessage(t('common:record') + ' ' + t('common:updated'));
      setModalVisible(true);
      dispatch(fetchUser());
      return;
    }

    setLoading(false);
    setErrorMessage('Unable to update Profile');
  };


  return (
    <View style={{...styles.container}}>
      <Header
        isProflePage
        showleftIcon
        showRightIcon
        headerTitle={t('common:edit') + ' ' + t('common:profile')}
      />
      {loading && <CustomLoader color={colors.main} />}
      <ScrollView>
        <KeyboardAwareScrollView>
          <View
            style={{
              flex: 1,
              padding: spacing.ten,
              justifyContent: 'space-between',
            }}>
            <ScrollView>
              <View style={{flex: 1}}>
                <CustomInput
                  placeholder={t('common:first') + ' ' + t('common:name')}
                  label={t('common:first') + ' ' + t('common:name')}
                  onTextChange={setFirstName}
                  value={firstName}
                />

                <CustomInput
                  placeholder={t('common:last') + ' ' + t('common:name')}
                  label={t('common:last') + ' ' + t('common:name')}
                  onTextChange={setLastName}
                  value={lastName}
                />

                <CustomInput
                  placeholder={t('common:address')}
                  label={t('common:address')}
                  onTextChange={setAddress}
                  value={address}
                />

                <CustomInput
                  placeholder={t('common:city')}
                  label={t('common:city')}
                  onTextChange={setCity}
                  value={city}
                />

                {/* <CustomInput
                  placeholder={t('common:state')}
                  label={t('common:state')}
                  onTextChange={setState}
                  value={state}
                /> */}

                <CustomInput
                  placeholder={t('common:zip') + ' ' + t('common:code')}
                  label={t('common:zip') + ' ' + t('common:code')}
                  onTextChange={setZipCode}
                  value={zipcode}
                />

                <CountryPicker
                  setCountryCallingCode={setCountryCallingCode}
                  setCountry={setCountry}
                  country={country}
                />

                <CustomInput
                  placeholder={t('common:phone') + ' ' + t('common:number')}
                  label={t('common:phone') + ' ' + t('common:number')}
                  onTextChange={setTelephone}
                  value={telephone}
                />

                {(user?.CompanyStatus === 'Private' ||
                  user?.CompanyStatus === 'Public') && (
                  <View>
                    <CustomInput
                      placeholder={t('company') + ' ' + t('name')}
                      label={t('company') + ' ' + t('name')}
                      onTextChange={setCompanyName}
                      value={companyName}
                    />

                    <CustomInput
                      placeholder={t('common:cvr')}
                      label={t('common:cvr')}
                      onTextChange={setCvr}
                      value={cvr}
                    />

                    <CustomInput
                      placeholder={t('common:eaa')}
                      label={t('common:ean')}
                      onTextChange={setEAN}
                      value={EAN}
                    />
                  </View>
                )}

                {/* interpreter */}
                {user?.CompanyStatus !== 'Private' &&
                  user?.CompanyStatus !== 'Public' && (
                    <View>
                      <CustomInput
                        height={100}
                        placeholder={t('about')}
                        label={t('about')}
                        onTextChange={setAbout}
                        value={about}
                      />
                    </View>
                  )}
              </View>
            </ScrollView>

            <View>
              {<CustomError message={erroMessage} />}

              <CustomButton
                buttonTitle={t('common:update') + ' ' + t('common:record')}
                onTap={() => {
                  onSubmit();
                }}
              />
            </View>

            {modalVisible && (
              <SuccessModal
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                message={message}
                closeModal={() => {
                  setModalVisible(false);
                  navigation.goBack();
                }}
              />
            )}
          </View>
        </KeyboardAwareScrollView>
      </ScrollView>
    </View>
  );
};

export default EditProfileScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    image: {
      height: 100,
      width: 100,
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
    },

    forgotPassword: {
      marginVertical: spacing.ten,
      fontSize: fontSize.light,
      color: colors.main,
      alignSelf: 'flex-end',
      fontFamily: fonts.medium,
    },

    signUp: {
      marginVertical: 10,
      fontSize: fontSize.light,
      alignSelf: 'center',
      fontFamily: fonts.medium,
    },
  });
