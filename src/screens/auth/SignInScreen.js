import React, {useState, useEffect, useContext} from 'react';
import {View, Text, Image, TouchableOpacity} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import {fonts} from '../../assets/fonts';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';
import axios from 'axios';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';

import {
  getUser,
  storeUserName,
  storeDetails,
  getServerToken,
  getUserName,
} from '../../data/data';
// import Feather from 'react-native-vector-icons/Feather';
import {authBaseUrl, setHeaders} from '../../util/util';
import {colors} from '../../assets/colors';

const SignIn = ({navigation}) => {
  const {setUser, setAuth, user, userName, setUserName} =
    useContext(AuthContext);
  const {t} = useTranslation();

  const [userId, setUserId] = useState(userName);
  const [password, setPassword] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const signIn = async () => {
    if (userId === null) setError('Username Cannot be empty');
    else if (password === null) setError('Password Cannot be empty');
    else {
      setLoading(true);
      setError(null);
      const user = {
        UserName: userId,
        Password: password,
      };

      try {
        var res = await axios.post(
          // liver server
          authBaseUrl + `/login`,
          // testing seerver
          // `https://aaltapi.herokuapp.com/authenticate/login`,
          user,
        );

        console.log(res.data);

        if (res.data.status && res.data.status === 'error') {
          setError(res.data.message);
          setLoading(false);
        } else {
          // console.log(res.data.token);

          const token = await getServerToken(userId, res.data.token);

          if (token !== null) {
            // set axios header

            await setHeaders(token.secret, token.token);

            var details = await getUser(userId);
            if (details.msg === 'success') {
              setUserName(userId);
              await storeUserName(userId);
              await storeDetails(details);
              setUser(details);
              setAuth(true);
            } else {
              console.log(details);
              setError(details.msg);
              setLoading(false);
            }
          } else {
            setError('Unable to authenticate you, please try again');
            setLoading(false);
          }
          // console.log(res.data);

          setLoading(false);
        }
      } catch (err) {
        console.log('comrade', err);
        if (err.message === 'Request failed with status code 401') {
          setError('Invalid credentials');
        } else setError('Unable to connect to server please try again later');

        setLoading(false);
        // [Error: Request failed with status code 401]
      }

      // axios
      //   .post(`/users/login`, user)
      //   .then(res => {
      //     if (res.data.msg === 'success') {
      //       const details = {
      //         profile: res.data.result[0],
      //         auth: true,
      //       };
      //       setUser(details);
      //       storeDetails(details);
      //       storeUserName(userId);
      //     } else {
      //       setLoading(false);
      //       setError('No match found for input details');
      //     }
      //   })
      //   .catch(err => {
      //     setLoading(false);
      //     setError(err.message);
      //   });
    }
  };

  async function fetchData() {
    const userNameLocal = await getUserName();
    setUserId(userNameLocal);
  }

  useEffect(() => {
    fetchData();
  }, []);

  // useEffect(() => {
  //   getUserName();
  // });

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
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
          height: 80,
          width: 80,
          marginTop: 20,
          borderRadius: 150,
        }}
        source={require('../../assets/imgs/logo.png')}
      />

      <View
        style={{
          marginStart: 8,
          marginEnd: 8,
          marginTop: 30,
          backgroundColor: '#fff',
          width: '90%',
          padding: 20,
          borderRadius: 10,
          elevation: 2,
        }}>
        <TitleHeader title={t('common:login_text')} />

        <View>
          {/* firstname */}
          <TextBoxTitle title={t('common:email')} />
          <TextBox
            name="mail"
            keyboardType={'email-address'}
            value={userId}
            onChangeText={val => setUserId(val)}
            autoCapitalize={'none'}
            autoCompleteType={'email'}
          />
          {/* Last name */}
          <TextBoxTitle title={t('common:password')} />

          <TextBox
            name="lock-closed"
            secureTextEntry={showPassword}
            onChangeText={val => setPassword(val)}
            placeholderTextColor="#fafafa"
            onSubmitEditing={() => {
              signIn();
            }}
          />
          <View style={{marginTop: 10}}>
            {error !== null && <ErrorMsg error={error} />}
            {loading ? (
              <Indicator color={'#659ED6'} show={loading} size={'large'} />
            ) : (
              <Button
                onPress={() => {
                  signIn();
                }}
                bGcolor={'#659ED6'}
                buttonTitle={t('common:log_in')}
              />
            )}
          </View>

          <TouchableOpacity
            onPress={() => navigation.navigate('Forgot')}
            style={{
              borderColor: '#659ED6',
              marginTop: 10,
            }}>
            <Text
              style={{
                fontSize: 13,
                color: '#659ED6',
                fontFamily: fonts.medium,
                alignSelf: 'flex-end',
              }}>
              {t('common:forgot_password')} ?
            </Text>
          </TouchableOpacity>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginTop: 10,
            }}>
            <TextBoxTitle showAsh={true} title={t('common:new_user') + '?'} />
            <TouchableOpacity
              onPress={() => navigation.navigate('AccountSelector')}
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
                {t('common:sign_up')} ?
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SignIn;
