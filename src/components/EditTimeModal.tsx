import React, {useEffect, useState} from 'react';
import {
  View,
  StyleSheet,
  Text,
  Modal,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme} from '@react-navigation/native';
import {useTranslation} from 'react-i18next';

import {fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
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
  const {colors} = useTheme();
  const styles = getStyles(colors);

  const [date, setDate] = useState<Date | undefined | string>(
    item.DateTimeStart,
  );
  const [startTime, setStartTime] = useState<Date | undefined | string>(
    new Date(
      mergeDateTime(new Date(), item.DateTimeStart, item.DateTimeEnd).startTime,
    ),
  );
  const [endTime, setEndTime] = useState<Date | undefined | 'error'>(undefined);
  const [duration, setDuration] = useState<string>();
  const [price, setPrice] = useState<string>();
  const [priceCustomer, setPriceCustomer] = useState<string>();
  const [erroMessage, setErrorMessage] = useState<string>('');

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
        const timeVariant: any = await msToTime(timeDifInMillsec);
        setDuration(timeVariant.duration);

        let defaultPriceCustomer, defaultPriceTranslator;
        const taskTypeId = item.TaskTypeId;

        if (taskTypeId === 2 || taskTypeId === 3) {
          defaultPriceCustomer = userDetails.VideoPhoneprice ?? 320;
          defaultPriceTranslator = user.Phonevideo ?? 160;
        } else {
          defaultPriceCustomer = userDetails.AttendancePrice ?? 320;
          defaultPriceTranslator = user.Attendance ?? 160;
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
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}>
      <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
        <View style={styles.overlay}>
          <View style={styles.modalView}>
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
              <Text style={styles.text}>{duration}</Text>
            </View>

            {/* Uncomment if price display is needed */}
            {/* <View style={styles.row}>
              <Text style={[styles.text, {opacity: 0.6}]}>
                {t('common:price')}:
              </Text>
              <Text style={styles.text}>{price && price + ' kr'}</Text>
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
                const mergedDate = mergeDateTime(
                  item.DateTimeStart,
                  item.DateTimeStart,
                  endTime,
                );
                onSubmit(mergedDate.endTime);
              }}
            />
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

export default EditTimeModal;

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalView: {
      width: width * 0.9,
      maxHeight: height * 0.9,
      backgroundColor: 'white',
      borderRadius: 20,
      padding: 20,
      shadowColor: '#000',
      shadowOffset: {width: 0, height: 2},
      shadowOpacity: 0.25,
      shadowRadius: 4,
      elevation: 5,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 10,
    },
    text: {
      fontSize: 15,
      fontFamily: fonts.medium,
      textAlign: 'justify',
      margin: 5,
      color: colors.black,
    },
  });
``