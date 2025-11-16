import React, {useEffect, useState} from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Modal, ModalContent, ScaleAnimation} from 'react-native-modals';

import {fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import {useTheme} from '@react-navigation/native';

import {
  calculatePrices,
  errorText,
  height,
  mergeDateTime,
  msToTime,
  timeDifferenceInMilliseconds,
  width,
} from '../utils';
import {CustomButton, CustomError, DatePicker} from '.';
import {useTranslation} from 'react-i18next';
import {BookingModel, UserModel} from '../types';
import {useAppSelector} from '../rtk/hooks';

interface EditTimeModalProps {
  item: BookingModel;
  userDetails: UserModel;
  modalVisible: boolean;
  setModalVisible: (val: boolean) => void;

  closeModal: () => void;
  onSubmit: (val: any) => void;
}

function EditTimeModal(props: EditTimeModalProps) {
  const {t} = useTranslation();

  const {user} = useAppSelector(state => state.user);

  const {modalVisible, setModalVisible, onSubmit, item, userDetails} = props;

  const [date, setDate] = useState<Date | undefined | string>(
    item.DateTimeStart,
  );

  const [startTime, setStartTime] = useState<Date | undefined | string>(
    new Date(
      mergeDateTime(new Date(), item.DateTimeStart, item.DateTimeEnd).startTime,
    ),
  );

  // console.log(startTime);
  const [endTime, setEndTime] = useState<Date | undefined | 'error'>(undefined);

  const [duration, setDuration] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [priceCustomer, setPriceCustomer] = useState<string>();
  // console.log(startTime, new Date());
  const {colors} = useTheme();

  const [erroMessage, setErrorMessage] = useState<string>('');

  const styles = getStyles(colors);

  useEffect(() => {
    const calculateDuration = async () => {
      if (
        startTime &&
        endTime &&
        date &&
        startTime !== errorText &&
        endTime !== errorText &&
        date !== errorText
      ) {
        const mergedDate = await mergeDateTime(date, startTime, endTime);

        const timeDifInMillsec = timeDifferenceInMilliseconds(
          mergedDate.startTime,
          mergedDate.endTime,
        );

        var timeVariant: any = await msToTime(timeDifInMillsec);

        setDuration(timeVariant.duration);

        // calculate price

        let defaultPriceCustomer, defaultPriceTranslator;

        let taskTypeId = item.TaskTypeId;

        if (taskTypeId === 2 || taskTypeId === 3) {
          // get the set price for customer
          defaultPriceCustomer = userDetails.VideoPhoneprice
            ? userDetails.VideoPhoneprice
            : 320;
          // ge

          // get the set price for translator
          defaultPriceTranslator = user.Phonevideo ? user.Phonevideo : 160;
        } else {
          defaultPriceCustomer = userDetails.AttendancePrice
            ? userDetails.AttendancePrice
            : 320;
          // get the set price for translator
          defaultPriceTranslator = user.Attendance ? user.Attendance : 160;
        }

        const value =
          taskTypeId === 2 || taskTypeId === 3
            ? timeVariant.milliSecToMins
            : timeVariant.milliSecToHours;
        const prices = await calculatePrices(
          value,
          taskTypeId,
          defaultPriceCustomer,
          defaultPriceTranslator,
          false,
          startTime,
        );
        console.log(prices);
        setPriceCustomer(prices.customerPrice);
        setPrice(prices.translatorPrice);
      }
    };
    if (startTime && endTime && date) {
      calculateDuration();
    }
  }, [startTime, endTime, date]);

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
        setModalVisible(false);
      }}>
      <ModalContent
        style={{
          width: width * 0.9,
          maxHeight: height * 0.9,
        }}>
        <View>
          <DatePicker
            title={t('common:select') + ' ' + t('common:time')}
            date={endTime}
            setDate={setEndTime}
            label={
              t('common:new') + ' ' + t('common:end') + ' ' + t('common:time')
            }
            mode="time"
            validate={true}
            bookingDate={startTime}
            timeType="end"
          />

          <View style={styles.row}>
            <Text style={[styles.text, {opacity: 0.6}]}>
              {t('common:duration')} :
            </Text>
            <Text style={styles.text}>{duration} </Text>
          </View>

          {/* <View style={styles.row}>
            <Text style={[styles.text, {opacity: 0.6}]}>
              {t('common:price')}:
            </Text>

            <Text style={[styles.text]}>{price && price + ' kr'}</Text>
          </View> */}
          {erroMessage !== '' && <CustomError message={erroMessage} />}
          <CustomButton
            buttonTitle={t('common:done')}
            onTap={() => {
              if (!endTime || endTime === 'error') {
                setEndTime(errorText);
                return;
              }
              setErrorMessage('');
              // convert the date back to it original form

              const mergedDate = mergeDateTime(
                item.DateTimeStart,
                item.DateTimeStart,
                endTime,
              );

              onSubmit(mergedDate.endTime);
            }}
          />
        </View>
      </ModalContent>
    </Modal>
  );
}

export default EditTimeModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    row: {flexDirection: 'row', justifyContent: 'space-between'},
    text: {
      fontSize: 15,
      fontFamily: fonts.medium,
      textAlign: 'justify',
      margin: 5,
      color: colors.black,
    },
  });
