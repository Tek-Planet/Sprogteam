import axios from 'axios';

export const getClientSecretKey = async price => {
  try {
    const body = {
      amount: parseFloat(price),
    };
    const res = await axios.post(
      `/payment`,

      body,
    );
    console.log(res.data);
    return res.data;
  } catch (error) {
    console.log('stripe error', error);
    return 'error';
  }
};
