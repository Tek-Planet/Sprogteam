import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {fontSize, fonts} from '../../assets/fonts';

import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {spacing} from '../../assets/spacing';
import {CustomLoader, HandBookItem, Header} from '../../components';

import {useTranslation} from 'react-i18next';

import {useGetHandbookQuery} from '../../rtk/services';

const AcceptableBehaviourScreen = () => {
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();

  const column: any = 'BehaviorPolice'; // PrivatePolice BehaviorPolice
  const {data, isLoading} = useGetHandbookQuery(column, {
    refetchOnMountOrArgChange: true,
  });

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={t('common:acceptable') + ' ' + t('common:behaviour')}
        showleftIcon
        showRightIcon
      />
      {isLoading && <CustomLoader color={colors.main} />}
      <View style={{padding: spacing.ten}}>
        <ScrollView>
          {data?.map((item, index) => {
            return <HandBookItem key={index.toString()} item={item} />;
          })}
        </ScrollView>
      </View>
    </View>
  );
};

export default AcceptableBehaviourScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      paddingTop: 1,
      backgroundColor: colors.white,
      justifyContent: 'space-between',
    },
    button: {
      backgroundColor: '#fff',
      padding: 10,
      borderColor: '#2260A6',
      borderWidth: 2,
      borderRadius: 30,
      width: '100%',
      height: spacing.fiften * 4.3,
      marginBottom: 10,
    },
    buttonText: {
      color: '#2260A6',
      justifyContent: 'center',
      alignSelf: 'center',
      padding: 5,
      fontSize: fontSize.medium,
    },
    Text: {
      color: colors.black,
      marginLeft: spacing.ten,
      fontSize: 18,
      fontFamily: fonts.bold,
      alignSelf: 'center',
    },
  });
