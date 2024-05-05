import React from 'react';
import {View, Text, FlatList} from 'react-native';

import {useTranslation} from 'react-i18next';
import {CustomLoader, GigList, Header} from '../../components';
import {useGetGigsQuery} from '../../rtk/services';
import {TabParams} from '../../navigations/ClientNavigation';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {BottomTabScreenProps} from '@react-navigation/bottom-tabs';
import {CompositeScreenProps, useNavigation} from '@react-navigation/native';
import {RootStackParams} from '../../navigations/MainNavigation';
import {spacing} from '../../assets/spacing';

// type Props = BottomTabScreenProps<TabParams>;

type Props = CompositeScreenProps<
  NativeStackScreenProps<RootStackParams, 'Tab'>,
  BottomTabScreenProps<TabParams, 'Gigs'>
>;

const GigsScreen = () => {
  const {t} = useTranslation();
  const navigation: any = useNavigation();

  const {data, error, isLoading} = useGetGigsQuery('', {
    refetchOnMountOrArgChange: true,
  });

  return (
    <View style={{flex: 1, backgroundColor: '#fff'}}>
      <Header
        location="CreateGig"
        headerTitle={t('common:gig')}
        showRightIcon
      />
      {isLoading && <CustomLoader />}
      {/* {data?.length === 0 && !isLoading && <CustomEmptyList />} */}

      <FlatList
        contentContainerStyle={{margin: spacing.ten, paddingBottom: 20}}
        keyExtractor={item => item.ID.toString()}
        data={data ? data : []}
        renderItem={({item, index}) => {
          // console.log(item.request);
          return (
            <GigList
              item={item}
              onPress={() => {
                navigation.navigate('GigNav', {
                  screen: 'GigManager',
                  params: {
                    item: item,
                  },
                });
              }}
            />
          );
        }}
      />
    </View>
  );
};

export default GigsScreen;
