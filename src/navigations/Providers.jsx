import React from 'react';
import Routes from './Routes';

import {Provider} from 'react-redux';
import {store} from '../rtk';

import Toast from 'react-native-toast-message';

const Providers = () => {
  return (
    <Provider store={store}>
      <Routes />
      <Toast innerRef={innerRef => Toast.setRef(innerRef)} />
    </Provider>
  );
};

export default Providers;
