import React from 'react';
import {AuthProvider} from '../context/AuthProvider';
import Routes from './Routes';
import Toast from 'react-native-toast-message';
import {ModalPortal} from 'react-native-modals';

const Providers = () => {
  return (
    <AuthProvider>
      <Routes />
      <Toast  innerRef={innerRef => Toast.setRef(innerRef)} />
      <ModalPortal />
    </AuthProvider>
  );
};

export default Providers;
