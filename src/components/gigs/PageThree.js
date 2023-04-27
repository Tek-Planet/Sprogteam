import React from 'react';
import {TextInput, View} from 'react-native';
import {TextBoxTitle, Button} from '..';
import {useTranslation} from 'react-i18next';
import {ScrollView} from 'react-native-gesture-handler';
import {colors} from '../../assets/colors';
import {dimention} from '../../util/util';

const PageThree = props => {
  const {
    nextPage,
    previousPage,
    description,
    setDescription,
    setError,
    FAQ,
    setFAQ,
  } = props;
  const {t} = useTranslation();

  const next = () => {
    if (description === null) {
      setError('Write in details about your gig');
      return;
    }
    setError(null);
    nextPage('four');
  };

  return (
    <View style={{flex: 1, justifyContent: 'space-between'}}>
      <ScrollView>
        <View style={{flex: 1}}>
          <TextBoxTitle
            title={t('common:gig') + ' ' + t('common:description')}
            showAsh
          />

          <TextInput
            style={{
              textAlignVertical: 'top',
              fontSize: 16,
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderColor: colors.main,
              borderRadius: 10,
              height: dimention.height * 0.3,
              lineHeight: 25,
            }}
            value={description}
            onChangeText={val => setDescription(val)}
            multiline={true}
            numberOfLines={10}
            placeholderTextColor="#fafafa"
          />
          <TextBoxTitle
            title={
              t('common:frequently') +
              ' ' +
              t('common:asked') +
              ' ' +
              t('common:questions') +
              ' (FAQ)'
            }
            showAsh
          />
          <TextInput
            style={{
              textAlignVertical: 'top',
              fontSize: 16,
              padding: 5,
              margin: 5,
              borderWidth: 1,
              borderColor: colors.main,
              borderRadius: 10,
              height: dimention.height * 0.25,
              lineHeight: 25,
            }}
            value={FAQ}
            onChangeText={val => setFAQ(val)}
            multiline={true}
            numberOfLines={10}
            placeholderTextColor="#fafafa"
          />
        </View>
      </ScrollView>
      <View style={{justifyContent: 'space-between', flexDirection: 'row'}}>
        <Button
          buttonTitle={t('common:previous')}
          bGcolor={'#800000'}
          onPress={() => {
            previousPage('two');
          }}
        />
        <Button
          buttonTitle={t('common:next')}
          onPress={() => {
            next('four');
          }}
        />
      </View>
    </View>
  );
};
export default PageThree;
