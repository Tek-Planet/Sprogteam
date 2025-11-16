import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView, Text, Image} from 'react-native';
import {fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  DatePicker,
  Header,
  OtherGigsModal,
  SuccessModal,
} from '../../components';
import {
  useCreateQuoteMutation,
  useGetGigsByUserIdQuery,
  useGetUserDetailsQuery,
} from '../../rtk/services';
import {SelectOptionType} from '../../types';
import {
  errorText,
  getCurrencies,
  getCurrentDate,
  uploadFile,
} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppSelector} from '../../rtk/hooks';
import FilePickerModal from '../../components/FilePickerModal';
import {GigStackParams} from '../../navigations/GigNavigation';
import moment from 'moment';
import {logo} from '../../assets/images';

type Props = NativeStackScreenProps<GigStackParams, 'CreateOffer'>;

const CreateOfferScreen = ({route}: Props) => {
  const {user, gigState} = useAppSelector(state => state.user);

  const profileItem = route?.params?.item ? route?.params.item : null;

  const itemType = route?.params?.itemType;

  const [item, setItem] = useState<any>(gigState !== undefined ? gigState : {});

  const userId: any =
    profileItem !== null
      ? itemType === 'user'
        ? profileItem.Id
        : profileItem?.userId
      : item.userId
      ? item.userId
      : item.Id;
  const serviceId: any = '';

  const {data, error, isLoading} = useGetGigsByUserIdQuery(
    {userId, serviceId},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {data: useDetails} = useGetUserDetailsQuery(userId, {
    refetchOnMountOrArgChange: true,
  });

  const navigation: any = useNavigation();

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [createQuote, {isLoading: isSaving}] = useCreateQuoteMutation();

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [deadlineTime, setDeadlineTime] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [imageModalVisible, setImageModalVisible] = useState<boolean>(false);
  const [selectedFile, setselectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const {
    serviceId: ServiceId,
    ActualCost,
    CurrencyId,
    toLanguageID,
    languageID,
    toLanguageName,
    languageName,
    SubServiceId,
  } = item;

  const [price, setPrice] = useState<any>('');

  // we need to find a way to set a default gig since we arent getting gig data
  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];

  const [erroMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    if (ActualCost !== undefined) setPrice(ActualCost + '');
  }, [ActualCost]);

  const resetAllField = () => {
    setModalVisible(false);
    navigation.replace('QuoteAwaitingApproval');
  };

  const onFileSelected = async (imageFile: any) => {
    setImageModalVisible(false);
    setselectedFile(imageFile);
  };

  const onSubmit = async () => {
    if (!deadlineDate || deadlineDate === 'error') {
      setDeadlineDate(errorText);
      return;
    }

    if (!deadlineTime || deadlineTime === 'error') {
      setDeadlineTime(errorText);
      return;
    }

    let quoteBody: any = {
      AcceptAmount: 0,
      ClientId: user.Id,
      CreateBy: user.Id,
      CreateDate: getCurrentDate().toDate(),
      createdAt: moment(getCurrentDate().toDate()).format('DD.MM.YYYY'),
      deadlineAt: moment(deadlineDate).format('DD.MM.YYYY'),
      CurrencyId: currency.value,
      currency: currency.label,
      CustomerAmount: 0,
      CustomerServiceChargeAmount: 0,
      CustomerServiceChargePer: 0,
      DeadlineDate: deadlineDate,
      DeadlineTime: deadlineTime,
      Descriptions: body,
      EstimatedBudget: price,
      FromLanguageId: languageID,
      GID: item.ID,
      IsActive: true,
      IsPaymentPaid: false,
      QuoteStatusId: 1,
      ServiceId,
      SubServiceId,
      Title: title,
      ToLanguageId: toLanguageID,
      fromLanguageName: languageName,
      toLanguageName: toLanguageName,
      TotalAmount: 0,
      TranslatorAmount: 0,
      TranslatorId: item.userId,
      TranslatorServiceChargeAmount: 0,
      TranslatorServiceChargePer: 0,
      UpdateDate: '0001-01-01T00:00:00.000Z',
      IsAnonymous: false,
      name: useDetails?.FirstName + ' ' + useDetails?.LastName,
      recipient: useDetails?.Email,
    };

    if (selectedFile !== null) {
      setUploading(true);
      let fileUrl = await uploadFile(selectedFile);
      if (fileUrl === null) {
        setErrorMessage('Unable to submit this quote ');
        setUploading(false);
        return;
      }

      quoteBody.QuoteFile = fileUrl;
    }

    // console.log(quoteBody);

    var response: any;

    response = await createQuote(quoteBody);

    if (response?.data) {
      setMessage(t('common:quote') + ' ' + t('common:created'));
      setModalVisible(true);
    } else {
      console.log(response.error);
      setErrorMessage('Error saving quote');
    }
  };

  useEffect(() => {
    if (data) {
      if (itemType === 'user' || itemType === undefined) setItem(data[0]);
      else if (itemType === 'gig') setItem(profileItem);
    }
  }, [data]);

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={t('common:create') + ' ' + t('quote')}
        showleftIcon
        showRightIcon
      />
      {(isLoading || isSaving || uploading) && <CustomLoader />}

      <View style={{flex: 1, padding: spacing.ten}}>
        {data && (
          <ScrollView>
            <View
              style={{flexDirection: 'row', marginVertical: spacing.fiften}}>
              <Image
                resizeMode="contain"
                style={{height: 100, width: 100}}
                source={item?.imgOne ? {uri: item?.imgOne} : logo}
              />
              <View style={{flex: 1, marginStart: spacing.ten}}>
                {
                  <OtherGigsModal
                    setValue={val => {
                      setItem(val);
                    }}
                    value={item}
                    label={t('common:change') + ' ' + t('common:gig')}
                    data={data}
                  />
                }
              </View>
            </View>
            <KeyboardAwareScrollView>
              <View style={{}}>
                <CustomInput
                  placeholder={t('common:price')}
                  onTextChange={setPrice}
                  value={price}
                  label={t('common:estimated') + ' ' + t('common:budget')}
                />
              </View>
              <DatePicker
                date={deadlineDate}
                setDate={setDeadlineDate}
                title={t('common:date')}
                label={t('common:deadline') + ' ' + t('common:date')}
              />

              <DatePicker
                date={deadlineTime}
                setDate={setDeadlineTime}
                title={t('common:deadline') + ' ' + t('common:time')}
                label={t('common:deadline') + ' ' + t('common:time')}
                mode="time"
              />

              <CustomInput
                placeholder={t('common:title')}
                onTextChange={setTitle}
                value={title}
                label={t('common:title')}
              />

              <CustomInput
                height={100}
                value={body}
                onTextChange={setBody}
                placeholder={t('common:comment')}
                label={t('common:task') + ' ' + t('common:details')}
              />

              <FilePickerModal
                choosenFile={selectedFile}
                onFileSelected={onFileSelected}
              />

              {(error || erroMessage !== '') && (
                <CustomError message={erroMessage} />
              )}

              <CustomButton
                buttonTitle={t('common:send')}
                onTap={() => onSubmit()}
              />
            </KeyboardAwareScrollView>
          </ScrollView>
        )}

        {modalVisible && (
          <SuccessModal
            modalVisible={modalVisible}
            setModalVisible={setModalVisible}
            message={message}
            closeModal={() => resetAllField()}
          />
        )}
      </View>
    </View>
  );
};

export default CreateOfferScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },

    title: {
      color: colors.black,
      fontSize: 16,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
      paddingHorizontal: spacing.five,
    },
  });
