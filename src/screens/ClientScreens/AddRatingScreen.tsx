import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput} from 'react-native';

import {Rating} from 'react-native-ratings';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

import {useTranslation} from 'react-i18next';
import {
  CustomButton,
  CustomLanguageDropDown,
  CustomLoader,
  Header,
} from '../../components';
import {fonts} from '../../assets/fonts';
import {getExtraRatingData, toast} from '../../utils';
import {spacing} from '../../assets/spacing';
import {
  useAddRatingMutation,
  useChangeRatingStatusMutation,
  useUpdateUserRatingMutation,
} from '../../rtk/services';
import {useAppSelector} from '../../rtk/hooks';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/MainNavigation';
type Props = NativeStackScreenProps<RootStackParams, 'Addrating'>;

const AddRatingScreen = ({navigation, route}: Props) => {
  const {t} = useTranslation();
  const {user} = useAppSelector(state => state.user);

  const {info, userDetails} = route.params;

  var totalrating;
  var previuosRating = userDetails?.Rating;
  var ratingNumber = userDetails?.RatingNumber;

  const [body, setBody] = useState('');
  const [rating, setRating] = useState(0);
  // alert cariables
  const [value, setValue] = useState<any>({
    label: t('common:select'),
    value: 'Select',
  });

  const [updateUserRating, {isLoading: isSaving}] =
    useUpdateUserRatingMutation();

  const [addRating, {isLoading: isAddingRating}] = useAddRatingMutation();

  const [changeRatingStatus, {isLoading: isUpdating}] =
    useChangeRatingStatusMutation();

  const updateRating = async () => {
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

    // console.log(ratingValue);

    var response: any = await updateUserRating(ratingValue);

    if (response?.data) {
      createRating();
      console.log(response.data);
    } else {
      console.log(response.error);
    }
  };

  const createRating = async () => {
    const newRating = {
      BookingId: info.BookingID,
      RekvirantId: info.CreateBy,
      InterpretorID: info.InterpreterID,
      CustomerName: user.FirstName,
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

    console.log(newRating);

    var response: any = await addRating(newRating);

    if (response?.data) {
      // addRating();
      console.log(response.data);
      updateBooking(info.BookingID);
    } else {
      console.log(response.error, 'Error with creating new rating');
    }
  };

  const updateBooking = async (bookingId: number) => {
    var response: any = await changeRatingStatus(bookingId);

    if (response?.data) {
      // addRating();
      await toast('Thank you, your feedback as been noted', 'success');
      navigation.navigate('Archive');
    } else {
      console.log(response.error);
      toast('Unable to complete rating', 'error');
    }
  };

  return (
    <KeyboardAwareScrollView style={{backgroundColor: '#fff'}}>
      <View
        style={{
          flex: 1,
          justifyContent: 'space-between',
        }}>
        <Header headerTitle={t('common:rating')} showleftIcon />
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

          <Rating
            onFinishRating={setRating}
            style={{marginTop: spacing.fiften}}
            imageSize={35}
            startingValue={rating}
          />

          <View style={{marginTop: 20}}>
            <CustomLanguageDropDown
              value={value}
              options={getExtraRatingData()}
              setValue={setValue}
              showSearch
              title={t('common:available') + ' ' + t('common:services')}
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
              fontFamily: fonts.medium,
              height: 300,
            }}
            placeholder={'Comments'}
            placeholderTextColor="#adb5bd"
          />

          <View style={{marginBottom: 20}}>
            {isSaving || isAddingRating || isUpdating ? (
              <CustomLoader color={'#659ED6'} />
            ) : (
              <CustomButton
                onTap={() => updateRating()}
                bGcolor={'#659ED6'}
                buttonTitle={'Submit'}
              />
            )}
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default AddRatingScreen;

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
