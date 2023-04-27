import React, {Component} from 'react';
import {Platform, View} from 'react-native';
import DateTimePicker from 'react-native-modal-datetime-picker';
import moment from 'moment';
import {offsetCalculator} from '../util/util';

export default class Calendar extends Component {
  _isMounted = false;
  constructor(props) {
    super(props);
    this.state = {
      isDateTimePickerVisible: false,
    };
  }

  showDateTimePicker = () => {
    this.setState({
      isDateTimePickerVisible: this.props.isDateTimePickerVisible,
    });
    // console.log('inout ', this.props.isDateTimePickerVisible);
  };

  componentWillUnmount() {
    this._isMounted = false;
  }

  componentDidMount() {
    this.setState = (state, callback) => {
      return;
    };
  }

  hideDateTimePicker = () => {
    this.setState({isDateTimePickerVisible: false});
    this.props.calendarEvents(false, 'cancel');

    // this.props.calendarEvents(false, 'false');
  };

  handleDatePicked = date => {
    if (this.props.mode === 'date') {
      const selectedDate = date; // replace with the actual selected date
      selectedDate.setHours(
        selectedDate.getHours() - selectedDate.getTimezoneOffset() / 60,
      );
    }
    console.log(moment(date));
    let offset = offsetCalculator();

    this.props.calendarEvents(
      false,
      this.props.mode === 'date'
        ? date
        : offset > 0
        ? moment(date).add(offset, 'h')
        : moment(date).subtract(-1 * offset, 'h'),
    );

    // this.props.calendarEvents(false, date);
  };

  render() {
    return (
      <View>
        <DateTimePicker
          isVisible={this.props.isDateTimePickerVisible}
          onConfirm={this.handleDatePicked}
          onCancel={this.hideDateTimePicker}
          mode={this.props.mode}
          // is24Hour={true}
        />
      </View>
    );
  }
}
