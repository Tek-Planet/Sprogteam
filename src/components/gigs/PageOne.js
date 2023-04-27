import React, {useEffect, useContext} from 'react';
import {View} from 'react-native';
import {
  TextBoxTitle,
  TextInput,
  Button,
  CustomDropDown,
  CustomCheckBox,
} from '..';
import {useTranslation} from 'react-i18next';
import {AuthContext} from '../../context/AuthProvider';
import {getLanguages} from '../../data/data';
import {dimention} from '../../util/util';

const PageOne = props => {
  const {
    nextPage,
    previousPage,
    setTitle,
    title,
    language,
    setError,
    setLanguage,
    checkPhone,
    setCheckPhone,
    checkVideo,
    setCheckedVideo,
    checkAttendance,
    setCheckedAttendance,
    checkWritten,
    setCheckWritten,
    service,
    setService,
    toLanguage,
    setToLanguage,
  } = props;
  // console.log(service);
  const {t} = useTranslation();
  const {user, setLanguages, booking_types, available_services} =
    useContext(AuthContext);
  const fetchData = async () => {
    const res = await getLanguages();
    setLanguages(res);
  };
  var languages = user?.profile?.languages;

  useEffect(() => {
    if (languages.length === 0) fetchData();
  }, []);

  const next = () => {
    if (
      title === null ||
      language.value === 'Select' ||
      toLanguage.value === 'Select'
    ) {
      setError('All fields are required');
      return;
    }

    if (language.value === toLanguage.value) {
      setError('Language cannot be the same');
      return;
    }
    // if (!checkVideo && !checkPhone && !checkAttendance && !checkWritten) {
    //   setError('Select at least one booking type');
    //   return;
    // }
    setError(null);
    nextPage('two');
  };

  return (
    <View style={{flex: 1}}>
      <View style={{height: dimention.height * 0.7}}>
        <TextBoxTitle
          title={t('common:gig') + ' ' + t('common:title')}
          showAsh
        />
        <TextInput
          value={title}
          multiline={true}
          numberOfLines={3}
          placeholderTextColor="#fafafa"
          height={100}
          onChangeText={val => setTitle(val)}
        />
        {/* from language */}
        <View style={{marginTop: 10}}>
          <TextBoxTitle
            title={t('common:from') + ' ' + t('common:language')}
            showAsh
          />
          <CustomDropDown
            title={'Languages'}
            value={language}
            language={languages}
            setValue={setLanguage}
          />
        </View>

        {/* to language */}
        <View style={{marginTop: 10}}>
          <TextBoxTitle
            title={t('common:to') + ' ' + t('common:language')}
            showAsh
          />
          <CustomDropDown
            title={'Languages'}
            value={toLanguage}
            language={languages}
            setValue={setToLanguage}
          />
        </View>

        {/* addede this */}
        {/* take it off from here manss */}
        <View style={{marginTop: 15}} />
        <TextBoxTitle title={t('common:services')} showAsh />

        <CustomDropDown
          title={'Services'}
          value={service}
          language={available_services}
          setValue={setService}
        />
        {(service.value === 3 || service.value === 1) && (
          <View>
            <CustomCheckBox
              checked={checkPhone}
              setChecked={setCheckPhone}
              placeholder={booking_types[2].label}
            />
            <CustomCheckBox
              checked={checkVideo}
              setChecked={setCheckedVideo}
              placeholder={booking_types[1].label}
            />
            <CustomCheckBox
              checked={checkAttendance}
              setChecked={setCheckedAttendance}
              placeholder={booking_types[0].label}
            />
            {/* <CustomCheckBox
              checked={checkWritten}
              setChecked={setCheckWritten}
              placeholder={booking_types[3].label}
            /> */}
          </View>
        )}
      </View>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Button
          buttonTitle={t('common:cancel')}
          bGcolor={'#800000'}
          onPress={() => {
            previousPage('cancel');
          }}
        />
        <Button
          buttonTitle={t('common:next')}
          onPress={() => {
            next();
          }}
        />
      </View>
    </View>
  );
};
export default PageOne;
