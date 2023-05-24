import React, {useState, useCallback, useEffect, useContext} from 'react';
import {
  GiftedChat,
  Bubble,
  Send,
  InputToolbar,
  Time,
} from 'react-native-gifted-chat';
import {
  View,
  StyleSheet,
  Image,
  Alert,
  Text,
  TouchableOpacity,
  Platform,
  PermissionsAndroid,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import axios from 'axios';
import {AuthContext} from '../context/AuthProvider';
import uuid from 'react-native-uuid';

import DocumentPicker from 'react-native-document-picker';
import RNFetchBlob from 'rn-fetch-blob';
// const Blob = RNFetchBlob.polyfill.Blob;

import {BottomSheet} from 'react-native-elements';
import ImagePicker from 'react-native-image-crop-picker';
import {fonts} from '../assets/fonts';
import ImageViewer from 'react-native-image-zoom-viewer';
import {
  baseURL,
  checkStoragePermission,
  isCustomer,
  requestStoragePermission,
  toastNew as toast,
} from '../util/util';
import {addChat, getBooking, getChats, getInbox} from '../data/data';
import io from 'socket.io-client';
import {
  ActivityIndicator,
  ProfileHeader,
  MiniBooking,
  Button,
} from '../components';
// import OfferBottomSheet from '../components/OfferBottomSheet';
import {useTranslation} from 'react-i18next';

// import {CircularSlider} from 'react-native-elements-universe';

export function ChatScreen({navigation, route}) {
  const {
    user,
    setInbox,
    setReload,
    reloadInbox,
    setReloadInbox,
    isInterpreter,
  } = useContext(AuthContext);
  const {t} = useTranslation();

  const {info, type, inboxID} = route.params;
  let socket;

  const [isVisible, setIsVisible] = useState(false);
  const [isVisibleOffer, setIsVisibleOffer] = useState(false);
  const [loadingProfile, setLoadingProfile] = useState(false);
  const [transInfo, setTransInfo] = useState(null);
  const [userId, setuserId] = useState(info.Id);

  let inboxId = type === 1 ? uuid.v4() : inboxID;

  // let newInboxId =  type === 1 ? uuid.v4() : inboxID;

  const [uploading, setUploading] = useState(false);
  const [initializing, setInitializing] = useState(true);

  const [messages, setMessages] = useState([]);
  const [showImageViewer, setShowImageViewer] = useState(false);
  const [images, setImages] = useState([]);

  const openImageViewer = imgs => {
    setShowImageViewer(true);
    setImages(imgs);
  };

  const renderHeader = () => {
    return (
      <View
        style={{
          marginTop: 50,
          marginHorizontal: 30,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}>
        <Ionicons
          name="arrow-back-circle"
          size={30}
          color="#fff"
          onPress={() => {
            setShowImageViewer(false);
          }}
          style={{
            borderRadius: 100,
            margin: 5,
          }}
        />

        <Ionicons
          name="download"
          size={30}
          color="#fff"
          onPress={() => {
            const url =
              images[0].media === 'image' ? images[0].url : images[0].docUrl;
            checkStoragePermission(url);
            console.log('Some Url', url);
          }}
          style={{
            borderRadius: 100,
            margin: 5,
          }}
        />
      </View>
    );
  };

  const renderMessageImage = props => {
    const img = [
      {
        // Simplest usage.
        url:
          props.currentMessage.media === 'image'
            ? props.currentMessage.image
            : 'https://sprogteamdev.blob.core.windows.net/writtentask/7437581234013801-IMG_0009.PNG',

        name: props.currentMessage.name,
        media: props.currentMessage.media,
        docUrl: props.currentMessage.image,
        // You can pass props to <Image />.
        props: {},
      },
    ];

    return (
      <TouchableOpacity onPress={() => openImageViewer(img)}>
        <Image
          source={
            props.currentMessage.media === 'image'
              ? {uri: props.currentMessage.image}
              : require('../assets/imgs/documents.png')
          }
          style={
            props.currentMessage.media === 'image'
              ? {height: 150, width: 200}
              : {height: 100, width: 100}
          }
          resizeMode={'cover'}
        />
      </TouchableOpacity>
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    // setRead();
    // socket = io('https://aatsapi.herokuapp.com');
    // fetchData(); 127.0.0.
    // socket = io('http://127.0.0.1:3000');

    socket = io(baseURL);

    socket.emit('joinRoom', {inboxId});

    socket.on('chat message', msg => {
      // console.log(msg);s
      // setMessages(messages => [...messages, msg]);
      // console.log(msg.user._id);
      if (msg.user._id !== user.profile.Id) {
        setMessages(previousMessages =>
          GiftedChat.append(previousMessages, msg),
        );
      }
      // refresh the inbox
      refreshInbox();
      // reload bookinf if the message isa type of offer
      if (msg.isOffer && msg.isOffer !== null) setReload(true);
    });

    // let secTimer = setInterval(() => {
    //   fetchData();
    // }, 1000);
    // return () => cleanup;

    getUserInfo();
  }, []);

  // send the booking Id as message after booking
  useEffect(() => {
    if (route.params?.newMsg) {
      onSend(route.params?.newMsg);
    }
  }, [route.params?.newMsg]);

  const getUserInfo = async () => {
    try {
      const res = await axios.get(`/users/${userId}`);
      setTransInfo(res.data.result);
    } catch (error) {
      console.log(error);
    }
  };

  const refreshInbox = () => {
    if (!reloadInbox) {
      setReloadInbox(true);
    }
  };

  const fetchData = async () => {
    try {
      let localInboxId = inboxId;
      if (type === 1) {
        const res = await addUserToInbox();

        localInboxId = res.inboxId;
        if (res.msg === 'success') {
          const inboxRes = await getInbox(user.profile.Id);
          setInbox(inboxRes);
        }
      }

      const res = await getChats(localInboxId);
      setMessages(res);
      setInitializing(false);

      inboxId = localInboxId;
      setRead(localInboxId);
      // console.log(res);

      // get token of the receriverId
    } catch (error) {
      console.log(error);
      setReloadInbox(false);
    }
  };

  const choosePhotoFromLibrary = async () => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        alert('You need to enable storage permission to continue');
        return;
      }
    }
    ImagePicker.openPicker({
      width: 500,
      height: 500,
    })
      .then(async image => {
        // const imageUri = image.path;
        console.log(image);
        // postImageOperation(imageUri);
        // const absoluitePath = await RNFetchBlob.fs.stat(image.path);
        const path = await normalizePath(image.path);

        const pathToBase64 = await RNFetchBlob.fs.readFile(path, 'base64');

        const imageData = {
          path: pathToBase64,
          filename:
            image.filename && image.filename !== undefined
              ? image.filename
              : new Date().getTime().toString(),
          type: image.mime,
        };

        // console.log('Image', image);

        uploadChatImage(imageData, 'image');
        //Users/tek/Library/Developer/CoreSimulator/Devices/7F2D0AA8-00B6-401D-BB88-FAB951F9F558/data/Containers/Data/Application/BCA419D4-CD71-4CA3-9B21-2C392B795AD1/tmp/react-native-image-crop-picker/0AA21994-2576-4775-A4BF-C023939F4855.jpg
        //Users/tek/Library/Developer/CoreSimulator/Devices/7F2D0AA8-00B6-401D-BB88-FAB951F9F558/data/Containers/Data/Application/BCA419D4-CD71-4CA3-9B21-2C392B795AD1/tmp/react-native-image-crop-picker/0AA21994-2576-4775-A4BF-C023939F4855.jpg", "size": 56668, "sourceURL": "file:///Users/tek/Library/Developer/CoreSimulator/Devices/7F2D0AA8-00B6-401D-BB88-FAB951F9F558/data/Media/DCIM/100APPLE/IMG_0007.JPG
      })
      .catch(err => {
        Alert.alert(err.message);
        console.log(err);
        setUploading(false);
      });
  };

  const uploadChatImage = async (image, docType) => {
    setUploading(true);
    const imageData = {
      uri: image.path,
      name: image.filename,
      type: 'image/jpeg',
      originalname: image.filename,
    };

    // console.log(imageData);

    try {
      const res = await axios.post('/chats/upload', imageData);
      // console.log(res.data);

      if (res.data.code === 200) {
        const msg = [
          {
            image: res.data.url,
            name: res.data.name,
            media: docType,
          },
        ];
        setIsVisible(false);
        setUploading(false);

        await onSend(msg);
      } else {
        setIsVisible(false);
        setUploading(false);
        toast('unble to send file', 'error');
      }
    } catch (error) {
      console.log(error);
      setIsVisible(false);
      setUploading(false);
      toast(error.message, 'error');
    }
    // setIsVisible(false);
    // setUploading(false);
  };

  // document picker function
  const chooseDocument = async docType => {
    if (Platform.OS === 'android') {
      const hasPermission = await requestStoragePermission();
      if (!hasPermission) {
        alert('You need to enable storage permission to continue');
        return;
      }
    }

    try {
      const file = await DocumentPicker.pick({
        type: [
          DocumentPicker.types.allFiles,
          // DocumentPicker.types.txt,
        ],
      });
      let localfile;
      if (Array.isArray(file)) localfile = file[0];
      else localfile = file;

      // get absolurte path

      const path = await normalizePath(localfile.uri);

      const pathToBase64 = await RNFetchBlob.fs.readFile(path, 'base64');

      const image = {
        path: pathToBase64,
        filename: localfile.name,
      };

      //  console.log (image)
      uploadChatImage(image, 'doc');
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User cancelled the picker, exit any dialogs or menus and move on
      } else {
        throw err;
      }
    }
  };

  const normalizePath = async path => {
    if (Platform.OS === 'ios' || Platform.OS === 'android') {
      const filePrefix = 'file://';
      if (path.startsWith(filePrefix)) {
        path = path.substring(filePrefix.length);
        try {
          path = decodeURI(path);
        } catch (error) {
          console.log(error);
        }
      }
    }
    return path;
  };

  const onSend = useCallback((msg = []) => {
    const text = msg[0].text && msg[0].text !== null ? msg[0].text : null;

    //console.log(msg)

    const newMsg = {
      _id: uuid.v4(),
      text,
      image: msg[0].image && msg[0].image !== null ? msg[0].image : null,
      name: msg[0].name && msg[0].name !== null ? msg[0].name : null,
      media: msg[0].media && msg[0].media !== null ? msg[0].media : null,
      isOffer:
        msg[0].isOffer && msg[0].isOffer !== null ? msg[0].isOffer : null,
      createdAt: new Date().toISOString(),
      user: {
        _id: user.profile.Id,
        name: user.profile.FirstName,
      },

      channelId: inboxId,
    };

    // console.log(newMsg.user._id);

    // socket.emit('chat message', newMsg);

    setMessages(previousMessages =>
      GiftedChat.append(previousMessages, newMsg),
    );

    const body = {
      userId: userId,
      title: 'new message from ' + user.profile.FirstName,
      text,
      info: {
        Id: userId,
        type: '2',
        FirstName: info.FirstName,
        inboxID: inboxID,
      },
    };

    socket.emit('chat message', newMsg, inboxId, body);

    addChatFb(newMsg);

    refreshInbox();
    // console.log(reloadInbox);

    // sendNotificaion(text);

    // setIsVisible(false);
  }, []);

  function renderInputToolbar(props) {
    //Add the extra styles via containerStyle
    return (
      <InputToolbar
        {...props}
        containerStyle={{
          // borderRadius: 50,
          backgroundColor: '#D4D4D4',
        }}></InputToolbar>
    );
  }
  const renderTime = props => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          left: {
            color: 'black',
          },
          right: {
            color: 'black',
          },
        }}
      />
    );
  };

  const renderCustom = props => {
    const {currentMessage} = props;

    const {isOffer} = currentMessage;

    return (
      <View>
        {isOffer ? (
          <View
            style={{
              width: 200,
              backgroundColor: '#D4D4D4',
              borderRadius: 10,
              padding: 10,
              alignContent: 'center',
              justifyContent: 'center',
              flex: 1,
            }}>
            <Text
              style={[styles.offertext, {color: '#000', textAlign: 'center'}]}>
              Booking ID:{'\n'}
              {currentMessage.text}
            </Text>

            {loadingProfile ? (
              <ActivityIndicator show={loadingProfile} color={'red'} />
            ) : (
              <Button
                buttonTitle={t('common:details')}
                onPress={() => {
                  decideResponse(currentMessage.text, currentMessage.user._id);
                }}
              />
            )}
          </View>
        ) : (
          <Bubble
            {...props}
            wrapperStyle={{
              right: {
                //the background color for the bubble
                backgroundColor: '#D4D4D4',
                alignItems: 'center',
                textAlign: 'center',
              },
              left: {
                //the background color for the bubble
                backgroundColor: '#659ED6',
              },
            }}
            textStyle={{
              right: {
                color: '#000',
                textAlign: 'justify',
              },
              left: {
                color: '#fff',
                textAlign: 'justify',
              },
            }}
          />
        )}
      </View>
    );
  };

  const decideResponse = async (id, owner) => {
    setLoadingProfile(true);
    try {
      const res = await getBooking(id);
      console.log(res);
      if (res === null) {
        toast('Unable to fetch booking details', 'error');
        return;
      }
      setLoadingProfile(false);
      if (user.profile.Id === owner) {
        if (
          (res.OfferStage === 'initial' || res.OfferStage === 'negotiating') &&
          res.IsBookingCompleted === 2
        ) {
          navigation.navigate('BookingResponse', {
            item: res,
            path: 'ChatScreen',
          });
        } else {
          navigation.navigate('OtherNav', {
            screen: 'BookingDetails',
            params: {item: res},
          });
        }
      } else {
        if (
          (res.OfferStage === 'initial' || res.OfferStage === 'negotiating') &&
          res.IsBookingCompleted === 1
        ) {
          navigation.navigate('BookingResponse', {
            item: res,
            path: 'ChatScreen',
          });
        } else {
          navigation.navigate('OtherNav', {
            screen: 'BookingDetails',
            params: {item: res},
          });
        }
      }
    } catch (error) {
      setLoadingProfile(false);
      console.log(error);
    }

    // console.log(res);
  };

  // add user to inbox
  const addUserToInbox = async () => {
    const newUser = {
      Id: inboxId,
      ChatUserOne: user.profile.Id,
      ChatUserTwo: userId,
    };

    try {
      const res = await axios.post(`/messages`, newUser);
      // console.log(res.data);
      return res.data;
    } catch (error) {
      console.log(error);
      setReloadInbox(false);
    }
    // .then(res => {
    //   console.log('user added to inbox ', res.data.msg);
    // })
    // .catch(err => {
    //   setInboxId(newUser.inboxId);
    //   console.log(err);
    // });
  };

  const addChatFb = async msg => {
    await addChat(msg);
  };

  const setRead = async ChannelId => {
    try {
      const body = {
        ChannelId,
        SenderId: user.profile.Id,
      };

      const res = await axios.put(`/messages/read`, body);
      // console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  const renderSends = props => {
    return (
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Send {...props}>
          <View
            style={{
              margin: 5,
              // marginBottom: 10,
            }}>
            <Ionicons name="send" size={25} color="#659ED6" />
          </View>
        </Send>

        <TouchableOpacity
          onPress={async () => {
            // if (type === 2 && transInfo === null) {
            //   toast('Loading Translator Profile Please wait', 'info');
            //   return;
            // }
            setIsVisible(true);
          }}
          style={{
            margin: 5,
            marginTop: 10,
          }}>
          <Ionicons name="attach" size={30} color="#659ED6" />
        </TouchableOpacity>
      </View>
    );
  };

  const bottomSheet = () => {
    return (
      <BottomSheet
        isVisible={isVisible}
        containerStyle={{
          backgroundColor: '#2D3134',
          marginTop: 500,
          justifyContent: 'flex-end',
        }}>
        {!uploading ? (
          <View>
            <View style={styles.headerBG}>
              <Ionicons
                name="close"
                size={23}
                color="#E43F5A"
                onPress={() => {
                  setIsVisible(false);
                }}
                style={{
                  position: 'absolute',
                  right: 5,
                  backgroundColor: '#fff',
                  borderRadius: 100,
                  margin: 5,
                }}
              />
            </View>
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-evenly',
              }}>
              <TouchableOpacity
                style={styles.options}
                onPress={() => {
                  choosePhotoFromLibrary();
                }}>
                <View style={[styles.rounIcon, {backgroundColor: '#D3396D'}]}>
                  <Ionicons name="camera" size={25} color="#fff" />
                </View>

                <Text style={styles.text}>Gallery</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.options}
                onPress={() => chooseDocument('doc')}>
                <View style={styles.rounIcon}>
                  <Ionicons name="document-outline" size={25} color="#fff" />
                </View>

                <Text style={styles.text}>Document</Text>
              </TouchableOpacity>
            </View>
          </View>
        ) : (
          <View style={{alignItems: 'center'}}>
            {/* <CircularSlider noThumb /> */}
            <ActivityIndicator
              size={'large'}
              show={uploading}
              color={'#659ED6'}
            />
            <Text style={[styles.text, {marginTop: 10}]}>
              Uploading file please wait
            </Text>
          </View>
        )}
      </BottomSheet>
    );
  };

  // shows quick offer page
  if (isVisibleOffer) {
    return (
      <MiniBooking
        onSend={onSend}
        setIsVisibleOffer={setIsVisibleOffer}
        info={isCustomer(user) ? (type === 2 ? transInfo : info) : user.profile}
        deviceId={userId}
        route={route}
        customerInfo={transInfo}
      />
    );
  }
  if (showImageViewer) {
    return (
      <ImageViewer
        renderHeader={renderHeader}
        onCancel={() => console.log('canelled')}
        imageUrls={images}
        useNativeDriver={true}
      />
    );
  }
  return (
    <View style={styles.container}>
      <ProfileHeader navigation={navigation} name={info.FirstName} />
      {initializing ? (
        <ActivityIndicator
          show={initializing}
          size={'large'}
          color={'#659ED6'}
        />
      ) : (
        <View style={{flex: 1}}>
          <GiftedChat
            textInputProps={{
              color: '#000',
            }}
            messages={messages}
            onSend={msg => {
              onSend(msg);
            }}
            user={{
              _id: user.profile.Id,
              name: user.profile.FirstName,
            }}
            renderInputToolbar={renderInputToolbar}
            renderMessageImage={renderMessageImage}
            // renderCustomView={renderCustom}
            renderSend={renderSends}
            renderBubble={renderCustom}
            renderTime={renderTime}
            alignTop
            showUserAvatar
            renderAvatar={null}
            placeholder={'Skriv her ..'}
          />
          {/* <OfferBottomSheet
            isVisibleOffer={isVisibleOffer}
            setIsVisibleOffer={setIsVisibleOffer}
            language={languages}
          /> */}
          {
            <TouchableOpacity
              onPress={() => {
                setIsVisibleOffer(true);
              }}
              style={{
                height: 30,
                backgroundColor: '#D4D4D4',
                flexDirection: 'row',
                alignItems: 'center',
                paddingStart: 10,
              }}>
              <Ionicons name="flash" size={20} color="#659ED6" />

              <Text style={[{color: '#659ED6', marginStart: 10, fontSize: 16}]}>
                {t('common:create_request')}
              </Text>
            </TouchableOpacity>
          }
        </View>
      )}

      {bottomSheet()}
    </View>
  );
}

export default ChatScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', //'#1A2125',
  },
  input_container: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 20,
    height: 50,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  chat_container: {
    width: 200,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',

    borderRadius: 10,

    elevation: 5,
  },
  text: {
    fontSize: 15,
    color: '#fff',
    fontFamily: fonts.medium,
  },
  headerBG: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 40,
    backgroundColor: '#659ED6',
    borderTopStartRadius: 10,
    borderTopEndRadius: 10,
  },
  rounIcon: {
    marginTop: 10,
    backgroundColor: '#5F66CD',
    borderRadius: 100,
    margin: 5,
    alignItems: 'center',
    justifyContent: 'center',
    width: 50,
    height: 50,
  },
  options: {
    alignItems: 'center',
    width: '30%',
  },
  offertext: {
    fontSize: 18,
    margin: 5,
    color: '#fff',
    fontFamily: fonts.medium,
  },
  offertextinput: {
    textAlignVertical: 'top',
    borderColor: '#fff',
    color: '#fff',
    borderWidth: 1,
    fontSize: 16,
    padding: 5,
    margin: 5,

    borderRadius: 10,
    fontFamily: fonts.medium,
  },
});
