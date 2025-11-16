import * as React from 'react';
import {Text, View, StyleSheet, Image} from 'react-native';
import {fonts} from '../assets/fonts';
import {useTranslation} from 'react-i18next';
import {empty} from '../assets/images';
import {spacing} from '../assets/spacing';

interface CustomEmptyListProps {
  message?: string | undefined;
}

const CustomEmptyList = (props: CustomEmptyListProps) => {
  const {message} = props;
  const {t} = useTranslation();
  return (
    <View
      style={{
        backgroundColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 2,
        marginTop: spacing.twenty,
      }}>
      <Text style={{fontFamily: fonts.light, color: 'black'}}>
        {message ? message : t('common:no') + ' ' + t('common:record')}
      </Text>

      <Image
        style={{width: 60, height: 60, marginTop: spacing.ten}}
        source={empty}
      />
    </View>
  );
};

export default CustomEmptyList;

const styles = StyleSheet.create({
  container: {},
});
