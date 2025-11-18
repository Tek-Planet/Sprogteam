import React, {useState} from 'react';
import {View, Text, Image, StyleSheet, Pressable} from 'react-native';

import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';

import {useTranslation} from 'react-i18next';

import {fontSize, fonts} from '../assets/fonts';
import {colorTypes} from '../assets/colors';
import Ionicons from 'react-native-vector-icons/Ionicons';
import {
  acceptable,
  archive,
  awaiting_approval,
  booking,
  booking_d,
  create_quote,
  dollar,
  dollar_plus,
  dollar_view,
  hand_book,
  interpreter,
  language,
  logo,
  logout,
  person,
  privacy,
  quote,
  support,
} from '../assets/images';
import {spacing} from '../assets/spacing';

import Feather from 'react-native-vector-icons/Feather';
import {supportId, width} from '../utils';
import {useTheme} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../rtk/hooks';
import {logoutUser} from '../rtk/features/user/userSlice';

export function DrawerContent(props: any) {
  const {user} = useAppSelector(state => state.user);

  const {navigation} = props;
  const {t} = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const [showQuoteMenu, setShowQuoteMenu] = useState(false);
  const [showGigMenu, setShowGigMenu] = useState(false);

  const {colors} = useTheme();
  const styles = getStyles(colors);
  const iconColor = colors.main;
  const dispatch = useAppDispatch();

  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView showsVerticalScrollIndicator={false} {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{marginTop: 15}}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                }}>
                <Image
                  source={
                    user?.ProfilePicture !== 'default'
                      ? {uri: user.ProfilePicture}
                      : logo
                  }
                  style={{width: 80, height: 80, borderRadius: 100}}
                />
                <View style={{marginLeft: 15, flex: 1}}>
                  <Text style={{...styles.title}}>{user?.FirstName}</Text>
                  <Text style={{...styles.menuTitle, fontSize: 13}}>
                    {user?.Email}
                  </Text>
                </View>
              </View>
              <View style={{flexDirection: 'column'}}>
                <Text
                  style={{
                    ...styles.title,
                    fontSize: fontSize.bold,
                    paddingVertical: spacing.fiften,
                  }}>
                  {t('common:menu')}
                </Text>

                {user.Role && user.Role !== 'PrivateCustomer' && (
                  <Pressable
                    onPress={() => {
                      navigation.navigate(
                        user.interpreter ? 'Jobs' : 'OrderInterpreterAnonymous',
                      );
                    }}
                    style={styles.button}>
                    <Feather name="home" color={colors.white} size={22} />

                    <Text
                      style={{
                        ...styles.title,
                        marginStart: spacing.twenty,
                        color: colors.white,
                      }}>
                      {user.interpreter
                        ? t('common:home')
                        : t('common:order') + ' ' + t('common:interpreter')}
                    </Text>
                  </Pressable>
                )}
              </View>
            </View>
          </View>

          <View>
            {/* booking section */}
            {user.Role && user.Role !== 'PrivateCustomer' && (
              <View style={styles.wrapper}>
                <DrawerItem
                  icon={() => (
                    <Image style={styles.menuIcon} source={booking_d} />
                  )}
                  label={() => (
                    <View style={styles.menuDrawetItem}>
                      <Text style={styles.menuTitle}>
                        {t('common:booking')}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        color={iconColor}
                        size={20}
                      />
                    </View>
                  )}
                  onPress={() => {
                    setShowMenu(!showMenu);
                  }}
                />

                {showMenu && (
                  <View style={styles.subMenuView}>
                    {/* Menu Item One */}
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image style={styles.subMenuIcon} source={booking} />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:booking')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('Booking', {status: 2});
                      }}
                    />
                    {/* menu item two */}
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={awaiting_approval}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:awaiting') + ' ' + t('common:approval')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('AwaitingApproval');
                      }}
                    />

                    {/* menu item three */}
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image style={styles.subMenuIcon} source={archive} />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:archive')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('Archive');
                      }}
                    />
                  </View>
                )}
              </View>
            )}

            {/* written booking section */}
            {/* {user.Role && user.Role !== 'PrivateCustomer' && (
              <View style={styles.wrapper}>
                <DrawerItem
                  icon={() => (
                    <Image style={styles.menuIcon} source={written_trans} />
                  )}
                  label={() => (
                    <View style={styles.menuDrawetItem}>
                      <Text style={styles.menuTitle}>
                        {t('common:written') + ' ' + t('common:translation')}
                      </Text>
                      <Ionicons
                        name="chevron-down"
                        color={iconColor}
                        size={20}
                      />
                    </View>
                  )}
                  onPress={() => {
                    setShowWrittenMenu(!showWrittenMenu);
                  }}
                />

                {showWrittenMenu && (
                  <View style={styles.subMenuView}>
                 
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={written_trans}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:written') + ' ' + t('common:translation')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('Written');
                      }}
                    />
                   
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={awaiting_written}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:awaiting') + ' ' + t('common:approval')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('AwaitingWrittenTranslation');
                      }}
                    />

                
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={archive_written}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:archive')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('ArchiveWrittenTranslation');
                      }}
                    />
                  </View>
                )}
              </View>
            )} */}
            {/* interpreter handbook */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => (
                  <Image style={styles.menuIcon} source={hand_book} />
                )}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>
                      {t('common:translation_handbook')}
                    </Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('HandBook');
                }}
              />
            </View>

            {/* gig section for interpreter */}
            {user?.interpreter && (
              <View style={styles.wrapper}>
                <DrawerItem
                  icon={() => <Image style={styles.menuIcon} source={dollar} />}
                  label={() => (
                    <View style={styles.menuDrawetItem}>
                      <Text style={styles.menuTitle}>{t('common:gig')}</Text>
                      <Ionicons
                        name="chevron-down"
                        color={iconColor}
                        size={20}
                      />
                    </View>
                  )}
                  onPress={() => {
                    setShowGigMenu(!showGigMenu);
                  }}
                />

                {showGigMenu && (
                  <View style={styles.subMenuView}>
                    {/* Menu Item One */}
                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={dollar_view}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:gigs')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('Gigs');
                      }}
                    />

                    <DrawerItem
                      style={styles.subMenuDrawerItem}
                      icon={() => (
                        <Image
                          style={styles.subMenuIcon}
                          source={dollar_plus}
                        />
                      )}
                      label={() => (
                        <Text style={styles.subMenuTitle}>
                          {t('common:create_a_gig')}
                        </Text>
                      )}
                      onPress={() => {
                        navigation.navigate('GigNav', {screen: 'CreateGig'});
                      }}
                    />
                    {/* menu item two */}
                  </View>
                )}

                {/* Quote section */}
              </View>
            )}

            {/* end of gig section */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={quote} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:quote')}</Text>
                    <Ionicons name="chevron-down" color={iconColor} size={20} />
                  </View>
                )}
                onPress={() => {
                  setShowQuoteMenu(!showQuoteMenu);
                }}
              />

              {showQuoteMenu && (
                <View style={styles.subMenuView}>
                  {/* Menu Item One */}
                  <DrawerItem
                    style={styles.subMenuDrawerItem}
                    icon={() => (
                      <Image style={styles.subMenuIcon} source={quote} />
                    )}
                    label={() => (
                      <Text style={styles.subMenuTitle}>
                        {t('common:quote')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('Quote');
                    }}
                  />

                  <DrawerItem
                    style={styles.subMenuDrawerItem}
                    icon={() => (
                      <Image style={styles.subMenuIcon} source={create_quote} />
                    )}
                    label={() => (
                      <Text style={styles.subMenuTitle}>
                        {t('common:get_a_quote')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('CreateQuote');
                    }}
                  />
                  {/* menu item two */}
                  <DrawerItem
                    style={styles.subMenuDrawerItem}
                    icon={() => (
                      <Image
                        style={styles.subMenuIcon}
                        source={awaiting_approval}
                      />
                    )}
                    label={() => (
                      <Text style={styles.subMenuTitle}>
                        {t('common:awaiting') + ' ' + t('common:approval')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('QuoteAwaitingApproval');
                    }}
                  />

                  {/* menu item three */}
                  <DrawerItem
                    style={styles.subMenuDrawerItem}
                    icon={() => (
                      <Image style={styles.subMenuIcon} source={archive} />
                    )}
                    label={() => (
                      <Text style={styles.subMenuTitle}>
                        {t('common:archive')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('QuoteArchive');
                    }}
                  />
                </View>
              )}
            </View>
            {/* language manager */}
            {user?.interpreter && (
              <View style={styles.wrapper}>
                <DrawerItem
                  icon={() => (
                    <Image style={styles.menuIcon} source={interpreter} />
                  )}
                  label={() => (
                    <View style={styles.menuDrawetItem}>
                      <Text style={styles.menuTitle}>
                        {t('common:language_manager')}
                      </Text>
                    </View>
                  )}
                  onPress={() => {
                    navigation.navigate('LanguageManager');
                  }}
                />
              </View>
            )}
            {/* Acceptable behaviou */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => (
                  <Image style={styles.menuIcon} source={acceptable} />
                )}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>
                      {t('common:acceptable') + ' ' + t('common:terms')}
                    </Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('AcceptableBehaviour');
                }}
              />
            </View>
            {/* Privacy policy */}
            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={privacy} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>
                      {t('common:privacy') +
                        ' ' +
                        '&' +
                        ' ' +
                        t('common:data') +
                        ' ' +
                        t('common:policy')}
                    </Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('Privacy');
                }}
              />
            </View>

            {/* <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={contact} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:contact')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('ContactUs');
                }}
              />
            </View> */}

            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={support} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:support')}</Text>
                  </View>
                )}
                onPress={() => {
                  const user = {
                    Id: supportId,
                    FirstName: 'Support',
                    LastName: '',
                  };
                  navigation.navigate('Chats', {
                    item: user,
                  });
                }}
              />
            </View>

            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image style={styles.menuIcon} source={person} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:profile')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('Profile');
                }}
              />
            </View>

            <View style={styles.wrapper}>
              <DrawerItem
                icon={() => <Image source={language} style={styles.menuIcon} />}
                label={() => (
                  <View style={styles.menuDrawetItem}>
                    <Text style={styles.menuTitle}>{t('common:language')}</Text>
                  </View>
                )}
                onPress={() => {
                  navigation.navigate('LanguageSelector');
                }}
              />
            </View>
          </View>

          {/* submenu item */}

          <View>
            <DrawerItem
              icon={() => <Image source={logout} style={styles.menuIcon} />}
              label={() => (
                <View style={styles.menuDrawetItem}>
                  <Text style={{...styles.menuTitle, color: colors.main}}>
                    {t('common:logout')}
                  </Text>
                </View>
              )}
              onPress={async () => {
                dispatch(logoutUser());
              }}
            />
          </View>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const getStyles = (colors: colorTypes) =>
  StyleSheet.create({
    drawerContent: {
      flex: 1,
      paddingStart: spacing.ten,
    },
    userInfoSection: {
      marginTop: -5,
      padding: 10,
      paddingStart: spacing.fiften,
    },
    title: {
      fontSize: fontSize.medium,
      marginTop: 3,
      fontFamily: fonts.bold,
      color: colors.black,
    },

    button: {
      flexDirection: 'row',
      backgroundColor: colors.main,
      borderRadius: spacing.twenty * 5,
      padding: spacing.ten,
      alignItems: 'center',
      paddingStart: spacing.twenty,
    },

    menuTitle: {
      fontFamily: fonts.medium,
      fontSize: fontSize.regular,
      color: colors.black,
      opacity: 0.7,
    },

    subMenuTitle: {
      fontFamily: fonts.medium,
      fontSize: fontSize.intermediate,
      color: colors.black,
      marginLeft: -spacing.twenty,
      opacity: 0.7,
    },

    menuDrawetItem: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: width * 0.6,
      alignItems: 'center',
      marginLeft: -spacing.twenty,
    },
    subMenuView: {marginStart: spacing.twenty * 1.8},
    subMenuDrawerItem: {marginTop: -spacing.twenty + 2},
    wrapper: {marginBottom: -spacing.fiften + 2},
    subMenuIcon: {height: 18, width: 18, marginRight:spacing.fiften},
    menuIcon: {height: 20, width: 20, marginRight:spacing.fiften},
  });
