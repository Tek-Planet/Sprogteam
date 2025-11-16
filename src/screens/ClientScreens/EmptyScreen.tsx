import {View, Text} from 'react-native';
import React from 'react';

type Props = {};

const EmptyScreen = (props: Props) => {
  return <View style={{flex: 1, backgroundColor: 'gray', opacity: 0.4}}></View>;
};

export default EmptyScreen;
