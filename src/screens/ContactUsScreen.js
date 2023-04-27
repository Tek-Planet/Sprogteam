import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';

// radio-btn-active

import Button from '../components/Button';
import Indicator from '../components/ActivityIndicator';
import ErrorMsg from '../components/ErrorMsg';
import Contact from '../components/Contact';
import {callNumber} from '../components/call';
import {Icon} from 'react-native-elements';
import {fonts} from '../assets/fonts';
import {useTranslation} from 'react-i18next';
import {colors} from '../assets/colors';

const ContactUsScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const saveBooking = () => {
    if (body.trim().length < 1) setError('message body cannot be empty');
    else {
      setError('');
      const booking = {
        body: body,
        startDate: startDate,
        endDate: endDate,
        created: new Date(),
        bookerId: '2',
        translatorId: '3',
      };

      console.log(booking);
    }
  };

  return (
    <ScrollView>
      <View style={styles.container}>
        <View
          style={{
            paddingStart: 10,
            paddingEnd: 10,
            flex: 1,
          }}>
          <View>
            <View style={{}}>
              <Text
                style={{
                  fontFamily: fonts.medium,
                  marginStart: 10,
                  marginBottom: 20,
                  color: colors.black,
                }}>
                {t('common:contact_question')}
              </Text>
              <View
                style={{
                  marginStart: 10,
                  marginTop: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Text style={{fontFamily: fonts.medium, color: colors.black}}>
                  {t('common:call_us')}
                </Text>

                <TouchableOpacity
                  onPress={() => {
                    callNumber('+4522665421');
                  }}
                  style={{
                    marginStart: 10,
                    width: 30,
                    height: 30,
                    borderRadius: 100,
                    backgroundColor: '#659ED6',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    type="Ionicons"
                    name="call"
                    size={20}
                    color={colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            <Text
              style={{
                fontFamily: fonts.medium,
                margin: 10,
                color: colors.black,
              }}>
              {t('common:send_us_message')}
            </Text>

            <TextInput
              onChangeText={val => setBody(val)}
              style={{
                textAlignVertical: 'top',
                borderColor: '#adb5bd',
                color: colors.black,
                borderWidth: 1,
                fontSize: 16,
                padding: 5,
                margin: 5,
                borderRadius: 10,
              }}
              placeholder={t('common:title')}
              placeholderTextColor="#adb5bd"
            />

            <TextInput
              onChangeText={val => setBody(val)}
              multiline={true}
              numberOfLines={10}
              style={{
                textAlignVertical: 'top',
                borderColor: '#adb5bd',
                color: colors.black,
                borderWidth: 1,
                fontSize: 16,
                padding: 5,
                margin: 5,
                borderRadius: 10,
              }}
              placeholder={t('common:details')}
              placeholderTextColor="#adb5bd"
            />

            <ErrorMsg error={error} />
          </View>
          <View>
            {loading ? (
              <Indicator color={'#659ED6'} show={loading} size={'large'} />
            ) : (
              <Button
                onPress={() => saveBooking()}
                bGcolor={'#659ED6'}
                buttonTitle={t('common:send')}
              />
            )}
          </View>
          <Contact title={t('common:contact') + ' ' + t('common:us')} />
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 20,
  },

  text: {
    margin: 20,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: colors.black,
  },
});

export default ContactUsScreen;
