import React, {useContext} from 'react';
import MajorNavigation from './MajorNavigation';
import AuthNavigation from './AuthNavigation';
import {AuthContext} from '../context/AuthProvider';

const OtherStackScreen = () => {
  const {auth} = useContext(AuthContext);
  if (!auth) return <AuthNavigation />;
  else return <MajorNavigation />;
};

export default OtherStackScreen;
