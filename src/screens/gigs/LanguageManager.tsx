import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  CustomButton,
  CustomDropDown,
  CustomEmptyList,
  CustomError,
  CustomLanguageDropDown,
  CustomLoader,
  CustomRadioButton,
  FilePickerModal,
  Header,
  SuccessModal,
} from '../../components';

import {fonts} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import {AuthStackParams} from '../../navigations/AuthNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {useTheme} from '@react-navigation/native';
import {colorTypes} from '../../assets/colors';
import {useAppSelector} from '../../rtk/hooks';
import {useTranslation} from 'react-i18next';
import {
  errorValue,
  initialLanguage,
  initialSelect,
  uploadFile,
} from '../../utils';
import {SelectOptionType, TabItem} from '../../types';

import {
  useAddLanguageMutation,
  useDeleteLanguageMutation,
  useGetLanguagesQuery,
  useGetTranlatorLanguagesQuery,
} from '../../rtk/services/language';
import Feather from 'react-native-vector-icons/Feather';

type Props = NativeStackScreenProps<AuthStackParams, 'AddLanguage'>;

const LanguageManager = ({route, navigation}: Props) => {
  const {user} = useAppSelector(state => state.user);

  const [deleteLanguage, {isLoading: isDeleting}] = useDeleteLanguageMutation();

  const userId = user.Id;
  const email = user.Email;
  // fetch list of language
  const {data: userLanguages} = useGetTranlatorLanguagesQuery(
    {userId, email},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const {data, error, isLoading} = useGetLanguagesQuery('', {});
  const [addLanguage, {isLoading: isSaving}] = useAddLanguageMutation();

  const [language, setLanguage] = useState<SelectOptionType>(initialLanguage);

  // console.log(userLanguages);

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [erroMessage, setErrorMessage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  const [message, setMessage] = useState<string>('');
  const [selectedFile, setselectedFile] = useState<any>(null);

  const [level, setLevel] = useState(initialSelect());
  const [mastry, setMastry] = useState(initialSelect());

  const radioOption: TabItem[] = [
    {title: t('common:no'), value: '1'},
    {
      title: t('common:yes'),
      value: '2',
    },
  ];

  const levels = [
    {label: t('common:fluent'), value: 'Authorized'},
    {label: t('common:moderate'), value: 'Modersprog'},
  ];

  const masteries = [
    {label: t('common:written'), value: 'Written'},
    {label: t('common:speaking'), value: 'Speaking'},
    {label: t('common:both'), value: 'Written / Speaking'},
  ];

  const [selected, setSelected] = useState<TabItem>(radioOption[0]);

  const onSubmit = async () => {
    if (selected.value === '2' && selectedFile === null) {
      setErrorMessage('upload language certificate');
      return;
    }

    if (level.value === 'Select') {
      setLevel(errorValue);
      return;
    }

    if (mastry.value === 'Select') {
      setMastry(errorValue);
      return;
    }

    let data: any = {
      InterpretorName: user.Email,
      LevelName: level.value,
      LanguageName: language.value,
      Mastery: mastry.value,
      PoliceApprove: selected.value === '2' ? 1 : 0,
      PoliceNumber: null,
    };

    if (selectedFile !== null) {
      setLoading(true);
      let fileUrl = await uploadFile(selectedFile);
      if (fileUrl === null) {
        setErrorMessage('cannot add langage at this point');
        setLoading(false);
        return;
      }
      data.PoliceNumber = fileUrl;
    }

    let response: any = await addLanguage(data);

    if (response?.data.msg === 'success') {
      setMessage('Language Adde');
      setModalVisible(true);
      setLanguage(initialLanguage);
      setLevel(initialLanguage);
    } else if (response?.data?.msg === 'already exist') {
      setErrorMessage('language already exist');
    } else {
      setErrorMessage('Unable to add new language');
    }
    setLoading(false);
  };

  const onFileSelected = async (imageFile: any) => {
    setselectedFile(imageFile);
  };

  const onDelete = async (languageId: number) => {
    let response: any = await deleteLanguage(languageId);

    console.log(response);

    if (response?.data) {
      setMessage(t('common:language') + ' ' + t('common:deleted'));
      setModalVisible(true);
    } else {
      console.log(response.error);
      setErrorMessage('Error deleting language');
    }
  };

  return (
    <View style={{...styles.container}}>
      <Header showleftIcon headerTitle={t('common:language_manager')} />

      {(loading || isLoading) && <CustomLoader color={colors.main} />}

      <View
        style={{
          flex: 1,
          margin: spacing.ten,
          paddingBottom: spacing.fiften * 2,
          justifyContent: 'space-between',
        }}>
        <View>
          <Text style={{...styles.title}}>
            {t('common:added') + ' ' + t('common:language')}
          </Text>
          {userLanguages?.length === 0 && !isLoading && <CustomEmptyList />}

          <ScrollView
            contentContainerStyle={{
              flexDirection: 'row',

              flexWrap: 'wrap',
              marginEnd: 10,
            }}
            showsHorizontalScrollIndicator={false}>
            {userLanguages &&
              userLanguages?.map((item, index) => {
                return (
                  <TouchableOpacity
                    key={index.toString()}
                    onPress={() => {
                      console.log(item);
                      onDelete(parseInt(item.UserLanguageId));
                    }}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: colors.gray,
                      margin: 2,
                      marginBottom: spacing.ten,
                      borderRadius: spacing.ten,
                    }}>
                    <Feather name="x" size={18} color={colors.red} />
                    <Text style={styles.info}>{item.label.trim()}</Text>
                  </TouchableOpacity>
                );
              })}
          </ScrollView>
        </View>

        <ScrollView>
          <View>
            <CustomLanguageDropDown
              label={t('common:select') + ' ' + t('common:language')}
              value={language}
              options={data ? data : []}
              setValue={setLanguage}
              title={t('common:available') + ' ' + t('common:language')}
              showSearch
            />

            {language.value !== 'Select' && (
              <View>
                <CustomRadioButton
                  label={t('common:authorized')}
                  selected={selected}
                  setSelected={setSelected}
                  options={radioOption}
                />

                {selected.value === '2' && (
                  <FilePickerModal
                    onFileSelected={onFileSelected}
                    choosenFile={selectedFile}
                  />
                )}

                <CustomDropDown
                  showSearch={false}
                  value={level}
                  options={levels}
                  setValue={setLevel}
                  label={t('common:language') + ' ' + t('common:level')}
                  title={t('common:language') + ' ' + t('common:level')}
                />

                <CustomDropDown
                  value={mastry}
                  options={masteries}
                  setValue={setMastry}
                  label={t('common:mastery')}
                  title={t('common:mastery')}
                />

                {erroMessage.length > 0 && (
                  <CustomError message={erroMessage} />
                )}
                <CustomButton
                  buttonTitle={t('common:add')}
                  onTap={() => {
                    onSubmit();
                  }}
                />
              </View>
            )}
          </View>
        </ScrollView>
      </View>

      {modalVisible && (
        <SuccessModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          message={message}
          closeModal={() => {
            setModalVisible(false);
          }}
        />
      )}
    </View>
  );
};

export default LanguageManager;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: 1,
      backgroundColor: colors.white,
    },

    title: {
      color: colors.black,
      fontSize: 16,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
      paddingHorizontal: spacing.five,
    },

    info: {
      color: colors.black,
      margin: 5,
      fontFamily: fonts.medium,
    },
  });

// olubiyi@gmail.com
// ho@gmail.com
