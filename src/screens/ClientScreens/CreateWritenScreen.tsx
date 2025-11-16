import React, {useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';

import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLanguageDropDown,
  CustomLoader,
  DatePicker,
  Header,
  SuccessModal,
} from '../../components';
import {
  useCreateGigMutation,
  useCreateWrittenBookingMutation,
  useGetLanguagesQuery,
} from '../../rtk/services';
import {SelectOptionType} from '../../types';
import {
  errorText,
  errorValue,
  getCurrentDate,
  initialLanguage,
  uploadFile,
} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppSelector} from '../../rtk/hooks';
import {colorTypes} from '../../assets/colors';
import {fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {GigStackParams} from '../../navigations/GigNavigation';
import FilePickerModal from '../../components/FilePickerModal';

type Props = NativeStackScreenProps<GigStackParams, 'CreateGig'>;

const CreateWritenScreen = () => {
  const navigation: any = useNavigation();
  const {user} = useAppSelector(state => state.user);

  console.log(user.CompanyName);
  const {data, error, isLoading} = useGetLanguagesQuery('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [createWrittenBooking, {isLoading: isSaving}] =
    useCreateWrittenBookingMutation();

  const [language, setLanguage] = useState<SelectOptionType>(initialLanguage);
  const [tolanguage, setToLanguage] =
    useState<SelectOptionType>(initialLanguage);

  const [caseNumber, setCaseNumber] = useState<string>('');

  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [selectedFile, setselectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined | 'error'>(
    undefined,
  );

  const [erroMessage, setErrorMessage] = useState<string>('');

  const [message, setMessage] = useState<string>('');

  const resetAllField = () => {
    setModalVisible(false);
    navigation.navigate('Tab', {screen: 'Written'});
  };

  const onSubmit = async () => {
    if (language.value === 'Select' || language.value === 'error') {
      setLanguage(errorValue);
      return;
    }

    if (tolanguage.value === 'Select' || tolanguage.value === 'error') {
      setToLanguage(errorValue);
      return;
    }

    if (!deadlineDate || deadlineDate === 'error') {
      setDeadlineDate(errorText);
      return;
    }

    // create the quote object
    let newBooking: any = {
      OrderNumber: caseNumber,
      CreateDate: getCurrentDate(),
      CreateByUser: user.Email,
      Deadline: deadlineDate,
      LanguageFrom: language.value,
      LanguageTo: tolanguage.value,
      InterpreterId: null,
      CompanyName: user.CompanyName,
      Salaryinterpreter: 0,
      PriceCustomer: 0,
      Files: '{"FilePaths":[]}',
      ResponseFiles: null,
      interpreterPay: false,
      CustomerPay: false,
      InvoiceNumber: 0,
      BellaStatus: false,
      Status: 3,
      CustomerId: null,
      Response: null,
      Anslag: null,
      HandInDatetime: null,
      InterpayDate: null,
      Remark: null,
    };

    if (selectedFile !== null) {
      setUploading(true);
      let fileUrl = await uploadFile(selectedFile);
      if (fileUrl === null) {
        setErrorMessage('Unable to submit this quote ');
        setUploading(false);
        return;
      }
      newBooking.Files = `{"FilePaths":[${fileUrl}]}`;
    }

    var response: any;

    response = await createWrittenBooking(newBooking);

    if (response?.data) {
      setMessage(t('common:booking') + ' ' + t('common:created'));
      setModalVisible(true);
    } else {
      console.log(response.error);
      setErrorMessage('Error saving quote');
    }
  };

  const onFileSelected = async (imageFile: any) => {
    setselectedFile(imageFile);
  };

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={
          t('common:order') + ' ' + t('written') + ' ' + t('interpreter')
        }
        showleftIcon
        showRightIcon
      />
      {(isLoading || isSaving || uploading) && <CustomLoader />}

      <View style={{flex: 1, padding: spacing.ten}}>
        <ScrollView>
          <KeyboardAwareScrollView>
            <CustomInput
              placeholder={t('common:case') + ' ' + t('common:number')}
              onTextChange={setCaseNumber}
              value={caseNumber}
              label={
                t('common:own') +
                ' ' +
                t('common:case') +
                ' ' +
                t('common:number')
              }
            />

            <CustomLanguageDropDown
              label={t('common:from') + ' ' + t('common:language')}
              value={language}
              options={data ? data : []}
              setValue={setLanguage}
              title={t('common:available') + ' ' + t('common:language')}
              showSearch
            />

            <CustomLanguageDropDown
              label={t('common:to') + ' ' + t('common:language')}
              value={tolanguage}
              options={data ? data : []}
              setValue={setToLanguage}
              title={t('common:available') + ' ' + t('common:language')}
              showSearch
            />

            <DatePicker
              mode="datetime"
              date={deadlineDate}
              setDate={setDeadlineDate}
              title={t('common:date')}
              label={t('common:dealine') + ' ' + t('common:date')}
            />

            <FilePickerModal
              label={
                t('common:file') +
                ' ' +
                t('common:for') +
                ' ' +
                t('common:translation')
              }
              choosenFile={selectedFile}
              onFileSelected={onFileSelected}
            />

            {(error || erroMessage !== '') && (
              <CustomError message={erroMessage} />
            )}
          </KeyboardAwareScrollView>
        </ScrollView>

        <CustomButton buttonTitle={t('common:send')} onTap={() => onSubmit()} />

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

export default CreateWritenScreen;

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

const temp = {
  Id: 108,
  OrderNumber: 'Case now',
  CreateDate: '2023-11-22T14:47:45.022Z',
  CreateByUser: 'techplanet50@gmail.com',
  Deadline: '2023-11-25T14:47:00.000Z',
  LanguageFrom: 11,
  LanguageTo: 14,
  InterpreterId: null,
  CompanyName: ' Tekplanet Solution',
  Salaryinterpreter: 0,
  PriceCustomer: 0,
  Files: '{"FilePaths":[]}',
  ResponseFiles: null,
  interpreterPay: false,
  CustomerPay: false,
  InvoiceNumber: 0,
  BellaStatus: false,
  Status: 3,
  CustomerId: null,
  Response: null,
  Anslag: null,
  HandInDatetime: null,
  InterpayDate: null,
  Remark: null,
};
