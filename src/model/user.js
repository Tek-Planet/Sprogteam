import axios from 'axios';

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
