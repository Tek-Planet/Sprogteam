import {NativeModules} from 'react-native';

const {NotificationHelper} = NativeModules;

const areNotificationsEnabled = () => {
  return new Promise((resolve, reject) => {
    NotificationHelper.areNotificationsEnabled(enabled => {
      resolve(enabled);
    });
  });
};

const openNotificationSettings = () => {
  NotificationHelper.openNotificationSettings();
};

export {areNotificationsEnabled, openNotificationSettings};
