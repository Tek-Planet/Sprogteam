import React, {useEffect, useState} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';

import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useNavigation, useTheme} from '@react-navigation/native';

import {useTranslation} from 'react-i18next';

import {
  CustomButton,
  CustomDropDown,
  CustomError,
  CustomInput,
  CustomLanguageDropDown,
  CustomLoader,
  Header,
  SuccessModal,
} from '../../components';
import {
  useCreateGigMutation,
  useEditGigMutation,
  useGetInterpreterServicesQuery,
  useGetSubServicesQuery,
  useGetTranlatorLanguagesQuery,
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
import {colorTypes} from '../../assets/colors';
import {fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {GigStackParams} from '../../navigations/GigNavigation';

import FilePickerModal from '../../components/FilePickerModal';

type Props = NativeStackScreenProps<GigStackParams, 'CreateGig'>;

const CreateGigScreen = ({route}: Props) => {
  const navigation: any = useNavigation();
  const [item, setItem] = useState(route?.params?.item);
  const [filteredSubservie, setFilteredSubservie] = useState<
    SelectOptionType[]
  >([]);

  const {user, defaultLanguage} = useAppSelector(state => state.user);

  const userId = user.Id;
  const email = user.Email;

  // console.log(userId);

  const {data: services, error} = useGetInterpreterServicesQuery('', {
    refetchOnMountOrArgChange: true,
  });

  const {data: userLanguages} = useGetTranlatorLanguagesQuery(
    {userId, email},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const {data: subServices, error: subServicesError} =
    useGetSubServicesQuery('');

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);
  const [createGig, {isLoading: isSaving}] = useCreateGigMutation();
  const [editGig, {isLoading: isUpdating}] = useEditGigMutation();

  // let services = getServices();

  let currencies = getCurrencies();
  const [erroMessage, setErrorMessage] = useState<string>('');

  const [language, setLanguage] = useState<SelectOptionType>(
    item?.FromLanguage
      ? {
          value: item?.FromLanguage.LanguagesID + '',
          label: item?.FromLanguage?.LanguagesName,
        }
      : initialLanguage,
  );

  const [tolanguage, setToLanguage] = useState<SelectOptionType>(
    item?.ToLanguage
      ? {
          value: item?.ToLanguage.LanguagesID + '',
          label: item?.ToLanguage?.LanguagesName,
        }
      : initialLanguage,
  );
  const [service, setService] = useState<SelectOptionType>(
    item
      ? {
          LanguageRequire: item?.Service?.LanguageRequire,
          value: item?.Service?.ServiceID + '',
          label:
            defaultLanguage?.code === 'dk'
              ? item?.SubService?.SubServiceNameDK || item?.Service?.ServiceName
              : item?.Service?.ServiceName,
        }
      : initialSelect(),
  );

  const [assignment, setAssignment] = useState<SelectOptionType>(
    initialSelect(),
  );

  const [currency, setCurrency] = useState<SelectOptionType>(
    item ? currencies[item.CurrencyId - 1] : initialSelect(),
  );

  const [title, setTitle] = useState<string>(item ? item.title : '');
  const [body, setBody] = useState<string>(item ? item.description : '');
  const [faq, setFaq] = useState<string>(item ? item.faq : '');
  const [budget, setBudget] = useState<string>(
    item ? item.ActualCost + '' : '',
  );
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [selectedFile, setselectedFile] = useState<any>(null);
  const [uploading, setUploading] = useState<boolean>(false);

  const resetAllField = () => {
    setModalVisible(false);

    navigation.replace('Tab', {screen: 'Gigs'});
  };

  const onSubmit = async () => {
    if (service.value === 'Select' || service.value === 'error') {
      setService(errorValue);
      return;
    }

    if (assignment.value === 'Select' || assignment.value === 'error') {
      setAssignment(errorValue);
      return;
    }

    if (
      service.LanguageRequire &&
      (language.value === 'Select' || language.value === 'error')
    ) {
      setLanguage(errorValue);
      return;
    }

    if (
      service.LanguageRequire &&
      (tolanguage.value === 'Select' || tolanguage.value === 'error')
    ) {
      setToLanguage(errorValue);
      return;
    }

    if (title === '' || title === 'error') {
      setTitle(errorText);
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

    // create the quote object
    let gigBody: any = {
      title,
      languageID: service.LanguageRequire ? parseInt(language.value) : null,
      description: faq,
      faq: faq,
      userId: user.Id,
      checkPhone: false,
      checkVideo: false,
      checkAttendance: false,
      checkWritten: false,
      service: service.label,
      serviceId: parseInt(service.value),
      languageName: service.LanguageRequire ? language.label : null,
      toLanguageName: service.LanguageRequire ? tolanguage.label : null,
      toLanguageID: service.LanguageRequire ? parseInt(tolanguage.value) : null,
      ActualCost: parseFloat(budget),
      CreateDate: getCurrentDate().toDate(),
      isActive: true,
      isDelete: false,
      SubServiceId: parseInt(assignment.value),
      CurrencyId: parseInt(currency.value),
      imgOne: item ? item.imgOne : null,
      gigId: item ? item.ID : null,
    };

    if (selectedFile !== null) {
      setUploading(true);
      let fileUrl = await uploadFile(selectedFile);
      if (fileUrl === null) {
        setErrorMessage('Unable to submit this gig ');
        setUploading(false);
        return;
      }
      gigBody.imgOne = fileUrl;
    }

    var response: any;

    response = item ? await editGig(gigBody) : await createGig(gigBody);

    if (response?.data) {
      setMessage(
        item
          ? t('common:gig') + ' ' + t('common:updated')
          : t('common:gig') + ' ' + t('common:created'),
      );
      setModalVisible(true);
    } else {
      console.log(response.error);
      setErrorMessage(item ? 'Error updating gig' : 'Error saving gig');
    }
  };

  const onFileSelected = async (imageFile: any) => {
    setselectedFile(imageFile);
  };

  useEffect(() => {
    const fetData = () => {
      let filteredSubservie: any[] = [];
      if (subServices) {
        for (const subService of subServices) {
          if (subService.ServiceId === service.value)
            filteredSubservie.push(subService);
        }
      }
      setFilteredSubservie(filteredSubservie);
    };

    if (subServices && subServices?.length > 0) fetData();
  }, [service]);

  return (
    <View style={{...styles.container}}>
      <Header
        headerTitle={
          item
            ? t('common:edit') + ' ' + t('GIG')
            : t('common:create') + ' ' + t('GIG')
        }
        showleftIcon
        showRightIcon
      />
      {(isSaving || uploading || isUpdating) && <CustomLoader />}

      <View style={{flex: 1, padding: spacing.ten}}>
        <ScrollView>
          <KeyboardAwareScrollView>
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

            {service.LanguageRequire && (
              <View>
                <CustomLanguageDropDown
                  label={t('common:from') + ' ' + t('common:language')}
                  value={language}
                  options={userLanguages ? userLanguages : []}
                  setValue={setLanguage}
                  title={t('common:available') + ' ' + t('common:language')}
                  showSearch
                />

                <CustomLanguageDropDown
                  label={t('common:to') + ' ' + t('common:language')}
                  value={tolanguage}
                  options={userLanguages ? userLanguages : []}
                  setValue={setToLanguage}
                  title={t('common:available') + ' ' + t('common:language')}
                  showSearch
                />
              </View>
            )}
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
              label={t('common:estimated') + ' ' + t('common:price')}
            />

            <CustomDropDown
              label={t('common:currency')}
              value={currency}
              options={currencies}
              setValue={setCurrency}
            />

            <CustomInput
              height={100}
              value={body}
              onTextChange={setBody}
              placeholder={t('common:gig') + ' ' + t('common:description')}
              label={t('common:gig') + ' ' + t('common:description')}
            />

            <CustomInput
              height={100}
              value={faq}
              onTextChange={setFaq}
              placeholder={t('common:faq')}
              label={t('common:faq')}
            />
            <FilePickerModal
              choosenFile={selectedFile}
              onFileSelected={onFileSelected}
            />

            {erroMessage !== '' && <CustomError message={erroMessage} />}

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

export default CreateGigScreen;

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
