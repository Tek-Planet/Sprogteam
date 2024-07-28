import 'react-native-gesture-handler';

import React from 'react';

import Providers from './src/navigations/Providers';
import {LogBox} from 'react-native';

LogBox.ignoreAllLogs(true);

const App = () => {
  return <Providers />;
};

export default App;
