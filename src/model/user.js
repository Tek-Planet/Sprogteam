import axios from 'axios';
import {baseURL} from '../util/util';

export const deleteAccount = async id => {
  console.log('Delteting account for ', id);
  try {
    let res = await axios.delete(`/users/${id}`);
    console.log(res.data);
    return res.data.msg;
  } catch (err) {
    console.log(err);
    return null;
  }
};

export const sendOtp = async body => {
  try {
    const res = await axios.post(`${baseURL}/mails/otp`, body);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
