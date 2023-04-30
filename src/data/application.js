import axios from 'axios';

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
