import React, {useState, useContext} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  TextInput,
} from 'react-native';
import Button from '../components/Button';
import {fonts} from '../assets/fonts';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';

import {AirbnbRating} from 'react-native-elements';
import Indicator from '../components/ActivityIndicator';
import {toastNew as toast} from '../util/util';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {getExtraRatingData} from '../data/data';
import {useTranslation} from 'react-i18next';
import {CustomLanguageDropDown, ProfileHeader} from '../components';

const AddRating = ({navigation, route}) => {
  const {setReload, user} = useContext(AuthContext);
  const {t} = useTranslation();

  const extraRatingData = getExtraRatingData();

  const {info, userDetails} = route.params;
  const [loading, setLoading] = useState(false);
  var totalrating;
  var previuosRating = userDetails.Rating;
  var ratingNumber = userDetails.RatingNumber;
  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  // alert cariables
  const [value, setValue] = useState({
    label: t('common:select'),
    value: 0,
    selector: 0,
  });

  // function to add translator

  // function to add new translator to favourite

  function ratingCompleted(rating) {
    setRating(rating);
  }

  const updateRating = () => {
    setLoading(true);
    var intRatingNumber;

    if (!ratingNumber && ratingNumber === null) ratingNumber = 0;

    if (!previuosRating && previuosRating === null) previuosRating = 0;

    totalrating = ratingNumber * previuosRating;

    intRatingNumber = ++ratingNumber;

    var currentRating = (totalrating + rating) / intRatingNumber;

    const ratingValue = {
      ratingNumber: intRatingNumber,
      rating: currentRating,
      Id: info.InterpreterID,
    };

    axios
      .put(`/users/rating`, ratingValue)
      .then(res => {
        if (res.data.msg === 'success') {
          console.log('rating susscesful');
          addRating();
        } else {
          console.log(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const addRating = () => {
    const newRating = {
      BookingId: info.BookingID,
      RekvirantId: info.CreateBy,
      InterpretorID: info.InterpreterID,
      CustomerName: user.profile.FirstName,
      InterpreterNoShow: value.selector === 1 ? 1 : 0, //option.opt3,
      InterpreterNoAnswerPhone: value.selector === 2 ? 1 : 0,
      InterpreterToLate: value.selector === 3 ? 1 : 0, // option.opt2,
      InterpreterLanguage: value.selector === 4 ? 1 : 0,
      InterpreterBehavior: value.selector === 6 ? 1 : 0, // option.opt4,
      worngLanguage: value.selector === 6 ? 1 : 0,
      wrongInterpreterName: value.selector === 7 ? 1 : 0,
      wrongGender: value.selector === 8 ? 1 : 0,
      ServiceOk: value.selector === 9 ? 1 : 0, //option.opt5,
      changeOfBooking: value.selector === 10 ? 1 : 0,
      BookingOK: value.selector === 11 ? 1 : 0,
      BookingOkDissatisfield: value.selector === 12 ? 1 : 0,
      CitizenNoshow: value.selector === 13 ? 1 : 0,
      Stars: rating,
      Remark: body,
    };

    // console.log(newRating);

    axios
      .post(`/ratings`, newRating)
      .then(res => {
        if (res.data.msg === 'success') {
          updateBooking(info.BookingID);
        } else {
          console.log(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  const updateBooking = async bookingId => {
    try {
      await axios.put(`/orders/${bookingId}`);

      setReload(true);

      await toast('Thank you, your feedback as been noted', 'success');

      navigation.navigate('Drawer');
    } catch (error) {
      setLoading(false);
      toast(error.message, 'error');
      console(error.message);
    }
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <ProfileHeader navigation={navigation} />
        <View
          style={{
            margin: 5,
            flex: 1,
            backgroundColor: '#fff',
          }}>
          <Text
            style={[
              styles.text,
              {fontFamily: fonts.bold, textAlign: 'center'},
            ]}>
            {t('common:rate_header')}
          </Text>

          <AirbnbRating
            onFinishRating={ratingCompleted}
            count={5}
            reviews={['Terrible', 'Bad', 'Okay', 'Good', 'Amazing']}
            defaultRating={0}
            size={20}
          />

          <View style={{marginTop: 20}}>
            <CustomLanguageDropDown
              value={value}
              language={extraRatingData}
              setValue={setValue}
              showSearch
            />
          </View>

          <TextInput
            onChangeText={val => setBody(val)}
            multiline={true}
            numberOfLines={10}
            style={{
              textAlignVertical: 'top',
              borderColor: '#000',
              color: '#000',
              borderWidth: 1,
              fontSize: 16,
              padding: 5,
              margin: 5,
              marginTop: 20,
              marginBottom: 10,
              borderRadius: 10,
              height: 60,
              fontFamily: fonts.medium,
              height: 300,
            }}
            placeholder={'Comments'}
            placeholderTextColor="#adb5bd"
          />

          <View style={{marginBottom: 20}}>
            {loading ? (
              <Indicator color={'#659ED6'} show={loading} size={'large'} />
            ) : (
              <Button
                onPress={() => updateRating()}
                bGcolor={'#659ED6'}
                buttonTitle={'Submit'}
              />
            )}
          </View>

          {/* <View style={{marginTop: 10}}>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option}
              onPress={() => {
                setOption(!option);
              }}
            />
            <TextBoxTitle title="Tolk ikke mødt op" showAsh={true} />
          </View>

          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option1}
              onPress={() => {
                setOption1(!option1);
              }}
            />
            <TextBoxTitle
              title="Tolkens svarer ikke på opkald"
              showAsh={true}
            />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option2}
              onPress={() => {
                setOption2(!option2);
              }}
            />
            <TextBoxTitle title="Tolk mødt for sent" showAsh={true} />
          </View>
          <View style={[styles.checkBoxRow, {width: '80%'}]}>
            <CheckBox
              checked={option3}
              onPress={() => {
                setOption3(!option3);
              }}
            />
            <TextBoxTitle
              title="Tolkens sprogfærdigheder var ikke i orden"
              showAsh={true}
            />
          </View>
          <View style={[styles.checkBoxRow, {width: '80%'}]}>
            <CheckBox
              checked={option4}
              onPress={() => {
                setOption4(!option4);
              }}
            />
            <TextBoxTitle
              title="Tolkens adfærd levede ikke op til forventningerne"
              showAsh={true}
            />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option5}
              onPress={() => {
                setOption5(!option5);
              }}
            />
            <TextBoxTitle title="Forkert sprog/dialekt" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option6}
              onPress={() => {
                setOption6(!option6);
              }}
            />
            <TextBoxTitle
              title="Ikke den bestilte navngivne tolk"
              showAsh={true}
            />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option7}
              onPress={() => {
                setOption7(!option7);
              }}
            />
            <TextBoxTitle title="Ikke det bestilte køn" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option8}
              onPress={() => {
                setOption8(!option8);
              }}
            />
            <TextBoxTitle title="Service ifm. bestilling" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option9}
              onPress={() => {
                setOption9(!option9);
              }}
            />
            <TextBoxTitle title="Ændring af booking" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option10}
              onPress={() => {
                setOption10(!option10);
              }}
            />
            <TextBoxTitle title="Booking ok" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option11}
              onPress={() => {
                setOption11(!option11);
              }}
            />
            <TextBoxTitle title="Booking ok men utilfreds" showAsh={true} />
          </View>
          <View style={styles.checkBoxRow}>
            <CheckBox
              checked={option12}
              onPress={() => {
                setOption12(!option12);
              }}
            />
            <TextBoxTitle title="Borgerne mødte ikke op" showAsh={true} />
          </View>
        </View> */}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddRating;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
    textAlign: 'justify',
    margin: 5,
  },
  view: {
    marginTop: 10,
    borderRadius: 10,
    paddingTop: 10,
  },
  checkBoxRow: {flexDirection: 'row', alignItems: 'center', marginTop: -15},
});
