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

// file
export const uploadDocument = async image => {
  var fileUrl = null;
  try {
    const imageData = {
      uri: image.path,
      name: image?.filename,
      type: 'image/jpeg',
      originalname: image?.filename,
    };

    const res = await axios.post(`${baseURL}/auth/upload`, imageData);
    // console.log(res.data);

    if (res.data.code === 200) {
      fileUrl = res.data.url;
    }
    return fileUrl;
  } catch (error) {
    console.log(error);
    return fileUrl;
  }
};
