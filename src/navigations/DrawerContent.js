import React, {useContext, useState, useEffect} from 'react';
import {View, Image, Linking, StyleSheet} from 'react-native';
import {Avatar, Title, Drawer, Text} from 'react-native-paper';
import {DrawerContentScrollView, DrawerItem} from '@react-navigation/drawer';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../context/AuthProvider';
import {useTranslation} from 'react-i18next';
import {Icon} from 'react-native-elements';
import {fonts} from '../assets/fonts';
import {colors} from '../assets/colors';
export function DrawerContent({props, navigation}) {
  const {user, logout} = useContext(AuthContext);
  const {t} = useTranslation();
  const [showMenu, setShowMenu] = useState(false);
  const iconColor = '#659ED6';
  const [image, setImage] = useState(user && user?.profile?.ProfilePicture);
  // console.log(image);
  useEffect(() => {
    setImage(user && user.profile.ProfilePicture);
  }, [user]);
  return (
    <View style={{flex: 1}}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{marginTop: 15}}>
              <Image
                source={
                  image !== undefined && image !== null && image !== 'default'
                    ? {uri: image}
                    : require('../assets/imgs/paulo.png')
                }
                style={{width: 90, height: 90, borderRadius: 100}}
                size={90}
              />

              <View style={{marginLeft: 15, flexDirection: 'column'}}>
                <Title style={styles.title}>
                  Hi {user?.profile?.FirstName}
                </Title>
              </View>
            </View>
          </View>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={() => (
                <Icon
                  type="Ionicons"
                  name="person"
                  color={iconColor}
                  size={20}
                />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('common:my_profile')}</Text>
              )}
              onPress={() => {
                navigation.navigate('OtherNav', {screen: 'General'});
              }}
            />

            <View style={styles.divider} />

            <DrawerItem
              icon={() => (
                <AntDesign name={'calendar'} color={iconColor} size={20} />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('navigate:archive')}</Text>
              )}
              onPress={() => {
                navigation.navigate('Home', {screen: 'Historic'});
              }}
            />

            <View style={styles.divider} />

            <DrawerItem
              icon={() => (
                <AntDesign name={'mail'} color={iconColor} size={20} />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('navigate:news')}</Text>
              )}
              onPress={() => {
                navigation.navigate('OtherNav', {screen: 'News'});
              }}
            />
            <View style={styles.divider} />

            <DrawerItem
              icon={() => (
                <AntDesign name={'phone'} color={iconColor} size={20} />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('common:contact')}</Text>
              )}
              onPress={() => {
                navigation.navigate('OtherNav', {screen: 'Contact'});
              }}
            />
            <View style={styles.divider} />

            <DrawerItem
              icon={() => (
                <AntDesign
                  name={!showMenu ? 'right' : 'down'}
                  color={iconColor}
                  size={20}
                />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('common:terms')}</Text>
              )}
              onPress={() => {
                setShowMenu(!showMenu);
              }}
            />
            {/* submenu item */}

            {showMenu && (
              <View style={{marginStart: 30, marginTop: -10}}>
                {/* Menu Item One */}
                <DrawerItem
                  icon={() => (
                    <MaterialIcons
                      name="privacy-tip"
                      color={iconColor}
                      size={20}
                    />
                  )}
                  label={() => (
                    <Text style={styles.menuTitle}>
                      {' '}
                      {t('common:privacy_policy')}
                    </Text>
                  )}
                  onPress={() => {
                    navigation.navigate('OtherNav', {
                      screen: 'PrivatePolice',
                    });
                  }}
                />
                {/* menu item two */}
                <DrawerItem
                  icon={() => (
                    <MaterialIcons
                      name="my-library-books"
                      color={iconColor}
                      size={20}
                    />
                  )}
                  label={() => (
                    <Text style={styles.menuTitle}>
                      {t('common:consumer_terms')}
                    </Text>
                  )}
                  onPress={() => {
                    navigation.navigate('OtherNav', {
                      screen: 'BehaviorPolice',
                    });
                  }}
                />

                {/* menu item three */}
                <DrawerItem
                  icon={() => (
                    <MaterialIcons
                      name="translate"
                      color={iconColor}
                      size={20}
                    />
                  )}
                  label={() => (
                    <Text style={styles.menuTitle}>
                      {t('common:interpreter_castle')}
                    </Text>
                  )}
                  onPress={() => {
                    navigation.navigate('OtherNav', {
                      screen: 'TranslateHandbook',
                    });
                  }}
                />
              </View>
            )}
            <View style={styles.divider} />

            {/* translator addititional Menu */}

            {user &&
              (user.profile.interpreter ||
                (user && user.profile.interpreter === true)) && (
                <View>
                  {/* gigs menu */}
                  <DrawerItem
                    icon={() => (
                      <MaterialIcons
                        name="translate"
                        color={iconColor}
                        size={20}
                      />
                    )}
                    label={() => (
                      <Text style={styles.menuTitle}>{t('common:gig')}</Text>
                    )}
                    onPress={() => {
                      navigation.navigate('Home', {screen: 'Gigs'});
                    }}
                  />
                  <View style={styles.divider} />
                  {/* add language menu */}
                  <DrawerItem
                    icon={() => (
                      <MaterialIcons
                        name="translate"
                        color={iconColor}
                        size={20}
                      />
                    )}
                    label={() => (
                      <Text style={styles.menuTitle}>
                        {t('common:language')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('OtherNav', {
                        screen: 'AddLanguage',
                        params: {email: user.profile.Id},
                      });
                    }}
                  />
                  <View style={styles.divider} />
                  {/* add skills menu */}

                  <DrawerItem
                    icon={() => (
                      <MaterialIcons
                        name="design-services"
                        color={iconColor}
                        size={20}
                      />
                    )}
                    label={() => (
                      <Text style={styles.menuTitle}>{t('common:skills')}</Text>
                    )}
                    onPress={() => {
                      navigation.navigate('OtherNav', {
                        screen: 'Skills',
                        params: {email: user.profile.Id},
                      });
                    }}
                  />
                  <View style={styles.divider} />
                  {/* add services section */}
                  <DrawerItem
                    icon={() => (
                      <MaterialIcons
                        name="work-outline"
                        color={iconColor}
                        size={20}
                      />
                    )}
                    label={() => (
                      <Text style={styles.menuTitle}>
                        {t('common:services')}
                      </Text>
                    )}
                    onPress={() => {
                      navigation.navigate('OtherNav', {
                        screen: 'ManageServices',
                        params: {email: user.profile.Id},
                      });
                    }}
                  />
                  <View style={styles.divider} />
                </View>
              )}

            {/* sub menu of song writting pallete */}

            <DrawerItem
              icon={() => (
                <AntDesign
                  name={'customerservice'}
                  color={iconColor}
                  size={20}
                />
              )}
              label={() => (
                <Text style={styles.menuTitle}>
                  {' '}
                  {t('common:about') + ' ' + t('common:us')}
                </Text>
              )}
              onPress={() => {
                Linking.openURL('https://sprogteam.dk/');
              }}
            />
            <View style={styles.divider} />

            <DrawerItem
              icon={() => (
                <AntDesign name={'setting'} color={iconColor} size={20} />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('navigate:settings')}</Text>
              )}
              onPress={() => {
                navigation.navigate('OtherNav', {screen: 'Profile'});
              }}
            />

            <View style={styles.divider} />
          </Drawer.Section>

          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={() => (
                <AntDesign name={'logout'} color={iconColor} size={20} />
              )}
              label={() => (
                <Text style={styles.menuTitle}> {t('common:logout')}</Text>
              )}
              onPress={async () => {
                await logout();
              }}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    marginTop: -5,
    padding: 10,
    paddingLeft: 20,
    borderBottomWidth: 3,
    borderColor: '#659ED6',
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontFamily: fonts.bold,
    color: colors.black,
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
    color: colors.white,
  },
  row: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  section: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  paragraph: {
    fontWeight: 'bold',
    marginRight: 3,
  },

  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: colors.main,
    borderTopWidth: 1,
  },
  preference: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  menuTitle: {
    fontSize: 13,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  meneIcon: {backgroundColor: 'transparent', marginTop: -7},
  horizontalLine: {
    height: 20,
    backgroundColor: colors.main,
    width: 2,
    margin: 10,
  },
  baseMenuText: {
    fontFamily: fonts.light,
    fontSize: 12,
    color: colors.black,
  },
  drawerSection: {
    alignContent: 'center',
  },
  divider: {
    height: 1,
    width: '75%',
    backgroundColor: colors.main,
    alignSelf: 'flex-end',
  },
});
