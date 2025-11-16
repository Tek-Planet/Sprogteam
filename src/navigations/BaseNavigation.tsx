import React from 'react';

import {useAppSelector} from '../rtk/hooks';
import {AuthNavigation, MainNavigation} from '.';

const BaseNavigation = () => {
  const {authenticated} = useAppSelector(state => state.user);

  if (!authenticated) return <AuthNavigation />;
  return <MainNavigation />;
};

export default BaseNavigation;
