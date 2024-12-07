import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';
import Feather from 'react-native-vector-icons/Feather';

import {colors} from '../assets/colors';
import {useNavigation} from '@react-navigation/native';
import {fontSize, fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';

import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {useAppDispatch, useAppSelector} from '../rtk/hooks';
import {setGigState} from '../rtk/features/user/userSlice';

// import

interface HeaderProps {
  showleftIcon?: boolean;
  leftIconName?: string;
  headerTitle?: string;
  showRightIcon?: boolean;
  isProflePage?: boolean;
  showProfileImage?: boolean;
  location?: string;
  showDrawer?: boolean;
  showSort?: boolean;
  onSortClick?: () => void;
}

const Header: React.FC<HeaderProps> = ({
  showleftIcon,
  headerTitle,
  showRightIcon,
  location,
  isProflePage,
  showDrawer,
  showSort,
  onSortClick,
}) => {
  const navigation: any = useNavigation();
  const dispatch = useAppDispatch();
  const {authenticated, user} = useAppSelector(state => state.user);

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 4,
        backgroundColor: isProflePage ? colors.main : colors.background,
      }}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        {showDrawer && (
          <TouchableOpacity
            onPress={() => {
              navigation.toggleDrawer();
            }}>
            <Feather
              name="menu"
              size={22}
              color={isProflePage ? colors.white : colors.black}
              style={{marginEnd: spacing.five}}
            />
          </TouchableOpacity>
        )}

        {showleftIcon && (
          <TouchableOpacity
            onPress={() => {
              if (navigation.canGoBack()) navigation.goBack();
              else {
                dispatch(setGigState(undefined));
                navigation.replace('Tab');
              }
            }}>
            <Feather
              name="chevron-left"
              size={25}
              color={isProflePage ? colors.white : colors.black}
            />
          </TouchableOpacity>
        )}
        {headerTitle && (
          <Text
            style={{
              ...styles.headerTitle,
              color: isProflePage ? colors.white : colors.black,
              marginStart: showleftIcon ? 0 : spacing.five,
            }}>
            {headerTitle}
          </Text>
        )}
      </View>
      {showRightIcon && authenticated && (
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {location &&
            user?.Role &&
            user?.Role !== 'PrivateCustomer' &&
            !user?.interpreter && (
              <TouchableOpacity onPress={() => navigation.navigate(location)}>
                <MaterialIcons
                  name="add-circle-outline"
                  size={25}
                  color={colors.black}
                  style={{marginEnd: spacing.fiften}}
                />
              </TouchableOpacity>
            )}

          {location === 'CreateGig' && user?.interpreter && (
            <TouchableOpacity
              onPress={() => navigation.navigate('GigNav', {screen: location})}>
              <MaterialIcons
                name="add-circle-outline"
                size={25}
                color={colors.black}
                style={{marginEnd: spacing.fiften}}
              />
            </TouchableOpacity>
          )}
          <TouchableOpacity
            onPress={() => {
              navigation.navigate('Inbox');
            }}>
            <AntDesign
              name="message1"
              size={22}
              color={isProflePage ? colors.white : colors.black}
              style={{marginEnd: spacing.fiften}}
            />
          </TouchableOpacity>

          {showSort && (
            <TouchableOpacity
              onPress={() => {
                if (onSortClick) onSortClick();
              }}>
              <MaterialIcons
                name="sort"
                size={22}
                color={isProflePage ? colors.white : colors.black}
                style={{marginEnd: spacing.fiften}}
              />
            </TouchableOpacity>
          )}
          {/* <TouchableOpacity>
            <MaterialCommunityIcons
              name="bell-badge-outline"
              size={25}
              color={colors.black}
            />
          </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  sectionStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: spacing.five,
  },
  row: {flexDirection: 'row'},
  iconStyle: {
    margin: spacing.five,
  },
  image: {
    height: 40,
    width: 40,
    marginEnd: spacing.ten,
  },
  headerTitle: {
    fontSize: fontSize.medium,
    color: colors.black,
    alignSelf: 'center',
    fontFamily: fonts.bold,
  },
  text: {
    color: colors.black,
    marginLeft: spacing.ten,
    fontSize: 18,
    fontFamily: fonts.bold,
  },
});
