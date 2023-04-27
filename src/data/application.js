import axios from 'axios';

import AsyncStorage from '@react-native-async-storage/async-storage';

export const getMyApplications = async userId => {
  try {
    const res = await axios.get(`/myapplication/${userId}`);
    const requests = res.data.result;
    return requests;
  } catch (error) {
    console.log('Booking Request Log', error);
    return [];
  }
};
