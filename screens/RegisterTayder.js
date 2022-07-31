import React from 'react';
import { ImageBackground, Image, StyleSheet, StatusBar, ScrollView, Dimensions, Platform, View, TouchableWithoutFeedback, Keyboard, Alert, KeyboardAvoidingView } from 'react-native';
import { Block, Button, Text, theme, Checkbox } from 'galio-framework';
import { Input } from '../components';

import { Images, nowTheme } from '../constants';
import AuthenticationService from '../services/authentication';
import { withNavigation } from '@react-navigation/compat';
import * as Linking from 'expo-linking';

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "position" : "padding"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

class RegisterTayderScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      phone: '',
      email: '',
      name: '',
      lastname: '',
      password: '',
      isLoading: false,
      chkTerms: false,
    };
  }

  _onRegister = () => {
    if (this.state.email != '' && this.state.password != '' && this.state.phone != '' && this.state.name != '' && this.state.lastname != '') {
      if (!this.state.chkTerms) {
        this._handleRequest();
      } else {
        Alert.alert('Upps!', 'Es necesario que aceptes los términos y condiciones de TAYD.');
      }
    } else {
      Alert.alert('Upps!', 'Al parecer el formulario de registro se encuentra incompleto.');
    }
  }

  async _handleRequest() {
    this.setState({ isLoading: true });
    let params = {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      last_name: this.state.lastname,
      phone: this.state.phone,
      isTayder: true,
    };

    await AuthenticationService.signup(params)
      .then(async (response) => {
        try {
          Alert.alert("Registro", "Se ha creado tu cuenta exitosamente, procede a iniciar sesión para subir tus documentos.")
          this.setState({
            isLoading: false,
            email: '',
            password: '',
            name: '',
            last_name: '',
            phone: '',
          });

          this.props.navigation.navigate('Login');

        } catch (error) {
          console.error(error);
          this.setState({ isLoading: false });
          Alert.alert('Registro', 'Ocurrió un error inesperado al registrar tu usuario.');
        }
      })
      .catch(error => {
        this.setState({ isLoading: false });
        Alert.alert('Upps!', 'Al parecer algo pasó al momento de procesar tu petición.');
      })
  }

  _handlePrivacyPress = () => {
    Linking.openURL('http://www.tayd.mx/terminos-condiciones');
  }

  render() {
    const { navigation } = this.props;

    return (
      <DismissKeyboard>
        <Block flex>
          <StatusBar barStyle="light-content" />
          <ImageBackground source={Images.RegisterTayderBackground} style={{ height: height, width }}>

            <View>
              <ScrollView>
                <Block flex space="between" style={styles.padded}>
                  <Block middle>
                    <Text style={styles.title}>Registro</Text>
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Número telefónico"
                      placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                      type="phone-pad"
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Telefono} />
                      }
                      onChangeText={(text) => this.setState({ phone: text })}
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Correo electrónico"
                      placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                      type="email-address"
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Correo} />
                      }
                      onChangeText={(text) => this.setState({ email: text })}
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Nombre(s)"
                      placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Nombre} />
                      }
                      onChangeText={(text) => this.setState({ name: text })}
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Apellido(s)"
                      placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Apellido} />
                      }
                      onChangeText={(text) => this.setState({ lastname: text })}
                    />
                  </Block>
                  <Block width={width * 0.8}>
                    <Input
                      placeholder="Contraseña"
                      placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                      password
                      viewPass
                      style={styles.inputs}
                      iconContent={
                        <Image style={styles.inputIcons} source={Images.Icons.Contrasena} />
                      }
                      onChangeText={(text) => this.setState({ password: text })}
                    />
                  </Block>
                  <Block width={width * 0.7} style={{ justifyContent: 'center', alignSelf: 'center', marginVertical: 10, marginLeft: width * 0.3 }}>
                    <Text style={{ color: nowTheme.COLORS.BASE, fontFamily: 'trueno', fontSize: 12 }} onPress={this._handlePrivacyPress}>Ver términos y condiciones</Text>
                  </Block>
                  <Block width={width * 0.6} style={{ justifyContent: 'center', alignSelf: 'center', marginVertical: 10 }}>
                    <Checkbox
                      checkboxStyle={{ borderWidth: 1, borderRadius: 2, borderColor: '#FFF', backgroundColor: '#302a31' }}
                      color={nowTheme.COLORS.BASE}
                      labelStyle={{ color: '#FFF', fontFamily: 'trueno', fontSize: 12 }}
                      label="Acepto los términos y condiciones."
                      initialValue={this.state.chkTerms}
                      onChange={() => this.setState({ chkTerms: !this.state.chkTerms })}
                    />
                  </Block>

                  <Block center style={{ marginBottom: 20 }}>
                    <Button
                      round
                      color={nowTheme.COLORS.BASE}
                      style={styles.button}
                      loading={this.state.isLoading}
                      disabled={this.state.isLoading}
                      onPress={() => this._onRegister()}>
                      <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                        SIGUIENTE
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </ScrollView>
            </View>
          </ImageBackground>
        </Block>
      </DismissKeyboard>
    );
  }
}

export default withNavigation(RegisterTayderScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK,
    flex: 1,
  },
  padded: {
    marginTop: smallScreen ? 250 : 300,
    paddingHorizontal: theme.SIZES.BASE * 2,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    fontSize: 40,
    textAlign: 'center',
    color: nowTheme.COLORS.WHITE,
  },
  subtitle: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },
  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    backgroundColor: '#FFF'
  },
  inputIcons: {
    marginRight: 25,
    width: 25,
    height: 25,
  },
});

