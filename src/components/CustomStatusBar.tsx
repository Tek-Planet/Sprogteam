import * as React from 'react';
import {StyleSheet, SafeAreaView, StatusBar, Platform} from 'react-native';
import {colors} from '../assets/colors';
import {useAppSelector} from '../rtk/hooks';

interface CustomStatusBarProps {
  theme?: string;
}

const STATUSBAR_HEIGHT = Platform.OS === 'ios' ? 20 : StatusBar.currentHeight;

const CustomStatusBar = (props: CustomStatusBarProps) => {
  // console.log(props.theme);
  const {currentRoute} = useAppSelector(state => state.user);

  return (
    <SafeAreaView
      style={{
        backgroundColor:
          currentRoute === 'Profile' || currentRoute === 'Chats'
            ? colors.main
            : colors.white,
        height: STATUSBAR_HEIGHT,
      }}>
      <StatusBar
        translucent
        barStyle={
          currentRoute === 'Profile' || currentRoute === 'Chats'
            ? 'light-content'
            : 'dark-content'
        }
        backgroundColor={
          currentRoute === 'Profile' || currentRoute === 'Chats'
            ? colors.main
            : colors.white
        }
      />
    </SafeAreaView>
  );
};

export default CustomStatusBar;

const styles = StyleSheet.create({
  container: {},
});
