import React, {useState, useContext} from 'react';
import {View, Image, Text} from 'react-native';
import {colors} from '../../assets/colors';
import {PageOne, PageTwo, PageThree, PageFour} from '../../components/gigs';
import {useTranslation} from 'react-i18next';
import ProfileHeader from '../../components/ProfileHeader';
import {ActivityIndicator, Button, ErrorMsg} from '../../components';
import {AuthContext} from '../../context/AuthProvider';

import {addGiG, addPackage} from '../../data/data';

import {fonts} from '../../assets/fonts';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {logoUrl, uploadFIle} from '../../util/util';

const CreateNewGigScreen = ({navigation}) => {
  const {t} = useTranslation();
  const {user, setReloadGigs} = useContext(AuthContext);

  //movin on let move bro
  const [page, setPage] = useState('one');
  const [title, setTitle] = useState(null);
  const initialState = {label: t('common:select'), value: 'Select'};
  const [language, setLanguage] = useState(initialState);
  const [toLanguage, setToLanguage] = useState(initialState);
  const [service, setService] = useState(initialState);
  const [checkPhone, setCheckPhone] = useState(false);
  const [checkVideo, setCheckedVideo] = useState(false);
  const [checkAttendance, setCheckedAttendance] = useState(false);
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

  const [POName, setPOName] = useState(null);
  const [PODescription, setPODescription] = useState(null);
  const [POPPrice, setPOPPrice] = useState(null);
  const [POVPrice, setPOVPrice] = useState(null);
  const [POAPrice, setPOAPrice] = useState(null);
  const [POWPrice, setPOWPrice] = useState(null);

  const [PODelivery, setPODelivery] = useState(null);
  const [PODuration, setPODuration] = useState(durations[0]);

  // addons
  const [POWordCount, setPOWordCount] = useState(null);
  const [PORevision, setPORevision] = useState(null);
  const [POProofReading, setPOProofReading] = useState(false);
  const [POLangStyle, setPOLangStyle] = useState(false);
  const [PODocFormatting, setPODocFormatting] = useState(false);
  const [POSubtitling, setPOSubtitling] = useState(false);

  const [PTName, setPTName] = useState(null);
  const [PTDescription, setPTDescription] = useState(null);
  const [PTPPrice, setPTPPrice] = useState(null);
  const [PTVPrice, setPTVPrice] = useState(null);
  const [PTAPrice, setPTAPrice] = useState(null);
  const [PTWPrice, setPTWPrice] = useState(null);
  const [PTDelivery, setPTDelivery] = useState(null);
  const [PTDuration, setPTDuration] = useState(durations[0]);

  // addons
  const [PTWordCount, setPTWordCount] = useState(null);
  const [PTRevision, setPTRevision] = useState(null);
  const [PTProofReading, setPTProofReading] = useState(false);
  const [PTLangStyle, setPTLangStyle] = useState(false);
  const [PTDocFormatting, setPTDocFormatting] = useState(false);
  const [PTSubtitling, setPTSubtitling] = useState(false);

  const [PTHName, setPTHName] = useState(null);
  const [PTHDescription, setPTHDescription] = useState(null);
  const [PTHPPrice, setPTHPPrice] = useState(null);
  const [PTHVPrice, setPTHVPrice] = useState(null);
  const [PTHAPrice, setPTHAPrice] = useState(null);
  const [PTHWPrice, setPTHWPrice] = useState(null);
  const [PTHDelivery, setPTHDelivery] = useState(null);
  const [PTHDuration, setPTHDuration] = useState(durations[0]);

  // addons
  const [PTHWordCount, setPTHWordCount] = useState(null);
  const [PTHRevision, setPTHRevision] = useState(null);
  const [PTHProofReading, setPTHProofReading] = useState(false);
  const [PTHLangStyle, setPTHLangStyle] = useState(false);
  const [PTHDocFormatting, setPTHDocFormatting] = useState(false);
  const [PTHSubtitling, setPTHSubtitling] = useState(false);

  // page two add ons

  // page three variables
  const [description, setDescription] = useState(null);
  const [FAQ, setFAQ] = useState(null);

  // page four variables

  const [image, setImage] = useState(null);
  const [imageTwo, setImageTwo] = useState(null);
  const [imageThree, setImageThree] = useState(null);

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
    var imgOne = logoUrl,
      imgTwo = logoUrl,
      imgThree = logoUrl;
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
      const gigRes = await addGiG(gigObject);

      if (gigRes === null) {
        setError('Unable to create your Gig, please try again');
        setPage('four');
        return;
      }

      setLoadingText('We are still with you');

      // if we have gig id let add the gig package
      // add package One
      var gigPackage = {
        GID: gigRes,
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

      var packageRes = await addPackage(gigPackage);
      if (packageRes !== 'success') {
        setError('Unable to complete the process please try again');
        return;
      }
      setLoadingText('Almost Done');
      // add package 2
      var gigPackage = {
        GID: gigRes,
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
      packageRes = await addPackage(gigPackage);
      if (packageRes !== 'success') {
        setError('Unable to complete the process please try again');
        return;
      }

      // add package 3
      var gigPackage = {
        GID: gigRes,
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
      packageRes = await addPackage(gigPackage);
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
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      style={{flex: 1, backgroundColor: colors.white}}>
      <View style={{flex: 1, backgroundColor: colors.white}}>
        <ProfileHeader name={t('common:create') + ' ' + t('common:gig')} />

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
                      navigation.goBack();
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

export default CreateNewGigScreen;
