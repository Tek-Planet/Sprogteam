import React, {useState, useContext, useEffect} from 'react';
import {View, Text, ScrollView, Image, TouchableOpacity} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import {fonts} from '../../assets/fonts';
import Button from '../../components/Button';
import TextBox from '../../components/TextInput';
import TextBoxTitle from '../../components/TextBoxTitle';
import axios from 'axios';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {authBaseUrl, baseURL} from '../../util/util';
import Body from '../../components/Body';

const SignIn = ({navigation}) => {
  const {storeDetails, setUser, storeUserName, userName, getUserName} =
    useContext(AuthContext);
  const [userId, setUserId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [stage, setStage] = useState('one');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [opt, setOpt] = useState(null);
  const [sentOpt, setSentOpt] = useState('');

  const signIn = async () => {
    if (userId.trim().length < 1) setError('Email Cannot be empty');
    else {
      setLoading(true);
      setError('');

      try {
        const res = await axios
          // live server
          .get(`${baseURL}/auth/users/${userId}`);
        // testing server
        // .get(`https://aatsapi.herokuapp.com/auth/users/${userId}`);
        if (res.data.msg === 'success') {
          // get user firstname
          const firstName = res.data.result.FirstName;
          // generate opt
          const code = await generateOpt();
          // send password rest mail
          setOpt(code);
          // send password reset code
          const mailResonse = await passwordResetMail(code, userId, firstName);

          //   check maill resonse
          if (mailResonse === 'success') {
            setStage('two');
          } else {
            setError('Unable to send password reset mail, please try again');
          }

          setLoading(false);

          // this shows the next form
        } else {
          setLoading(false);
          setError('No match found for input details');
        }
      } catch (error) {
        console.log(error);
        setError('Cannot connect to server');
        setLoading(false);
      }
    }
  };

  const upadatePassword = async () => {
    if (password.trim().length < 1 || confirmPassword.trim().length < 1)
      setError('password cannot be empty');
    else if (password !== confirmPassword) setError('password mismatch');
    else {
      const user = {
        UserName: userId,
        Password: password,
      };

      setLoading(true);
      setError('');

      try {
        var res = await axios.post(
          // testing server
          // `https://aaltapi.herokuapp.com/api/authenticate/forgotpassword`,
          // live server
          `${authBaseUrl}/forgotpassword`,
          user,
        );

        console.log(res.data);

        if (res.data.status === 'success' || res.data.status === 'Success') {
          setStage('four');

          setLoading(false);
        } else {
          if (res.data.status === 'error') {
            setLoading(false);

            setError(res.data.message);
          } else {
            setLoading(false);

            setError(res.data.message[0].description);
          }
        }
      } catch (error) {
        console.log(error);
        setLoading(false);
        setError(error.message);
        // [Error: Request failed with status code 401]
      }
    }
  };

  const generateOpt = () => {
    return Math.floor(100000 + Math.random() * 900000);
  };

  const confirmCode = () => {
    if (parseInt(opt) === parseInt(sentOpt)) {
      // show password reset box
      setError('');
      setStage('three');
    } else {
      setError('confirmation code does not match');
    }
  };

  const passwordResetMail = async (code, recipient, userName) => {
    const body = {
      recipient,
      userName,
      code,
    };

    try {
      var res = await axios.post(
        // testing endpoint
        // `https://aatsapi.herokuapp.com/mails/resetpassword`,

        // live server
        `${baseURL}/mails/resetpassword`,
        body,
      );
      console.log(res.data);
      return res.data.msg;
    } catch (error) {
      console.log(error);
      return 'failed';
    }
  };

  return (
    <View style={{flex: 1, alignItems: 'center', backgroundColor: '#fff'}}>
      <View
        style={{
          marginStart: 8,
          marginEnd: 8,

          backgroundColor: '#fff',
          width: '90%',
          padding: 20,
          borderRadius: 10,
          elevation: 2,
          height: 450,
        }}>
        {stage === 'one' && (
          <View>
            {/* firstname */}
            <TextBoxTitle title="Enter your email address" />
            <TextBox
              onChangeText={val => setUserId(val)}
              placeholderTextColor="#fafafa"
              keyboardType="email-address"
              autoCapitalize="none"

              // keyboardType="numeric"
            />
          </View>
        )}

        {stage === 'two' && (
          <View>
            {/* firstname */}
            <TextBoxTitle title="Enter reset code sent to your mail" />
            <TextBox
              onChangeText={val => setSentOpt(val)}
              placeholderTextColor="#fafafa"
              keyboardType="numeric"
            />
          </View>
        )}

        {stage === 'three' && (
          <View>
            <TextBoxTitle title="Pasaword" />
            <TextBox
              onChangeText={val => setPassword(val)}
              placeholderTextColor="#fafafa"
            />

            <TextBoxTitle title="Confirm Password" />
            <TextBox
              onChangeText={val => setConfirmPassword(val)}
              placeholderTextColor="#fafafa"
            />
          </View>
        )}

        {stage === 'four' ? (
          <View>
            <TextBoxTitle
              showAsh={true}
              title="Congratulations!!!  Your Password has been reset,"
            />
            <Button
              onPress={() => {
                navigation.navigate('SignIn');
              }}
              bGcolor={'green'}
              buttonTitle={'Login'}
            />
          </View>
        ) : (
          <View style={{marginTop: 10}}>
            {error.length > 0 && <ErrorMsg error={error} />}
            {loading ? (
              <Indicator color={'#659ED6'} show={loading} size={'large'} />
            ) : (
              <Button
                onPress={() => {
                  if (stage === 'one') signIn();
                  else if (stage === 'two') confirmCode();
                  else upadatePassword();
                }}
                bGcolor={'#659ED6'}
                buttonTitle={'Submit'}
              />
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default SignIn;
