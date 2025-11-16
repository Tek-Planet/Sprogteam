import * as React from 'react';
import {Text, View, StyleSheet, Image, ScrollView} from 'react-native';
import {colors} from '../assets/colors';
import {fonts} from '../assets/fonts';
import {spacing} from '../assets/spacing';
import {UserModel} from '../types';
import {useTranslation} from 'react-i18next';
import {gender, location, translator, user} from '../assets/images';
import moment from 'moment';
import {
  useGetTranlatorLanguagesQuery,
  useGetTranlatorSkillsQuery,
} from '../rtk/services';

interface UserCardItemProps {
  item: UserModel;
}

const UserCardItem = (props: UserCardItemProps) => {
  const {item} = props;
  const {t} = useTranslation();
  const userId = item.Id ? item.Id : item.userId;
  const email = item.Email;
  // fetch list of language
  const {data} = useGetTranlatorLanguagesQuery(
    {userId, email},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // fetch list of skills
  const {data: skills} = useGetTranlatorSkillsQuery(
    {userId, email},
    {
      refetchOnMountOrArgChange: true,
    },
  );

  // console.log(skills);
  return (
    <View style={styles.cardItem}>
      <View style={{marginVertical: spacing.twenty}}>
        {/* gender */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} resizeMode="contain" source={gender} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:gender')}
            </Text>
            <Text style={styles.text}>
              {item?.GenderId === 0 ? 'Female' : 'Male'}
            </Text>
          </View>
        </View>
        {/* about section */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} resizeMode="contain" source={user} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:about')}
            </Text>
            <Text style={{...styles.text, fontSize: 13}}>{item?.About}</Text>
          </View>
        </View>
        {/* from */}
        <View style={styles.itemView}>
          <Image
            style={styles.itemIcon}
            resizeMode="contain"
            source={location}
          />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:from')}
            </Text>
            <Text style={styles.text}>
              {item?.Zipcode && item.Zipcode + ' '}
              {item?.City && item.City + ' '}
              {item?.State && item.State + ' '}
              {item?.Country}
            </Text>
          </View>
        </View>
        {/* about */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} resizeMode="contain" source={user} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:member')}
            </Text>
            <Text style={{...styles.text, fontSize: 13}}>
              {moment(item.CreateAt).format('MMMM Do YYYY')}
            </Text>
          </View>
        </View>
        {/* language list */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} source={translator} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:language')}
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginEnd: 10,
              }}
              showsHorizontalScrollIndicator={false}>
              {data &&
                data?.map((item, index) => {
                  return (
                    <Text key={index.toString()} style={styles.info}>
                      {item.label.trim()}
                      {data.length - 1 !== index && ','}
                    </Text>
                  );
                })}
            </ScrollView>
          </View>
        </View>

        {/* skills list */}
        <View style={styles.itemView}>
          <Image style={styles.itemIcon} source={translator} />
          <View>
            <Text style={{...styles.text, opacity: 0.6}}>
              {t('common:skills')}
            </Text>
            <ScrollView
              contentContainerStyle={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginEnd: 10,
              }}
              showsHorizontalScrollIndicator={false}>
              {skills &&
                skills?.map((item, index) => {
                  return (
                    <Text key={index.toString()} style={styles.info}>
                      {item.label.trim()}
                      {skills.length - 1 !== index && ','}
                    </Text>
                  );
                })}
            </ScrollView>
          </View>
        </View>
      </View>
    </View>
  );
};

export default UserCardItem;

const styles = StyleSheet.create({
  cardItem: {
    padding: spacing.ten,
    margin: spacing.five - 2,
  },

  text: {
    fontSize: 14,
    fontFamily: fonts.medium,
    color: colors.black,
  },
  itemView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: spacing.ten,
  },
  itemIcon: {height: 15, width: 15, marginEnd: spacing.ten},
  info: {
    color: colors.black,
    margin: 5,
    fontFamily: fonts.medium,
  },
});
