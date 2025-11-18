import React, {useState} from 'react';
import {Text, TouchableOpacity, View} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
import Feather from 'react-native-vector-icons/Feather';
import {spacing} from '../assets/spacing';
import moment from 'moment';
import {
  abosoluteTime,
  errorText,
  toast,
  validateDate,
  validateDateTime,
} from '../utils';

interface DatePickerProps {
  title: string;
  date: Date | undefined | 'error';
  setDate: (item: any) => void;
  mode?: 'date' | 'time' | 'datetime';
  label?: string;
  validate?: boolean;
  bookingDate?: any;
  timeType?: string;
}

const DatePicker = (props: DatePickerProps) => {
  const {title, date, setDate, mode, label, validate, bookingDate, timeType} =
    props;
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: any) => {
    // normalize the date seconds
    date = new Date(date).toISOString().replace(/\.\d+Z$/, '.000Z');

    if (validate) {
      const validatedDate: any =
        mode === 'time'
          ? bookingDate && bookingDate !== errorText && timeType
            ? validateDateTime(bookingDate, date, timeType)
            : toast('check your start time', 'error')
          : validateDate(date);
      setDate(validatedDate);
    } else {
      const ddate = abosoluteTime(date);
      setDate(ddate);
    }
    hideDatePicker();
  };

  return (
    <View style={{marginVertical: spacing.ten}}>
      {label && (
        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
            fontSize: 16,
            padding: spacing.five,
          }}>
          {label}
        </Text>
      )}
      <TouchableOpacity
        onPress={showDatePicker}
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderWidth: 1,
          padding: 10,
          paddingEnd: spacing.fiften,
          borderRadius: 30,
          borderColor: date === 'error' ? colors.red : colors.lightGray,
        }}>
        <Text
          style={{
            fontFamily: fonts.medium,
            color: colors.black,
            fontSize: 16,
            padding: spacing.five,
            opacity: 0.8,
          }}>
          {date && date !== 'error'
            ? mode === 'time'
              ? moment.utc(date).format('HH:mm')
              : moment(date).format('D/MM/YYYY')
            : title}
        </Text>

        <Feather
          name={mode && mode === 'time' ? 'clock' : 'calendar'}
          size={14}
          color={colors.black}
        />
      </TouchableOpacity>
      {date === 'error' && (
        <Text
          style={{
            fontFamily: fonts.bold,
            color: colors.red,
            paddingHorizontal: spacing.five,
          }}>
          required
        </Text>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode={mode || 'date'}
        date={date && date !== 'error' ? new Date(date) : new Date()}
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={true}
      />
    </View>
  );
};

export default DatePicker;
