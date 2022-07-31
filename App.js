import React from 'react';
import { Image, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AppLoading from 'expo-app-loading'
import * as Notifications from 'expo-notifications'
import * as Location from 'expo-location'
import * as Font from 'expo-font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';

import Screens from './navigation/Screens';
import { Images, nowTheme } from './constants';

// cache app images
const assetImages = [
  Images.Logo,
  Images.ProfilePicture,
  Images.ProfileBackground
];

function cacheImages(images) {
  return images.map(image => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    } else {
      return Asset.fromModule(image).downloadAsync();
    }
  });
}

async function _getToken() {
  const { status } = await Notifications.requestPermissionsAsync()

  if (status !== 'granted') {
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  await AsyncStorage.setItem('movil_token', token.data);
}

async function _checkLocationPermitionAsync() {
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status !== 'granted') {
    Alert.alert(
      "Permisos",
      "La aplicación requiere de tu ubicación para ubicar tu inmueble con más facilidad.",
      [
        { text: "OK", onPress: () => _getLocationAsync() }
      ],
      { cancelable: false }
    )
  }
}

async function _getLocationAsync() {
  const { status } = await Location.requestForegroundPermissionsAsync()

  if (status !== 'granted') {
    return;
  }
}

export default class App extends React.Component {
  state = {
    isLoadingComplete: false,
    fontLoaded: false
  };

  handleNotification = ({ origin, data }) => {
    console.log(
      `Push notification ${origin} with data: ${JSON.stringify(data)}`,
    );
  }

  async componentDidMount() {
    Font.loadAsync({
      'montserrat-regular': require('./assets/font/Montserrat-Regular.ttf'),
      'montserrat-bold': require('./assets/font/Montserrat-Bold.ttf'),
      'trueno-extrabold': require('./assets/font/TruenoExBd.ttf'),
      'trueno-semibold': require('./assets/font/TruenoSBd.ttf'),
      'trueno': require('./assets/font/TruenoRg.ttf'),
      'trueno-light': require('./assets/font/TruenoLt.ttf'),
    });

    this.setState({ fontLoaded: true });

    _checkLocationPermitionAsync();
    _getToken();
    this.listener = Notifications.addNotificationReceivedListener(this.handleNotification);
  }

  render() {
    if (!this.state.isLoadingComplete) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
        <GalioProvider theme={nowTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([...cacheImages(assetImages)]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

  _handleFinishLoading = () => {
    if (this.state.fontLoaded) {
      this.setState({ isLoadingComplete: true });
    }
  };
}
