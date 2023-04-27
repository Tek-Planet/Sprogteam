import React, {useState, useContext} from 'react';
import {View, Image} from 'react-native';

import TitleHeader from '../../components/TitleHeader';
import Button from '../../components/Button';
import Indicator from '../../components/ActivityIndicator';
import ErrorMsg from '../../components/ErrorMsg';
import {AuthContext} from '../../context/AuthProvider';
import {useTranslation} from 'react-i18next';

import ProfileHeader from '../../components/ProfileHeader';
import {colors} from '../../assets/colors';
import {deleteaccount} from '../../assets/icons';
import {deleteAccount} from '../../model/user';

const DeleteAccountScreen = () => {
  const {user, logout, userName} = useContext(AuthContext);
  const {t} = useTranslation();
  // console.log(user.profile.Email);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [accountDeleted, setAccountDeleted] = useState(false);

  const deleteMyAccount = async () => {
    setLoading(true);
    var res = await deleteAccount(user.profile.Email);
    if (res === 'deleted') {
      setAccountDeleted(true);
      setTimeout(async () => {
        await logout();
      }, 1500);
    } else {
      setError(
        'Unable to delete your account, please contact admin for assistance',
      );
      setLoading(false);
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      {accountDeleted ? (
        <View
          style={{
            alignItems: 'center',
            justifyContent: 'center',
            marginTop: 50,
          }}>
          <Image
            style={{
              height: 100,
              width: 100,
              margin: 20,
            }}
            source={deleteaccount}
          />
          <TitleHeader title={t('Your account has been deleted')} />
        </View>
      ) : (
        <View>
          <ProfileHeader name={'Account Deletion'} />
          <View
            style={{
              margin: 10,
              marginTop: 30,
              alignItems: 'center',
              padding: 20,
            }}>
            <Image
              style={{
                height: 100,
                width: 100,
                margin: 20,
              }}
              source={deleteaccount}
            />
            <TitleHeader
              title={t(
                'Your account information will be deleted from our database and this process is irreversible',
              )}
            />

            <View style={{margin: 20}}>
              {error !== null && <ErrorMsg error={error} />}
              {loading ? (
                <Indicator color={colors.red} show={loading} size={'large'} />
              ) : (
                <Button
                  onPress={() => deleteMyAccount()}
                  bGcolor={colors.red}
                  buttonTitle={t('common:confirm') + ' ' + t('common:detetion')}
                />
              )}
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default DeleteAccountScreen;
