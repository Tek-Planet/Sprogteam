import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {fonts} from '../../assets/fonts';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useTranslation} from 'react-i18next';
import {spacing} from '../../assets/spacing';
import {
  CustomButton,
  CustomDropDown,
  CustomError,
  CustomInput,
  CustomLanguageDropDown,
  CustomLoader,
  DatePicker,
  Header,
  SuccessModal,
} from '../../components';
import {
  useCreateQuoteMutation,
  useGetLanguagesQuery,
  useGetServicesQuery,
  useGetSubServicesQuery,
} from '../../rtk/services';
import {SelectOptionType} from '../../types';
import {
  errorText,
  errorValue,
  getCurrencies,
  getCurrentDate,
  initialLanguage,
  initialSelect,
  uploadFile,
} from '../../utils';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {useAppSelector} from '../../rtk/hooks';
import {RootStackParams} from '../../navigations/MainNavigation';
import FilePickerModal from '../../components/FilePickerModal';

type Props = NativeStackScreenProps<RootStackParams, 'CreateQuote'>;

const CreateQuoteScreen = () => {
  const {user} = useAppSelector(state => state.user);

  const navigation: any = useNavigation();

  const {data, error, isLoading} = useGetLanguagesQuery('');

  const {data: services} = useGetServicesQuery('');

  const {data: subServices, error: subServicesError} =
    useGetSubServicesQuery('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [createQuote, {isLoading: isSaving}] = useCreateQuoteMutation();

  const [language, setLanguage] = useState<SelectOptionType>(initialLanguage);
  const [tolanguage, setToLanguage] =
    useState<SelectOptionType>(initialLanguage);
  const [service, setService] = useState<SelectOptionType>(initialSelect());
  const [assignment, setAssignment] = useState<SelectOptionType>(
    initialSelect(),
  );
  const [currency, setCurrency] = useState<SelectOptionType>(initialSelect());
  const [deadlineDate, setDeadlineDate] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [deadlineTime, setDeadlineTime] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [title, setTitle] = useState<string>('');
  const [body, setBody] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setselectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const [filteredSubservie, setFilteredSubservie] = useState<
    SelectOptionType[]
  >([]);

  let currencies = getCurrencies();
  const [erroMessage, setErrorMessage] = useState<string>('');

  const resetAllField = () => {
    setModalVisible(false);
    navigation.replace('QuoteAwaitingApproval');
  };

  const onFileSelected = async (imageFile: any) => {
    setselectedFile(imageFile);
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

    if (assignment.value === 'Select' || assignment.value === 'error') {
      setAssignment(errorValue);
      return;
    }

    if (title === '' || title === 'error') {
      setTitle(errorText);
      return;
    }

    if (!deadlineDate || deadlineDate === 'error') {
      setDeadlineDate(errorText);
      return;
    }

    if (!deadlineTime || deadlineTime === 'error') {
      setDeadlineTime(errorText);
      return;
    }

    if (service.value === 'Select' || service.value === 'error') {
      setService(errorValue);
      return;
    }

    if (budget === '' || budget === 'error') {
      setBudget(errorText);
      return;
    }

    if (currency.value === 'Select' || currency.value === 'error') {
      setCurrency(errorValue);
      return;
    }

    let quoteBody: any = {
      AcceptAmount: 0,
      ClientId: user.Id,
      CreateBy: user.Id,
      CreateDate: getCurrentDate().toDate(),
      CurrencyId: parseInt(currency.value),
      CustomerAmount: 0,
      CustomerServiceChargeAmount: 0,
      CustomerServiceChargePer: 0,
      DeadlineDate: deadlineDate,
      DeadlineTime: deadlineTime,
      Descriptions: body,
      EstimatedBudget: parseFloat(budget),
      FromLanguageId: parseInt(language.value),
      GID: 0,
      IsActive: true,
      IsPaymentPaid: false,
      QuoteStatusId: 1,
      ServiceId: parseInt(service.value),
      SubServiceId: parseInt(assignment.value),
      Title: title,
      ToLanguageId: parseInt(tolanguage.value),
      TotalAmount: 0,
      TranslatorAmount: 0,
      TranslatorServiceChargeAmount: 0,
      TranslatorServiceChargePer: 0,
      UpdateDate: '0001-01-01T00:00:00.000Z',
      IsAnonymous: true,
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
    const fetData = () => {
      let filteredSubservie: any[] = [];
      if (subServices) {
        for (const subService of subServices) {
          if (subService.ServiceId === service.value)
            filteredSubservie.push(subService);
        }
        setFilteredSubservie(filteredSubservie);
      }
    };

    if (subServices && subServices?.length > 0) fetData();
  }, [service]);

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={t('common:create') + ' ' + t('quote')}
        showleftIcon
        showRightIcon
      />
      {(isLoading || isSaving || uploading) && <CustomLoader />}

      <View style={{flex: 1, padding: spacing.ten}}>
        <ScrollView>
          <KeyboardAwareScrollView>
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

            <CustomDropDown
              label={t('common:service')}
              value={service}
              options={services ? services : []}
              setValue={setService}
              title={t('common:available') + ' ' + t('common:services')}
            />

            <CustomDropDown
              label={t('common:category')}
              value={assignment}
              options={filteredSubservie}
              setValue={setAssignment}
            />

            <CustomInput
              placeholder={t('common:title')}
              onTextChange={setTitle}
              value={title}
              label={t('common:title')}
            />

            <CustomInput
              placeholder={'0.00'}
              onTextChange={setBudget}
              value={budget}
              label={t('common:estimated') + ' ' + t('common:budget')}
            />

            <CustomDropDown
              label={t('common:currency')}
              value={currency}
              options={currencies}
              setValue={setCurrency}
            />

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

export default CreateQuoteScreen;

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
