import React, {useState} from 'react';
import {View, StyleSheet, TextInput} from 'react-native';

// radio-btn-active

import Button from '../../components/Button';

import ErrorMsg from '../../components/ErrorMsg';

import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';
import {
  ActivityIndicator,
  CustomDropDown,
  ProfileHeader,
} from '../../components';
import {colors} from '../../assets/colors';
import {aalborgMail, getCurrentDate, toastNew as toast} from '../../util/util';
import {saveFeedBack, sendFeedBackMail} from '../../data/data';

const FeedBackScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const {item} = route.params;

  const isUser = item.CompanyName.toLowerCase().includes(
    'Aalborg kommune'.toLowerCase(),
  )
    ? false
    : true;

  const requesterMail = isUser ? item.RekvirantID : aalborgMail;

  const [body, setBody] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState({
    label: t('common:select'),
    value: 0,
  });
  const options = [
    {
      label: t('common:select') + ' ' + t('common:title'),
      value: 0,
    },
    {
      label: 'Citizens was absent',
      value: 1,
    },
    {
      label: 'Clients was absent',
      value: 2,
    },
    {
      label: 'I haven’t been called',
      value: 3,
    },
    {
      label: 'Citizens has received a message',
      value: 4,
    },
    {
      label: 'I couldn’t get in touch with citizen',
      value: 5,
    },
    {
      label: 'There was booked a wrong language',
      value: 6,
    },
  ];

  const sendFeedback = async () => {
    try {
      setLoading(true);
      if (value.value === 0) {
        setError('Select Message Title');
        return;
      }

      setError('');
      const msgBody = {
        details: body,
        title: value.label,
        bookindID: item.BookingID,
        OrdreNumber: item.CompanyName.toLowerCase().includes(
          'Aalborg kommune'.toLowerCase(),
        )
          ? item?.OrdreNumber
          : null,
        recipient: ['noreply@sprogteam.dk'],
        createdAt: getCurrentDate(),
      };

      sendFeedBackMail(msgBody);
      saveFeedBack(msgBody);

      // setLoading(false);
      toast('Response send', 'success');
      navigation.goBack();
    } catch (error) {
      console.log(error);
      setError('Unable to send your feedback');
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <ProfileHeader />
      <View
        style={{
          padding: 10,
        }}>
        <View>
          {/* <Text style={{fontFamily: fonts.medium, margin: 10}}>Gi</Text> */}

          <CustomDropDown
            title={options[0].label}
            value={value}
            language={options}
            setValue={setValue}
          />

          <View style={styles.inputContainer}>
            <TextInput
              onChangeText={val => setBody(val)}
              multiline={true}
              numberOfLines={10}
              style={{
                textAlignVertical: 'top',
                fontSize: 16,
                padding: 5,
                margin: 5,
              }}
              placeholder={t('common:details')}
              placeholderTextColor="#adb5bd"
            />
          </View>
          <ErrorMsg error={error} />
        </View>
        <View>
          {loading ? (
            <ActivityIndicator
              color={'#659ED6'}
              show={loading}
              size={'large'}
            />
          ) : (
            <Button
              onPress={() => sendFeedback()}
              bGcolor={'#659ED6'}
              buttonTitle={t('common:send')}
            />
          )}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  text: {
    margin: 20,
    fontSize: 15,
    fontFamily: fonts.medium,
    color: '#000',
  },

  inputContainer: {
    margin: 10,
    borderRadius: 10,
    borderColor: colors.main,
    borderWidth: 1,
    height: 100,
  },

  input: {
    textAlignVertical: 'top',
    backgroundColor: '#fff',
  },
});

export default FeedBackScreen;
