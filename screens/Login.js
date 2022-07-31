import React from 'react';
import { Image, StyleSheet, StatusBar, Dimensions, TouchableHighlight, View, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Button, Text, theme } from 'galio-framework';
import { Input } from '../components';

import { Images, nowTheme } from '../constants/';
import AuthenticationService from '../services/authentication';
import { withNavigation } from '@react-navigation/compat';
const { height, width } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1, backgroundColor: nowTheme.COLORS.BASE }}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

class LoginScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: __DEV__ ? 'jonathan@yopmail.com' : '',
      password: __DEV__ ? 'Password123' : '',
      isLoading: false,
    };
  }

  _handleLogin = () => {
    if (this.state.email != '' && this.state.password != '') {
      this._handleRequest();
    } else {
      Alert.alert('Upps!', 'Al parecer el formulario de acceso se encuentra incompleto.');
    }
  }

  async _handleRequest() {
    this.setState({ isLoading: true });
    let params = {
      email: this.state.email,
      password: this.state.password
    };

    await AuthenticationService.login(params)
      .then(async (response) => {
        if (response.user != null) {
          try {
            await AsyncStorage.setItem('access_token', response.access_token);
            await AsyncStorage.setItem('expires_at', response.expires_at);
            await AsyncStorage.setItem('user', JSON.stringify(response.user));

            this.setState({ isLoading: false });
            if (response.user.first_login && !response.user.isTayder) {
              this.props.navigation.navigate('PropertyLocation');
            } else if (!response.user.first_login && !response.user.isTayder) {
              this.props.navigation.navigate('DrawerClient', { screen: 'Home' });
            } else if (response.user.first_login_tayder && response.user.isTayder && !response.user.confirmed && !response.user.on_review) {
              this.props.navigation.navigate('DocumentosIndex');
            } else if (response.user.first_login_tayder && response.user.isTayder && !response.user.confirmed && response.user.on_review) {
              this.props.navigation.navigate('DocumentosValidacion');
            } else if (response.user.first_login_tayder && response.user.isTayder && response.user.confirmed) {
              this.props.navigation.navigate('Welcome');
            } else if (!response.user.first_login_tayder && response.user.isTayder) {
              this.props.navigation.navigate('DrawerTayder', { screen: 'HomeTayder' });
            }

          } catch (error) {
            this.setState({ isLoading: false });
            Alert.alert('Inicio de sesión', 'Ocurrió un error inesperado al iniciar sesión.');
          }
        } else {
          this.setState({ isLoading: false });
          Alert.alert('Inicio de sesión', 'Correo o contraseña incorrectas.');
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Alert.alert('Upps!', 'Correo o contraseña incorrectas.');
      })
  }

  render() {
    return (
      <DismissKeyboard>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.containerRed}>
          <StatusBar barStyle="light-content" />
          <Block flex space="evenly">
            <Image source={Images.Logo} style={styles.logoTayder} />

            <Block middle>
              <Text style={{ fontFamily: 'trueno-extrabold', textAlign: 'center', fontWeight: '700' }} color={nowTheme.COLORS.WHITE} size={40}>
                Iniciar sesión
              </Text>
            </Block>

            <Block flex={1} middle space="between">
              <Block center flex={0.9}>
                <Block flex space="between">
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Correo electrónico"
                      placeholderTextColor={nowTheme.COLORS.WHITE}
                      color={nowTheme.COLORS.WHITE}
                      type="email-address"
                      onChangeText={(text) => this.setState({ email: text })}
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Usuario_L} />
                      }
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Contraseña"
                      placeholderTextColor={nowTheme.COLORS.WHITE}
                      color={nowTheme.COLORS.WHITE}
                      password
                      onChangeText={(text) => this.setState({ password: text })}
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Password_L} />
                      }
                      iconColor={'#FFF'}
                    />
                  </Block>

                  <Block width={width * 0.8} style={{ marginTop: theme.SIZES.BASE * 0.8, marginBottom: 10 }}>
                    <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                      <Text style={{ fontFamily: 'trueno', fontSize: 12 }} color={nowTheme.COLORS.WHITE}>¿Aún no tienes una cuenta? </Text>
                      <TouchableHighlight onPress={() => this.props.navigation.navigate('Register')}>
                        <View>
                          <Text style={{ fontFamily: 'trueno-semibold', fontSize: 12, fontWeight: '700' }} color={nowTheme.COLORS.WHITE}> Regístrate</Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </Block>

                  <Block width={width * 0.8} style={{ marginBottom: theme.SIZES.BASE * 2 }}>
                    <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                      <TouchableHighlight onPress={() => { }}>
                        <View>
                          <Text style={{ fontFamily: 'trueno-semibold', fontSize: 12, fontWeight: '700' }} color={nowTheme.COLORS.WHITE}>
                            ¿No puedes acceder a tu cuenta?
                          </Text>
                        </View>
                      </TouchableHighlight>
                    </View>
                  </Block>

                  <Block center>
                    <Button
                      round
                      color={nowTheme.COLORS.WHITE}
                      style={styles.createButton}
                      loading={this.state.isLoading}
                      loadingColor={nowTheme.COLORS.BASE}
                      disabled={this.state.isLoading}
                      onPress={() => this._handleLogin()}>
                      <Text style={{ fontFamily: 'montserrat-bold' }} size={14} color={nowTheme.COLORS.BASE}>
                        INGRESAR
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </ScrollView>
      </DismissKeyboard>
    );
  }
}

export default withNavigation(LoginScreen);

const styles = StyleSheet.create({
  containerRed: {
    backgroundColor: nowTheme.COLORS.BASE,
  },

  logoTayder: {
    width: 400,
    height: 400,
  },

  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    backgroundColor: 'transparent'
  },
  inputIcons: {
    marginRight: 25,
    width: 25,
    height: 25,
  },

  createButton: {
    width: width * 0.5,
    marginBottom: 40,
    shadowRadius: 0,
    shadowOpacity: 0,
  },

});

