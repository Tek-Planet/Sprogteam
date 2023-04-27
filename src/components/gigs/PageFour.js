import React, {useState} from 'react';
import {Image, TouchableOpacity, View} from 'react-native';
import {TextBoxTitle, Button, CustomFileChooser} from '..';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';

const PageFour = props => {
  const {
    nextPage,
    previousPage,
    image,
    setImage,
    imageTwo,
    setImageTwo,
    imageThree,
    setImageThree,
    item,
  } = props;
  const {t} = useTranslation();

  const [showImageOption, setShowImageOption] = useState(false);

  const [selector, setSelector] = useState(null);

  const processImage = uploadedImage => {
    if (selector === null) return null;
    if (selector === 1) setImage(uploadedImage);
    else if (selector === 2) setImageTwo(uploadedImage);
    else setImageThree(uploadedImage);
  };

  const next = () => {
    // if (image === null || imageTwo === null || imageThree === null) {
    //   setError('Upload three image of your gig');
    //   return;
    // }
    // setError(null);
    //  create gig object
    nextPage('done');
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      {showImageOption && (
        <CustomFileChooser
          processImage={processImage}
          showImageOption={showImageOption}
          setShowImageOption={setShowImageOption}
        />
      )}
      <ScrollView>
        <View style={{flex: 1}}>
          <TextBoxTitle title={t('common:gallery')} showAsh />
          <TextBoxTitle title={t('common:upload')} showAsh />
          <TouchableOpacity
            onPress={() => {
              setSelector(1);
              setShowImageOption(!showImageOption);
            }}>
            <Image
              style={{
                width: '100%',
                height: 300,
                margin: 10,
                alignSelf: 'center',
              }}
              source={
                image !== null
                  ? {uri: image.pathUrl}
                  : item
                  ? {uri: item.imgOne}
                  : require('../../assets/imgs/empty.png')
              }
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setSelector(2);
              setShowImageOption(!showImageOption);
            }}>
            <Image
              style={{
                width: '100%',
                height: 300,
                margin: 10,
                alignSelf: 'center',
              }}
              source={
                imageTwo !== null
                  ? {uri: imageTwo.pathUrl}
                  : item
                  ? {uri: item.imgTwo}
                  : require('../../assets/imgs/empty.png')
              }
            />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              setSelector(3);
              setShowImageOption(!showImageOption);
            }}>
            <Image
              style={{
                width: '100%',
                height: 300,
                margin: 10,
                alignSelf: 'center',
              }}
              source={
                imageThree !== null
                  ? {uri: imageThree.pathUrl}
                  : item
                  ? {uri: item.imgThree}
                  : require('../../assets/imgs/empty.png')
              }
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Button
          buttonTitle={t('common:previous')}
          bGcolor={'#800000'}
          onPress={() => {
            previousPage('three');
          }}
        />
        <Button
          buttonTitle={t('common:save')}
          onPress={() => {
            next();
          }}
        />
      </View>
    </View>
  );
};
export default PageFour;
