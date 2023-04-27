import React, {useContext, useEffect, useState} from 'react';
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native';
import {
  ActivityIndicator,
  Button,
  CustomDropDown,
  CustomFileChooser,
  CustomInput,
  ErrorMsg,
  ProfileHeader,
} from '../../components';
import {AuthContext} from '../../context/AuthProvider';
import {fonts} from '../../assets/fonts';
import {useTranslation} from 'react-i18next';
import {uploadFIle} from '../../util/util';
import {addDocToDb} from '../../data/data';

const NewKycScreen = ({navigation, route}) => {
  const {t} = useTranslation();

  const {user, docs, setDocs} = useContext(AuthContext);
  const [image, setImage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [docID, setDocID] = useState(null);
  const [ID, setID] = useState(null);
  const [location, setLocation] = useState(null);

  // console.log(user.profile.Id);

  const [showImageOption, setShowImageOption] = useState(false);

  const options = [
    {
      label: t('common:international') + ' ' + t('common:passport'),
      value: 1,
    },
    {
      label:
        t('common:national') +
        ' ' +
        t('common:identity') +
        ' ' +
        t('common:card'),
      value: 2,
    },
    {
      label: t('common:driver') + ' ' + t('common:license'),
      value: 3,
    },
    {
      label: t('common:certificate'),
      value: 4,
    },
  ];

  const [value, setValue] = useState({
    label: t('common:select'),
    value: 0,
  });

  const processImage = uploadedImage => {
    setImage(uploadedImage);
  };

  const addDoc = async () => {
    if (value.label === 'Select') {
      setError('Choose the type of document');
      return;
    }
    if (image === null) {
      setError('upload image of your document');
      return;
    }
    try {
      setError(null);
      setLoading(true);
      var imgUrl = await uploadFIle(image);
      if (imgUrl === null) {
        setError('unable to submit your document, Please try agains');
        return;
      }

      const body = {
        DID: docs.length,
        status: 'pending',
        docType: value.label,
        documentID: docID,
        url: imgUrl,
        userId: ID !== null ? ID : user?.profile?.Id,
      };

      var tempDocs = [];
      tempDocs = docs;
      tempDocs.push(body);

      // setDocs(tempDocs);

      const res = await addDocToDb(body);
      // console.log(res);
      if (ID !== null) {
        console.log('Going to AddServices');

        navigation.replace('AddServices', {
          email: ID,
        });
      } else {
        if (location !== null) {
          navigation.navigate({
            name: 'AddLanguage',
            params: {url: imgUrl},
            merge: true,
          });
        } else
          navigation.navigate({
            name: 'KYC',
            params: {doc: tempDocs},
            merge: true,
          });
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      console.log('');
    }
  };

  useEffect(() => {
    if (route.params?.email) {
      setID(route.params?.email);
    }
    if (route.params?.location) {
      setLocation(route.params?.location);
    }
  }, [route.params?.email, route.params?.email]);

  return (
    <View style={styles.container}>
      {/* <Header navigation={navigation} /> */}
      <View>
        <ProfileHeader name={t('common:document') + ' ' + t('common:upload')} />

        <View style={{padding: 10}}>
          {ID !== null && (
            <Text
              style={[
                styles.text,
                {fontFamily: fonts.bold, marginVertical: 15},
              ]}>
              {t('common:new_id')}
            </Text>
          )}

          <Text style={styles.text}>
            {t('common:document') + ' ' + t('common:type')}
          </Text>

          <CustomDropDown
            title={t('common:select') + ' ' + t('common:option')}
            value={value}
            language={options}
            setValue={setValue}
          />

          <Text style={[styles.text, {marginTop: 10}]}>DOC ID</Text>
          <View style={{marginHorizontal: 10}}>
            <CustomInput
              // name="document-outline"
              onChangeText={val => setDocID(val)}
            />
          </View>
        </View>
        <Text style={[styles.text, {marginBottom: 10}]}>
          {t('common:clear_document')}
        </Text>

        <TouchableOpacity
          onPress={() => {
            setShowImageOption(!showImageOption);
          }}>
          <Image
            style={{
              width: 200,
              height: 200,
              margin: 10,
              alignSelf: 'center',
            }}
            source={
              image !== null
                ? {uri: image.pathUrl}
                : require('../../assets/imgs/empty.png')
            }
          />
        </TouchableOpacity>
      </View>

      {showImageOption && (
        <CustomFileChooser
          processImage={processImage}
          showImageOption={showImageOption}
          setShowImageOption={setShowImageOption}
        />
      )}

      {error !== null && <ErrorMsg error={error} />}
      <View style={{}}>
        {loading ? (
          <ActivityIndicator color={'#659ED6'} show={loading} size={'large'} />
        ) : (
          // <Text>Loading</Text>
          <Button
            onPress={() => addDoc()}
            bGcolor={'#659ED6'}
            buttonTitle={t('common:submit')}
          />
        )}
      </View>
    </View>
  );
};

export default NewKycScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'space-between',
  },
  text: {
    fontFamily: fonts.medium,
    marginStart: 10,
  },
});
