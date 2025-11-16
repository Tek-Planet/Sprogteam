import moment from 'moment';
import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';
import {colorTypes} from '../../assets/colors';
import {fonts, fontSize} from '../../assets/fonts';
import {spacing} from '../../assets/spacing';
import baseStyle from '../../assets/styles';

import {
  ChangeRequestModal,
  CustomButton,
  CustomError,
  CustomLoader,
  Header,
  SubmitQuoteModal,
  SuccessModal,
} from '../../components';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {RootStackParams} from '../../navigations/MainNavigation';
import {
  customerPercentage,
  dateToMilliSeconds,
  getCurrencies,
  getCurrentDate,
  getFileName,
  getServices,
  getStatusName,
  percentageCalculator,
  startFileDownload,
  toast,
  translatorPercentage,
  uploadFile,
  width,
} from '../../utils';
import {QuoteDetail, SelectOptionType} from '../../types';
import {useAppSelector} from '../../rtk/hooks';
import {
  useAcceptQuoteMutation,
  useDeleteQuoteMutation,
  useGetQuotesDetailsQuery,
  useGetServiceChargeQuery,
  useUpdateQuoteMutation,
} from '../../rtk/services';

type Props = NativeStackScreenProps<RootStackParams, 'QuoteDetails'>;

const QuoteDetailsScreen = ({navigation, route}: Props) => {
  const [updateQuote] = useUpdateQuoteMutation();
  const {data: ServiceCharge} = useGetServiceChargeQuery('', {});

  const translatorPercentageFee = ServiceCharge
    ? ServiceCharge?.TranslatorServiceCharge
    : translatorPercentage;

  const customerPercentageFee = ServiceCharge
    ? ServiceCharge?.CustomerServiceCharge
    : customerPercentage;

  const [item, setItem] = useState(route?.params?.item);
  const {user, defaultLanguage} = useAppSelector(state => state.user);
  const [acceptQuote, {isLoading: isSaving}] = useAcceptQuoteMutation();
  const [deleteQuote, {isLoading: isDeleting}] = useDeleteQuoteMutation();
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [submitModalVisible, setsubmitModalVisible] = useState<boolean>(false);
  const [message, setMessage] = useState<string>('');
  const [offerModalVisible, setOfferModalVisible] = useState<boolean>(false);

  const {
    QuoteID,
    CreateDate,
    Title,
    EstimatedBudget,
    QuoteStatusId,
    DeadlineDate,
    Descriptions,
    QuoteFile,
    DeadlineTime,
    DeadlineNewDate,
    DeadlineNewTime,
    CurrencyId,
    TranslatorAmount,
    TranslatorServiceChargePer,
    CustomerServiceChargePer,
    CustomerAmount,
    IsPaymentPaid,
    VerificationFile,
    ServiceName,
    ServiceNameDK,
  } = item;
  const quoteId: any = QuoteID;
  const {data, isLoading} = useGetQuotesDetailsQuery(quoteId, {
    refetchOnMountOrArgChange: true,
  });

  const {t} = useTranslation();
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const currency: SelectOptionType = getCurrencies()[CurrencyId - 1];
  const [erroMessage, setErrorMessage] = useState<string>('');
  const [showButtons, setShowButtons] = useState<boolean>(false);
  const [estimatedAmount, setEstimatedAmount] = useState<number>(0);
  const [quoteDetail, setQueteDetail] = useState<QuoteDetail>();
  const [uploading, setUploading] = useState<boolean>(false);
  const [loadingFile, setLoadingFile] = useState<boolean>(false);

  const onAccept = async () => {
    const totalAmount = percentageCalculator(
      estimatedAmount,
      customerPercentageFee,
      true,
    );
    const translatorAmount = percentageCalculator(
      estimatedAmount,
      translatorPercentageFee,
      false,
    );

    let quoteBody: any = {
      recordId: QuoteID,
      AcceptAmount: estimatedAmount,
      CustomerAmount: totalAmount, //increase acceoted amount by 10%
      CustomerServiceChargeAmount: totalAmount - estimatedAmount, //value 10 percent
      CustomerServiceChargePer: customerPercentageFee, //10 itsesel
      DeadlineNewDate: quoteDetail ? quoteDetail.DeadlineDate : DeadlineDate, //new deadkine if any otherwie old one
      DeadlineNewTime: quoteDetail ? quoteDetail.DeadlineTime : DeadlineTime, //same as above
      QuoteStatusId: 2, //turn to 2
      TotalAmount: totalAmount, //same as CustomerAmount
      TranslatorAmount: translatorAmount, //decrease accepted amont by 20 %
      TranslatorServiceChargeAmount: estimatedAmount - translatorAmount, //amount of 20 %
      TranslatorServiceChargePer: translatorPercentageFee, //20
      UpdateBy: user.Id, //Id of who accepted the offer
      UpdateDate: getCurrentDate(), //date the offer was accepted
    };
    if (user.interpreter && !item.TranslatorId)
      quoteBody.TranslatorId = user.Id;

    var response: any;

    response = await acceptQuote(quoteBody);

    if (response?.data) {
      setMessage(t('common:quote') + ' ' + t('common:accepted'));
      setModalVisible(true);
      setItem(response?.data);
      setShowButtons(false);
    } else {
      console.log(response.error);
      setErrorMessage('Error saving quote');
    }
  };

  const onRejected = async () => {
    let quoteBody: any = {
      recordId: QuoteID,
      QuoteStatusId: 5, //turn to 2
      UpdateBy: user.Id, //Id of who accepted the offer
      UpdateDate: getCurrentDate(), //date the offer was accepted
    };

    var response: any;

    response = await acceptQuote(quoteBody);

    if (response?.data) {
      console.log(response.data);
      setMessage(t('common:quote') + ' ' + t('common:rejected'));
      setModalVisible(true);
      setItem(response?.data);
    } else {
      console.log(response.error);
      setErrorMessage('Error saving quote');
    }
  };

  const onSubmit = async (selectedFile: any) => {
    if (selectedFile !== null) {
      setUploading(true);
      setsubmitModalVisible(false);
      let fileUrl = await uploadFile(selectedFile);
      if (fileUrl === null) {
        toast('Error submitting quote', 'error');
        setUploading(false);
        return;
      }

      const quoteBody: any = {
        VerificationFile: fileUrl,
        recordId: item.QuoteID,
      };

      const response: any = await updateQuote(quoteBody);
      if (response?.data) {
        setItem(response?.data);
        setMessage(t('common:quote') + ' ' + t('common:submitted'));
        setModalVisible(true);
      } else toast('Error submitting quote', 'error');

      setUploading(false);
    }
  };

  const onDeleteQuote = async () => {
    const response: any = await deleteQuote(item.QuoteID);
    if (response.data) {
      setMessage(t('common:quote') + ' ' + t('common:deleted'));
      setModalVisible(true);
      navigation.goBack();
    } else toast('Error deleting quote', 'error');
  };

  const reset = () => {
    setOfferModalVisible(false);
    if (message.length > 0) {
      setMessage(t('common:changes') + ' ' + t('common:sent'));
      setModalVisible(true);
    }
  };

  useEffect(() => {
    if (data && data.length > 0) {
      //  get last item in the lis
      const lastItem = data[data.length - 1];
      if (
        QuoteStatusId === 1 &&
        lastItem.UserId !== user?.Id &&
        dateToMilliSeconds(item.DeadlineDate) >
          dateToMilliSeconds(getCurrentDate().toString())
      )
        setShowButtons(true);
      else setShowButtons(false);

      setEstimatedAmount(lastItem.Price);
      setQueteDetail(lastItem);
    } else {
      if (
        QuoteStatusId === 1 &&
        user?.Id !== item.CreateBy &&
        dateToMilliSeconds(item.DeadlineDate) >
          dateToMilliSeconds(getCurrentDate().toString())
      )
        setShowButtons(true);
      else setShowButtons(false);

      setEstimatedAmount(EstimatedBudget);
    }

    // calculate amount of translators
  }, [data]);

  const initiateDownload = async (QuoteFile: string) => {
    setLoadingFile(true);
    const res = await startFileDownload(QuoteFile);
    setLoadingFile(false);
  };

  return (
    <View
      style={{
        ...styles.container,
      }}>
      <Header
        showleftIcon
        headerTitle={t('common:quote') + ' ' + t('common:details')}
      />

      {item.ClientId === user.Id && item.QuoteStatusId === 1 && (
        <View style={{alignSelf: 'flex-end', position: 'absolute', right: 5}}>
          <CustomButton
            padding={1}
            textSize={12}
            onTap={() => {
              onDeleteQuote();
            }}
            bGcolor={colors.red}
            testColor={colors.white}
            buttonTitle={t('common:cancel') + ' ' + t('common:request')}
          />
        </View>
      )}
      {(isSaving || uploading || isDeleting || loadingFile) && <CustomLoader />}
      <ScrollView>
        <View style={{padding: spacing.ten, flex: 1}}>
          {/* start time */}
          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>
              {item.ClientId !== user.Id
                ? t('common:customer')
                : t('common:translator')}
            </Text>

            {item.FirstName && (
              <Text style={{...styles.text}}>
                {item.FirstName + ' ' + item.LastName}
              </Text>
            )}
          </View>
          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>
              {t('common:created') + ' ' + t('common:on')}
            </Text>

            <Text style={{...styles.text}}>
              {moment.utc(CreateDate).format('DD:MM:YYYY')}
            </Text>
          </View>

          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>{t('common:deadline')}</Text>

            <Text style={{...styles.text}}>
              {moment
                .utc(DeadlineNewDate ? DeadlineNewDate : DeadlineDate)
                .format('DD:MM:YYYY')}
              :
              {moment
                .utc(DeadlineNewTime ? DeadlineNewTime : DeadlineTime)
                .format('HH:mm')}
            </Text>
          </View>

          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>{t('common:title')}</Text>

            <Text style={{...styles.text}}>{Title}</Text>
          </View>

          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>{t('common:service')}</Text>

            <Text style={{...styles.text}}>
              {defaultLanguage?.code === 'dk'
                ? ServiceNameDK || ServiceName
                : ServiceName}
            </Text>
          </View>

          {item?.FromLanguageName && (
            <View style={{...styles.row}}>
              <Text style={{...styles.title}}>
                {t('common:translated_from')}
              </Text>

              <Text style={{...styles.text}}>{item?.FromLanguageName}</Text>
            </View>
          )}
          {item?.ToLanguageName && (
            <View style={{...styles.row}}>
              <Text style={{...styles.title}}>{t('common:translated_to')}</Text>

              <Text style={{...styles.text}}>{item?.ToLanguageName}</Text>
            </View>
          )}

          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>
              {t('common:estimated') + ' ' + t('common:price')}
            </Text>

            <Text style={{...styles.text}}>
              {' '}
              {currency.label + ' '} {estimatedAmount}
            </Text>
          </View>

          <View style={{...styles.row}}>
            <Text style={{...styles.title}}>{t('common:status')}</Text>

            <Text
              style={{
                ...styles.text,
                color: QuoteStatusId === 2 ? colors.green : colors.red,
              }}>
              {getStatusName(QuoteStatusId, true)}
            </Text>
          </View>

          <Text style={{...styles.text, marginVertical: spacing.ten}}>
            {t('common:description')}
          </Text>

          <Text style={{...styles.title, textAlign: 'justify'}}>
            {Descriptions}
          </Text>

          <View>
            <Text style={{...styles.text, marginVertical: spacing.ten}}>
              {t('common:document')}
            </Text>
            {QuoteFile && (
              <View>
                <Text style={{...styles.text}}>
                  {t('common:quote') + ' ' + t('common:file')}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    if (!loadingFile) initiateDownload(QuoteFile);
                  }}>
                  <Text style={{...styles.title}}>
                    {getFileName(QuoteFile)?.substring(0, 30)}
                  </Text>
                  <Feather name="download" size={25} color={colors.main} />
                </TouchableOpacity>
              </View>
            )}

            {VerificationFile && (
              <View>
                <Text style={{...styles.text}}>
                  {t('common:verified') + ' ' + t('common:file')}
                </Text>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                  onPress={() => {
                    startFileDownload(VerificationFile);
                  }}>
                  <Text style={{...styles.title}}>
                    {getFileName(VerificationFile)?.substring(0, 30)}
                  </Text>
                  <Feather name="download" size={25} color={colors.main} />
                </TouchableOpacity>
              </View>
            )}

            {/* show the service fee for interprepter */}
          </View>

          {/* show list of response if any */}

          <View style={{marginTop: spacing.fiften}}>
            {data &&
              data.map((item, index) => {
                return (
                  <View
                    style={{
                      ...baseStyle.elevation,
                      backgroundColor: colors.white,
                      padding: spacing.five,
                      marginBottom: spacing.ten,
                      borderRadius: spacing.ten,
                    }}
                    key={index.toString()}>
                    <Text
                      style={{
                        ...styles.text,
                        marginVertical: spacing.ten,
                        fontSize: fontSize.light,
                      }}>
                      {t('common:request') + ' ' + t('common:changes')}{' '}
                      {index + 1}
                    </Text>
                    <View style={{...styles.row}}>
                      <Text style={{...styles.title}}>{t('common:name')}</Text>
                      <Text
                        style={{
                          ...styles.text,
                        }}>
                        {item.user.FirstName + ' ' + item.user.LastName}
                      </Text>
                    </View>
                    <View style={{...styles.row}}>
                      <Text style={{...styles.title}}>{t('common:price')}</Text>

                      <Text style={{...styles.text}}>
                        {currency.label + ' '} {item.Price}
                      </Text>
                    </View>

                    <View style={{...styles.row}}>
                      <Text style={{...styles.title}}>
                        {t('common:deadline')}
                      </Text>

                      <Text style={{...styles.text}}>
                        {moment.utc(item.DeadlineDate).format('DD:MM:YYYY')}:
                        {moment.utc(item.DeadlineTime).format('HH:mm')}
                      </Text>
                    </View>

                    <View style={{...styles.row}}>
                      <Text style={{...styles.title, width: width * 0.25}}>
                        {t('common:comment')}
                      </Text>

                      <Text style={{...styles.text, flex: 1}}>
                        {item.Comment}:
                      </Text>
                    </View>
                  </View>
                );
              })}
          </View>

          {item.ClientId !== user.Id && (
            <View style={{}}>
              <Text
                style={{
                  ...styles.text,

                  fontSize: fontSize.light,
                }}>
                {t('common:translator') + ' ' + t('common:fee')}
              </Text>
              <Text style={{...styles.text, fontSize: fontSize.light}}>
                {t('common:translator') +
                  ' ' +
                  t('common:service') +
                  ' ' +
                  t('common:fee')}
                :{' '}
                {TranslatorServiceChargePer
                  ? TranslatorServiceChargePer
                  : translatorPercentageFee}
                %
              </Text>

              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'flex-start',
                }}>
                <Text
                  style={{
                    ...styles.text,
                    marginVertical: spacing.five,
                    fontSize: fontSize.light,
                  }}>
                  {t('common:pay_text')}
                </Text>

                <Text style={{...styles.text, fontSize: fontSize.light}}>
                  {' '}
                  {currency.label}{' '}
                  {TranslatorAmount
                    ? TranslatorAmount
                    : percentageCalculator(
                        estimatedAmount,
                        translatorPercentageFee,
                        false,
                      )}
                </Text>
              </View>
            </View>
          )}

          {item.ClientId === user.Id &&
            QuoteStatusId == 2 &&
            !IsPaymentPaid && (
              <View style={{margin: spacing.five, paddingBottom: spacing.ten}}>
                <Text
                  style={{
                    ...styles.text,
                    marginVertical: spacing.ten,
                    fontSize: fontSize.light,
                  }}>
                  {t('common:service') + ' ' + t('common:charge')}
                </Text>
                <Text style={{...styles.text, fontSize: fontSize.light}}>
                  {t('common:service') + ' ' + t('common:charge')}:{' '}
                  {CustomerServiceChargePer
                    ? CustomerServiceChargePer
                    : customerPercentageFee}
                  %
                </Text>

                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'flex-start',
                  }}>
                  <Text
                    style={{
                      ...styles.text,
                      marginVertical: spacing.ten,
                      fontSize: fontSize.light,
                    }}>
                    {t('common:pay') + ' ' + t('common:amount')}
                  </Text>

                  <Text style={{...styles.text, fontSize: fontSize.light}}>
                    {' '}
                    {currency.label} {CustomerAmount}
                  </Text>
                </View>
                {dateToMilliSeconds(getCurrentDate().toISOString()) <
                  dateToMilliSeconds(item.DeadlineDate) && (
                  <CustomButton
                    buttonTitle={
                      t('common:proceed_next') + ' ' + CustomerAmount
                    }
                    onTap={() => {
                      navigation.navigate('Payment', {item});
                    }}
                  />
                )}
              </View>
            )}
        </View>
      </ScrollView>

      {/* button for interpreter */}

      {erroMessage !== '' && <CustomError message={erroMessage} />}

      {showButtons && (
        <View
          style={{
            marginHorizontal: spacing.ten,
            paddingBottom: spacing.twenty,
          }}>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'center',
            }}>
            <View style={styles.buttonWrapper}>
              <CustomButton
                onTap={() => {
                  onAccept();
                }}
                buttonTitle={t('common:accept')}
              />
            </View>
            {/* button section */}
            {
              <View style={styles.buttonWrapper}>
                <CustomButton
                  onTap={() => {
                    onRejected();
                  }}
                  bGcolor={colors.red}
                  testColor={colors.white}
                  buttonTitle={t('common:reject')}
                />
              </View>
            }
          </View>

          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
            }}>
            {QuoteStatusId == 1 && (
              <Pressable
                onPress={() => setOfferModalVisible(true)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingStart: spacing.ten,
                }}>
                <Text
                  style={{
                    ...styles.text,
                    fontSize: fontSize.regular,
                    color: colors.main,
                    marginEnd: spacing.ten,
                  }}>
                  {t('common:request') + ' ' + t('common:changes')}
                </Text>

                <Feather name="edit" size={25} color={colors.main} />
              </Pressable>
            )}
          </View>
        </View>
      )}

      {QuoteStatusId === 2 &&
        user?.Id !== item.CreateBy &&
        item.IsPaymentPaid &&
        item.VerificationFile === null && (
          <View style={{margin: spacing.ten}}>
            <CustomButton
              onTap={() => {
                setsubmitModalVisible(true);
              }}
              bGcolor={colors.main}
              testColor={colors.white}
              buttonTitle={t('common:submit')}
            />
          </View>
        )}
      {modalVisible && (
        <SuccessModal
          modalVisible={modalVisible}
          setModalVisible={setModalVisible}
          message={message}
          closeModal={() => {
            setModalVisible(false);
            setMessage('');
          }}
        />
      )}

      {submitModalVisible && (
        <SubmitQuoteModal
          modalVisible={submitModalVisible}
          setModalVisible={setsubmitModalVisible}
          onSubmit={(val: any) => {
            onSubmit(val);
          }}
          closeModal={() => {
            setModalVisible(false);
            setMessage('');
            setShowButtons(false);
          }}
        />
      )}

      {offerModalVisible && (
        <ChangeRequestModal
          modalVisible={offerModalVisible}
          setModalVisible={setOfferModalVisible}
          item={item}
          setMessage={val => setMessage(val)}
          onPress={() => {
            reset();
            setShowButtons(false);
          }}
        />
      )}
    </View>
  );
};

export default QuoteDetailsScreen;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: colors.white,
    },
    row: {
      justifyContent: 'space-between',
      flexDirection: 'row',
      marginTop: spacing.ten,
    },
    text: {
      color: colors.black,
      fontFamily: fonts.medium,
    },
    title: {
      color: colors.black,
      opacity: 0.6,
      fontFamily: fonts.medium,
    },
    buttonWrapper: {
      width: '50%',
      margin: 2,
    },
  });
