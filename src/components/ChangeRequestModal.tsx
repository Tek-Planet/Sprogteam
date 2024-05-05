import React, {useState} from 'react';
import {Text, View, StyleSheet, Pressable} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../assets/spacing';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';
import {
  dismissKeyboard,
  errorText,
  getCurrentDate,
  height,
  width,
} from '../utils';
import {
  CustomButton,
  CustomError,
  CustomInput,
  CustomLoader,
  DatePicker,
} from '.';

import {useAppSelector} from '../rtk/hooks';

import {QuoteType} from '../types';
import {useCreateQuoteDetailsMutation} from '../rtk/services';

import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

interface ChangeRequestModalProps {
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;
  onPress: () => void;
  item: QuoteType;
  setMessage: (val: string) => void;
}

function ChangeRequestModal(props: ChangeRequestModalProps) {
  const [createQuoteDetails, {error, isLoading}] =
    useCreateQuoteDetailsMutation();
  const {user} = useAppSelector(state => state.user);

  const {modalVisible, onPress, item, setMessage} = props;

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const {t} = useTranslation();
  const [comment, setComment] = useState<string>('');

  const [erroMessage, setErrorMessage] = useState<string>('');

  const [deadlineDate, setDeadlineDate] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [deadlineTime, setDeadlineTime] = useState<Date | undefined | 'error'>(
    undefined,
  );
  const [price, setPrice] = useState<string>('');

  const onSubmit = async () => {
    if (!deadlineDate || deadlineDate === 'error') {
      setDeadlineDate(errorText);
      return;
    }

    if (!deadlineTime || deadlineTime === 'error') {
      setDeadlineTime(errorText);
      return;
    }

    if (price.length === 0) {
      setPrice(errorText);
      return;
    }

    let body: any = {
      QuoteId: item?.QuoteID,
      CreateDate: getCurrentDate().toDate(),
      Comment: comment,
      DeadlineDate: deadlineDate,
      DeadlineTime: deadlineTime,
      Price: parseFloat(price),
      CurrencyId: item.CurrencyId,
      UserId: user.Id,
    };

    setErrorMessage('');
    var response: any;

    response = await createQuoteDetails(body);
    if (response.data) {
      setMessage(t('common:changes') + ' ' + t('common:sent'));
      onPress();
    } else {
      setErrorMessage('Unable to send offer please try again later');
    }
  };

  return (
    <Modal
      visible={modalVisible}
      modalAnimation={
        new ScaleAnimation({
          // initialValue: 1,
          useNativeDriver: true,
        })
      }
      // modalTitle={<ModalTitle title={props.title} />}
      onTouchOutside={() => {
        dismissKeyboard();
      }}>
      <ModalContent
        style={{
          width: width * 0.9,
          maxHeight: height * 0.9,
        }}>
        <View style={{position: 'relative'}}>
          <Pressable
            onPress={() => {
              setMessage(t('common:changes') + ' ' + t('common:sent'));
              onPress();
            }}
            style={{position: 'absolute', right: 5, zIndex: 10}}>
            <Feather color={colors.main} name={'x-circle'} size={25} />
          </Pressable>
          {isLoading && <CustomLoader color={colors.main} />}
          <KeyboardAwareScrollView>
            <View>
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

              <Text style={styles.title}>{t('common:price')}</Text>
              <CustomInput
                placeholder={t('common:price')}
                onTextChange={setPrice}
                value={price}
              />

              <Text style={styles.title}>{t('common:comment')}</Text>
              <CustomInput
                placeholder={
                  t('common:write') +
                  ' ' +
                  t('common:additional') +
                  ' ' +
                  t('common:information').toLowerCase() +
                  ' ' +
                  t('common:here').toLowerCase()
                }
                height={120}
                onTextChange={setComment}
                value={comment}
                onEnterPress={() => {
                  dismissKeyboard();
                }}
              />
              {(error || erroMessage !== '') && (
                <CustomError message={erroMessage} />
              )}
              <View style={{width: width * 0.8}}>
                <CustomButton
                  buttonTitle={t('common:submit')}
                  textSize={fontSize.light}
                  onTap={() => {
                    onSubmit();
                  }}
                />
              </View>
            </View>
          </KeyboardAwareScrollView>
        </View>
      </ModalContent>
    </Modal>
  );
}

export default ChangeRequestModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    profileText: {
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      color: colors.black,
      marginStart: spacing.twenty,
    },
    iconBg: {
      height: 45,
      width: 45,
      backgroundColor: colors.ash,
      borderRadius: 10,
      alignItems: 'center',
      justifyContent: 'center',
    },
    title: {
      color: colors.black,
      fontSize: fontSize.regular,
      fontFamily: fonts.medium,
      marginTop: spacing.ten,
    },
    image: {
      marginBottom: spacing.twenty * 2,
      alignSelf: 'center',
      height: 100,
      width: 100,
    },
  });
