import React, {Component} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';

const ShowIndicator = props => {
  return (
    <View>
      {props.show && (
        <ActivityIndicator color={props.color} size={props.size} />
      )}
    </View>
  );
};

export default ShowIndicator;
