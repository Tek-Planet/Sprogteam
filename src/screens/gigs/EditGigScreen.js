import React, {useState, useContext} from 'react';
import {View, Text, Image} from 'react-native';
import {colors} from '../../assets/colors';
import {PageOne, PageTwo, PageThree, PageFour} from '../../components/gigs';
import {useTranslation} from 'react-i18next';
import ProfileHeader from '../../components/ProfileHeader';
import {ActivityIndicator, Button, ErrorMsg} from '../../components';
import {AuthContext} from '../../context/AuthProvider';

import {editGiG, editPackage} from '../../data/data';

import {fonts} from '../../assets/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {uploadFIle} from '../../util/util';

const EditGigScreen = ({navigation, route}) => {
  const {t} = useTranslation();
  const {user, setReloadGigs} = useContext(AuthContext);
  const {item} = route?.params;
  // console.log(item);
  //movin on let move bro
  const [page, setPage] = useState('one');
  const [title, setTitle] = useState(item.title);
  const initialState = {label: t('common:select'), value: 'Select'};
  const [language, setLanguage] = useState({
    label: item.languageName,
    value: item.languageID,
  });
  const [toLanguage, setToLanguage] = useState({
    label: item.toLanguageName ? item.toLanguageName : t('common:select'),
    value: item.toLanguageID ? item.toLanguageID : 'Select',
  });

  const [service, setService] = useState({
    label: item.service,
    value: item.serviceId,
  });
  const [checkPhone, setCheckPhone] = useState(item.checkPhone);
  const [checkVideo, setCheckedVideo] = useState(item.checkVideo);
  const [checkAttendance, setCheckedAttendance] = useState(
    item.checkAttendance,
  );
  const [checkWritten, setCheckWritten] = useState(false);

  const [error, setError] = useState(null);
  const [loadingText, setLoadingText] = useState(
    'Please hold, while we process your GiG',
  );
  const [loading, setLoading] = useState(false);

  // Page two variables
  const durations = [
    {label: 'Hours', value: 'Hours'},
    {label: 'Days', value: 'Days'},
  ];
  var categories = item.package;

  const [POName, setPOName] = useState(categories[0].name);
  const [PODescription, setPODescription] = useState(categories[0].description);
  const [POPPrice, setPOPPrice] = useState(categories[0].PPPrice + '');
  const [POVPrice, setPOVPrice] = useState(categories[0]?.PVPrice + '');
  const [POAPrice, setPOAPrice] = useState(categories[0]?.PAPrice + '');
  const [POWPrice, setPOWPrice] = useState(null);

  const [PODelivery, setPODelivery] = useState(categories[0].delivery + '');
  const [PODuration, setPODuration] = useState({
    value: categories[0].duration,
    label: categories[0].duration,
  });

  // addons
  const [POWordCount, setPOWordCount] = useState(categories[0].wordcount);
  const [PORevision, setPORevision] = useState(categories[0].revision);
  const [POProofReading, setPOProofReading] = useState(
    categories[0].proofreading,
  );
  const [POLangStyle, setPOLangStyle] = useState(categories[0].styling);
  const [PODocFormatting, setPODocFormatting] = useState(
    categories[0].formatting,
  );
  const [POSubtitling, setPOSubtitling] = useState(categories[0].subtitling);
  // pachage 2
  const [PTName, setPTName] = useState(categories[1].name);
  const [PTDescription, setPTDescription] = useState(categories[1].description);
  const [PTPPrice, setPTPPrice] = useState(categories[1].PPPrice + '');
  const [PTVPrice, setPTVPrice] = useState(categories[1].PVPrice + '');
  const [PTAPrice, setPTAPrice] = useState(categories[1].PAPrice + '');
  const [PTWPrice, setPTWPrice] = useState(null);
  const [PTDelivery, setPTDelivery] = useState(categories[1].delivery + '');
  const [PTDuration, setPTDuration] = useState({
    value: categories[1].duration,
    label: categories[1].duration,
  });

  // addons
  const [PTWordCount, setPTWordCount] = useState(categories[1].wordcount);
  const [PTRevision, setPTRevision] = useState(categories[1].revision);
  const [PTProofReading, setPTProofReading] = useState(
    categories[1].proofreading,
  );
  const [PTLangStyle, setPTLangStyle] = useState(categories[1].styling);
  const [PTDocFormatting, setPTDocFormatting] = useState(
    categories[1].formatting,
  );
  const [PTSubtitling, setPTSubtitling] = useState(categories[1].subtitling);

  // pacjage 3
  const [PTHName, setPTHName] = useState(categories[2].name);
  const [PTHDescription, setPTHDescription] = useState(
    categories[2].description,
  );
  const [PTHPPrice, setPTHPPrice] = useState(categories[2].PPPrice + '');
  const [PTHVPrice, setPTHVPrice] = useState(categories[2].PVPrice + '');
  const [PTHAPrice, setPTHAPrice] = useState(categories[2].PAPrice + '');
  const [PTHWPrice, setPTHWPrice] = useState(null);
  const [PTHDelivery, setPTHDelivery] = useState(categories[2].delivery + '');
  const [PTHDuration, setPTHDuration] = useState({
    value: categories[2].duration,
    label: categories[2].duration,
  });

  // addons
  const [PTHWordCount, setPTHWordCount] = useState(categories[2].wordcount);
  const [PTHRevision, setPTHRevision] = useState(categories[2].revision);
  const [PTHProofReading, setPTHProofReading] = useState(
    categories[2].proofreading,
  );
  const [PTHLangStyle, setPTHLangStyle] = useState(categories[2].styling);
  const [PTHDocFormatting, setPTHDocFormatting] = useState(
    categories[2].formatting,
  );
  const [PTHSubtitling, setPTHSubtitling] = useState(categories[2].subtitling);

  // page two add ons

  // page three variables
  const [description, setDescription] = useState(item.description);
  const [FAQ, setFAQ] = useState(item.faq);

  // page four variables

  const [image, setImage] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [imageThree, setImageThree] = useState(null);

  // console.log(categories[0].PID);

  const nextPage = pageNumber => {
    setPage(pageNumber);
    if (pageNumber === 'done') saveGiG();
  };

  const previousPage = pageNumber => {
    if (pageNumber === 'cancel') {
      navigation.goBack();
    } else setPage(pageNumber);
  };

  const saveGiG = async () => {
    var imgOne = item.imgOne,
      imgTwo = item.imgTwo,
      imgThree = item.imgThree;
    try {
      setLoading(true);

      if (image !== null) {
        imgOne = await uploadFIle(image);
        if (imgOne === null) {
          setError('Unable to create gig please try again');
          return;
        }
      }

      if (imageTwo !== null) {
        imgTwo = await uploadFIle(imageTwo);
        if (imgTwo === null) {
          setError('Unable to create gig please try again');
          return;
        }
      }
      if (imageThree !== null) {
        imgThree = await uploadFIle(imageThree);
        if (imgThree === null) {
          setError('Unable to create gig please try again');
          return;
        }
      }
      var gigObject = {
        ID: item.ID,
        title,
        languageID: language.value,
        languageName: language.label,
        toLanguageID: toLanguage.value,
        toLanguageName: toLanguage.label,
        service: service.label,
        serviceId: service.value,
        checkPhone: checkPhone ? 1 : 0,
        checkVideo: checkVideo ? 1 : 0,
        checkAttendance: checkAttendance ? 1 : 0,
        checkWritten: checkWritten ? 1 : 0,
        description,
        FAQ,
        userId: user.profile.Id,
        status: 'complete',
        imgOne, //   'https://sprogteamdev.blob.core.windows.net/writtentask/13911256123623894-IMG_0012.PNG',
        imgTwo, //'https://sprogteamdev.blob.core.windows.net/writtentask/5640021632748022-IMG_0007.JPG',
        imgThree, // 'https://sprogteamdev.blob.core.windows.net/writtentask/8559480201831946-IMG_0008.PNG',
      };
      // add the gig and wait for the gig id
      const gigRes = await editGiG(gigObject);

      if (gigRes === null) {
        setError('Unable to edit, please try again');
        setPage('four');
        return;
      }

      // console.log(gigRes);

      // return;

      setLoadingText('We are still with you');

      // if we have gig id let add the gig package
      // add package One
      var gigPackage = {
        PID: categories[0].PID,
        name: POName,
        description: PODescription,

        PPPrice: parseInt(POPPrice),
        PVPrice: parseInt(POVPrice),
        PAPrice: parseInt(POAPrice),
        PWPrice: parseInt(POWPrice),

        delivery: parseInt(PODelivery),
        duration: PODuration.value,
        type: 'basic',
        wordcount: POWordCount,
        revision: PORevision,
        proofreading: POProofReading ? 1 : 0,
        formatting: PODocFormatting ? 1 : 0,
        styling: POLangStyle ? 1 : 0,
        subtitling: POSubtitling ? 1 : 0,
      };

      var packageRes = await editPackage(gigPackage);

      if (packageRes !== 'success') {
        setError('Unable to complete the process please try again');
        return;
      }
      setLoadingText('Almost Done');
      // add package 2
      var gigPackage = {
        PID: categories[1].PID,

        name: PTName,
        description: PTDescription,

        PPPrice: parseInt(PTPPrice),
        PVPrice: parseInt(PTVPrice),
        PAPrice: parseInt(PTAPrice),
        PWPrice: parseInt(PTWPrice),

        delivery: parseInt(PTDelivery),
        duration: PTDuration.value,
        type: 'standard',
        wordcount: PTWordCount,
        revision: PTRevision,
        proofreading: PTProofReading ? 1 : 0,
        formatting: PTDocFormatting ? 1 : 0,
        styling: PTLangStyle ? 1 : 0,
        subtitling: PTSubtitling ? 1 : 0,
      };
      packageRes = await editPackage(gigPackage);
      if (packageRes !== 'success') {
        setError('Unable to complete the process please try again');
        return;
      }

      // add package 3
      var gigPackage = {
        PID: categories[2].PID,
        name: PTHName,
        description: PTHDescription,

        PPPrice: parseInt(PTHPPrice),
        PVPrice: parseInt(PTHVPrice),
        PAPrice: parseInt(PTHAPrice),
        PWPrice: parseInt(PTHWPrice),

        delivery: parseInt(PTHDelivery),
        duration: PTHDuration.value,
        type: 'premium',
        wordcount: PTHWordCount,
        revision: PTHRevision,
        proofreading: PTHProofReading ? 1 : 0,
        formatting: PTHDocFormatting ? 1 : 0,
        styling: PTHLangStyle ? 1 : 0,
        subtitling: PTHSubtitling ? 1 : 0,
      };

      packageRes = await editPackage(gigPackage);
      if (packageRes !== 'success') {
        setError('Unable to complete the process please try again');
        return;
      }
      setLoadingText('Yes!!! You made it, Your gig is ready');
      setLoading(false);
      setReloadGigs(true);
      // setPage('four');
    } catch (error) {
      console.log(error);
      setPage('four');
      setLoading(false);
    }
    // console.log(gigObject);
  };

  return (
    <KeyboardAwareScrollView style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ProfileHeader name={t('common:edit') + ' ' + t('common:gig')} />

        {error !== null && <ErrorMsg error={error} />}

        <View style={{flex: 1, margin: 10}}>
          {page === 'one' && (
            <PageOne
              nextPage={nextPage}
              previousPage={previousPage}
              setTitle={setTitle}
              title={title}
              language={language}
              setLanguage={setLanguage}
              toLanguage={toLanguage}
              setToLanguage={setToLanguage}
              setError={setError}
              checkPhone={checkPhone}
              setCheckPhone={setCheckPhone}
              checkVideo={checkVideo}
              setCheckedVideo={setCheckedVideo}
              checkAttendance={checkAttendance}
              setCheckedAttendance={setCheckedAttendance}
              checkWritten={checkWritten}
              setCheckWritten={setCheckWritten}
              service={service}
              setService={setService}
            />
          )}
          {page === 'two' && (
            <PageTwo
              nextPage={nextPage}
              previousPage={previousPage}
              checkPhone={checkPhone}
              checkVideo={checkVideo}
              checkAttendance={checkAttendance}
              checkWritten={checkWritten}
              setError={setError}
              POName={POName}
              setPOName={setPOName}
              PODescription={PODescription}
              setPODescription={setPODescription}
              // start of price
              POPPrice={POPPrice}
              setPOPPrice={setPOPPrice}
              POVPrice={POVPrice}
              setPOVPrice={setPOVPrice}
              POAPrice={POAPrice}
              setPOAPrice={setPOAPrice}
              POWPrice={POWPrice}
              setPOWPrice={setPOWPrice}
              // end of package one price
              PODelivery={PODelivery}
              setPODelivery={setPODelivery}
              PODuration={PODuration}
              setPODuration={setPODuration}
              // add ons
              POWordCount={POWordCount}
              setPOWordCount={setPOWordCount}
              PORevision={PORevision}
              setPORevision={setPORevision}
              POProofReading={POProofReading}
              setPOProofReading={setPOProofReading}
              POLangStyle={POLangStyle}
              setPOLangStyle={setPOLangStyle}
              PODocFormatting={PODocFormatting}
              setPODocFormatting={setPODocFormatting}
              POSubtitling={POSubtitling}
              setPOSubtitling={setPOSubtitling}
              // endPO
              PTName={PTName}
              setPTName={setPTName}
              PTDescription={PTDescription}
              setPTDescription={setPTDescription}
              // start of price
              PTPPrice={PTPPrice}
              setPTPPrice={setPTPPrice}
              PTVPrice={PTVPrice}
              setPTVPrice={setPTVPrice}
              PTAPrice={PTAPrice}
              setPTAPrice={setPTAPrice}
              PTWPrice={PTWPrice}
              setPTWPrice={setPTWPrice}
              // end of package tow price

              PTDelivery={PTDelivery}
              setPTDelivery={setPTDelivery}
              PTDuration={PTDuration}
              setPTDuration={setPTDuration}
              // PT add ons

              PTWordCount={PTWordCount}
              setPTWordCount={setPTWordCount}
              PTRevision={PTRevision}
              setPTRevision={setPTRevision}
              PTProofReading={PTProofReading}
              setPTProofReading={setPTProofReading}
              PTLangStyle={PTLangStyle}
              setPTLangStyle={setPTLangStyle}
              PTDocFormatting={PTDocFormatting}
              setPTDocFormatting={setPTDocFormatting}
              PTSubtitling={PTSubtitling}
              setPTSubtitling={setPTSubtitling}
              // endPT
              PTHName={PTHName}
              setPTHName={setPTHName}
              PTHDescription={PTHDescription}
              setPTHDescription={setPTHDescription}
              // start of price
              PTHPPrice={PTHPPrice}
              setPTHPPrice={setPTHPPrice}
              PTHVPrice={PTHVPrice}
              setPTHVPrice={setPTHVPrice}
              PTHAPrice={PTHAPrice}
              setPTHAPrice={setPTHAPrice}
              PTHWPrice={PTHWPrice}
              setPTHWPrice={setPTHWPrice}
              // end of package three price

              PTHDelivery={PTHDelivery}
              setPTHDelivery={setPTHDelivery}
              PTHDuration={PTHDuration}
              setPTHDuration={setPTHDuration}
              // add ons
              PTHWordCount={PTHWordCount}
              setPTHWordCount={setPTHWordCount}
              PTHRevision={PTHRevision}
              setPTHRevision={setPTHRevision}
              PTHProofReading={PTHProofReading}
              setPTHProofReading={setPTHProofReading}
              PTHLangStyle={PTHLangStyle}
              setPTHLangStyle={setPTHLangStyle}
              PTHDocFormatting={PTHDocFormatting}
              setPTHDocFormatting={setPTHDocFormatting}
              PTHSubtitling={PTHSubtitling}
              setPTHSubtitling={setPTHSubtitling}
              // end of PTH
              durations={durations}
              // written add ons
              service={service}
            />
          )}

          {page === 'three' && (
            <PageThree
              nextPage={nextPage}
              previousPage={previousPage}
              setError={setError}
              description={description}
              setDescription={setDescription}
              FAQ={FAQ}
              setFAQ={setFAQ}
            />
          )}

          {page === 'four' && (
            <PageFour
              nextPage={nextPage}
              previousPage={previousPage}
              setError={setError}
              image={image}
              setImage={setImage}
              imageTwo={imageTwo}
              setImageTwo={setImageTwo}
              imageThree={imageThree}
              setImageThree={setImageThree}
              item={item}
            />
          )}

          {page === 'done' && (
            <View
              style={{
                alignItems: 'center',
                justifyContent: 'center',
                flex: 1,
                marginTop: 60,
              }}>
              <ActivityIndicator
                show={loading}
                size="large"
                color={colors.main}
              />
              <Text
                style={{
                  margin: 5,
                  color: colors.black,
                  fontFamily: fonts.bold,
                  fontSize: 16,
                }}>
                {loadingText}
              </Text>
              {loadingText === 'Yes!!! You made it, Your gig is ready' && (
                <View>
                  <Image
                    style={{
                      width: 200,
                      height: 200,
                      margin: 20,
                      borderRadius: 100,
                    }}
                    source={require('../../assets/imgs/success.png')}
                  />
                  <Button
                    onPress={() => {
                      navigation.navigate('Home', {screen: 'Gigs'});
                    }}
                    buttonTitle={'Gig List'}
                  />
                </View>
              )}
            </View>
          )}
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
};

export default EditGigScreen;
