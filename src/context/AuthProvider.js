import React, {createContext, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import {baseURL} from '../util/util';
import {getBookingTypes, getServices} from '../data/data';

// Prepares the dataLayer
export const AuthContext = createContext();

// Wrap our app and provide the Data layer
export const AuthProvider = ({children}) => {
  const [isInterpreter, setIsInterpreter] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [auth, setAuth] = useState(false);
  const [user, setUser] = useState(null);
  const [reload, setReload] = useState(false);
  const [reloadInbox, setReloadInbox] = useState(false);
  const [firstLaunch, setFirstLaunch] = useState(null);
  const [userName, setUserName] = useState(null);
  const [translators, setTranslators] = useState([]);
  const [languages, setLanguages] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [pendingBookings, setPendingBookings] = useState([]);
  const [confirmedBookings, setConfirmedBookings] = useState([]);
  const [historicBookings, setHistoricBookings] = useState([]);
  const [favourites, setFavourites] = useState([]);
  const [reloadFavourite, setReloadFavourite] = useState(false);
  const [inbox, setInbox] = useState([]);
  const [ratings, setRatings] = useState([]);
  const [refreshing, setRefreshing] = useState(true);
  const [refreshingB, setRefreshingB] = useState(true);
  const [networkError, setNetworkError] = useState(false);
  const [transInfo, setTransInfo] = useState(null);
  const [token, setToken] = useState(null);
  const [translatorsList, setTranslatorsList] = useState([]);
  var available_services = getServices();
  var booking_types = getBookingTypes();
  const [gigs, setGigs] = useState([]);
  const [reloadgigs, setReloadGigs] = useState(true);
  const [location, setLocation] = useState(null);
  const [docs, setDocs] = useState([]);
  var [availability, setAvailability] = useState({});

  // login louout route

  const onlineStatus = (localUser, column, value) => {
    const data = {
      Email: localUser,
      value: value,
      column: column,
    };
    // console.log(data);
    axios
      // testing url
      // .put(`https://aatsapi.herokuapp.com/auth/users`, data)
      // live server
      .put(`${baseURL}/auth/users`, data)
      .then(res => {
        if (res.data.msg === 'success') {
          console.log('status changed to ' + value);
        } else {
          console.log('online error ', res.data);
        }
      })
      .catch(err => {
        console.log('status error ', err);
      });
  };

  // get translators

  // store user detaisls in aync

  // store user detaisls in aync

  // get username

  // fetch user destials from aync

  // fetch user destials from ayncooling

  // logout user
  const logout = async () => {
    try {
      setIsLoading(true);
      const jsonValue = await AsyncStorage.removeItem('user');
      // console.log(jsonValue);
      setBookings([]);
      setPendingBookings([]);
      setConfirmedBookings([]);
      setHistoricBookings([]);
      setInbox([]);
      setFavourites([]);
      setRatings([]);
      setUser(null);
      setUserName(null);
      setIsInterpreter(null);
      setGigs([]);
      setAvailability([]);
      setDocs([]);
      setTimeout(() => {
        setAuth(false);
        setIsLoading(false);
      }, 500);
    } catch (e) {
      // error reading value
      console.log(e);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        setUser,
        isLoading,
        setIsLoading,
        auth,
        setAuth,
        bookings,
        translators,
        setTranslators,
        translatorsList,
        setTranslatorsList,
        languages,
        setLanguages,
        setFavourites,
        reloadFavourite,
        setReloadFavourite,
        favourites,
        inbox,
        setInbox,
        ratings,
        setRatings,
        pendingBookings,
        setPendingBookings,
        confirmedBookings,
        setConfirmedBookings,
        refreshing,
        setRefreshing,
        refreshingB,
        setRefreshingB,
        reload,
        setReload,
        reloadInbox,
        setReloadInbox,
        setBookings,
        networkError,
        setNetworkError,
        transInfo,
        setTransInfo,
        token,
        setToken,
        userName,
        setUserName,
        firstLaunch,
        isInterpreter,
        setIsInterpreter,
        setFirstLaunch,
        historicBookings,
        setHistoricBookings,
        available_services,
        booking_types,
        gigs,
        setGigs,
        reloadgigs,
        setReloadGigs,
        location,
        setLocation,
        availability,
        setAvailability,
        docs,
        setDocs,
        logout: () => {
          logout();
        },

        getUserName: () => {
          getUserName();
        },

        onlineStatus: (localUser, column, value) => {
          onlineStatus(localUser, column, value);
        },
      }}>
      {children}
    </AuthContext.Provider>
  );
};
