import React, {useState} from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  ImageBackground,
} from 'react-native';
import {colorTypes} from '../../assets/colors';
import {fontSize, fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';

import {CustomLoader, Header, SuccessModal} from '../../components';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {getCurrencies} from '../../utils';
import {GigStackParams} from '../../navigations/GigNavigation';
import {SelectOptionType} from '../../types';
import {useDeleteGigMutation} from '../../rtk/services';
import Feather from 'react-native-vector-icons/Feather';
import {logo} from '../../assets/images';
import {useAppSelector} from '../../rtk/hooks';

type Props = NativeStackScreenProps<GigStackParams, 'GigManager'>;

const GigManagerScreen = ({navigation, route}: Props) => {
  const [item, setItem] = useState(route?.params?.item);
  const {defaultLanguage} = useAppSelector(state => state.user);

  const {
    ID,
    description,
    title,
    imgOne,
    faq,
    serviceId,
    ActualCost,
    CurrencyId,
  } = item;

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [deleteGig, {isLoading: isDeleting}] = useDeleteGigMutation();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];

  const onDelete = async () => {
    let response: any = await deleteGig(ID);
    if (response?.data) {
      setMessage(t('common:gig') + ' ' + t('common:deleted'));
      setModalVisible(true);
    }
  };

  // console.log(item?.FromLanguage);

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        showleftIcon
        headerTitle={t('common:gig') + ' ' + t('common:details')}
      />
      {isDeleting && <CustomLoader />}
      <View style={{padding: spacing.ten, flex: 1}}>
        <ScrollView>
          <View>
            <Text
              style={{
                ...styles.title,
                marginBottom: spacing.ten,
                fontSize: fontSize.light,
                fontFamily: fonts.bold,
              }}>
              {title}
            </Text>

            <View style={{height: 300}}>
              <ImageBackground
                resizeMode="stretch"
                style={{
                  height: 250,
                }}
                source={
                  imgOne
                    ? {
                        uri: imgOne,
                      }
                    : logo
                }
              />
            </View>

            <View style={styles.seperator} />
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...styles.title}}>{t('common:service')}: </Text>

              <Text style={{...styles.text}}>
                {defaultLanguage?.code === 'dk'
                  ? item?.Service?.ServiceNameDK || item?.Service?.ServiceName
                  : item?.Service?.ServiceNameDK}
              </Text>
            </View>
            {item?.SubService && (
              <View>
                <View style={styles.seperator} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:category')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {defaultLanguage?.code === 'dk'
                      ? item?.SubService?.SubServiceNameDK ||
                        item?.SubService?.SubServiceName
                      : item?.SubService?.SubServiceName}
                  </Text>
                </View>
              </View>
            )}

            {item?.Service?.LanguageRequire && (
              <View>
                <View style={styles.seperator} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:from') + ' ' + t('common:language')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {item?.FromLanguage?.LanguagesName}
                  </Text>
                </View>
                <View style={styles.seperator} />
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={{...styles.title}}>
                    {t('common:to') + ' ' + t('common:language')}:{' '}
                  </Text>

                  <Text style={{...styles.text}}>
                    {item?.ToLanguage?.LanguagesName}
                  </Text>
                </View>
              </View>
            )}
            <View style={styles.seperator} />
            <Text style={{...styles.title}}>{t('common:about')}</Text>

            <Text style={{...styles.text, textAlign: 'justify'}}>
              {description}
            </Text>
            <View style={styles.seperator} />

            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Text style={{...styles.title}}>{t('common:price')}: </Text>

              <Text style={{...styles.title, fontSize: fontSize.intermediate}}>
                {currency.label + ' '}
                {ActualCost}
              </Text>
            </View>
            <View style={styles.seperator} />

            <Text style={{...styles.title}}>{t('common:FAQ')}</Text>

            <Text style={{...styles.text, textAlign: 'justify'}}>{faq}</Text>
          </View>
        </ScrollView>

        {modalVisible && (
          <SuccessModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            message={message}
            closeModal={() => navigation.goBack()}
          />
        )}
      </View>

      <View
        style={{
          flexDirection: 'row',
          right: 15,
          position: 'absolute',
        }}>
        <Feather
          onPress={() => {
            navigation.navigate('CreateGig', {item});
          }}
          name="edit"
          size={25}
          color={colors.main}
          style={{marginEnd: spacing.twenty}}
        />

        <Feather
          onPress={() => {
            onDelete();
          }}
          name="trash"
          size={25}
          color={colors.red}
        />
      </View>
    </View>
  );
};

export default GigManagerScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    text: {
      color: colors.black,
      fontFamily: fonts.medium,
      opacity: 0.6,
    },
    title: {
      color: colors.black,
      fontFamily: fonts.medium,
    },
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
    seperator: {
      marginVertical: spacing.five,
    },
  });
