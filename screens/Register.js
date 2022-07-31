import React, { useState } from 'react';
import { StyleSheet, Image, Dimensions, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, KeyboardAvoidingView, Platform, TouchableOpacity, View } from 'react-native';
import { Block, Checkbox, Text, Button, } from 'galio-framework';
import * as Linking from 'expo-linking';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import { withNavigation } from '@react-navigation/compat';

import { Input } from '../components';
import { Images, nowTheme } from '../constants';
import AuthenticationService from '../services/authentication';

const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

const RegisterScreen = (baseProps) => {
  const [value, setValue] = useState('');
  const [form, setForm] = useState({
    isTayder: false,
    phone: '',
    email: '',
    name: '',
    lastname: '',
    password: '',
    confirm: '',
  });
  const [chkTerms, setChkTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [enterCode, setEnterCode] = useState(false);
  const [verificated, setVerificated] = useState(false);
  const title = enterCode ? 'Verificación' : 'Registro';
  const buttonText = enterCode ? 'VERIFICAR CÓDIGO' : 'REGISTRAR';
  const ref = useBlurOnFulfill({ value, cellCount: 6 });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({
    value,
    setValue,
  });

  const _handlePrivacyPress = () => {
    Linking.openURL('http://www.tayd.mx/terminos-condiciones');
  }

  const _handleLogin = () => {
    if (form.email != '' && form.password != '' && form.password != '' && form.name != '' && form.lastname != '' && form.phone != '') {
      if (!chkTerms) {
        if (enterCode)
          confirmCode();
        else
          sendCode();
      } else {
        Alert.alert('Upps!', 'Es necesario que aceptes los términos y condiciones de TAYD.');
      }
    } else {
      Alert.alert('Upps!', 'Al parecer el formulario de registro se encuentra incompleto.');
    }
  }

  const sendCode = () => {
    let params = {
      phone: form.phone
    }

    AuthenticationService.sendVerificationCode(params)
      .then(response => {
        Alert.alert('Verificación', `Se enviará un código de verificación al número telefónico ${form.phone}`)
        setEnterCode(true);
      })
      .catch(err => {
        console.log(err);
        Alert.alert('Upps!', err.error);
      });
  }

  const confirmCode = () => {
    if (value.length == 6) {
      setIsLoading(true);

      let data = {
        code: value,
        phone: form.phone
      };

      AuthenticationService.confirmVerificationCode(data)
        .then(response => {
          _handleRequest();
        })
        .catch(err => {
          Alert.alert('Upps!', err.error);
          setIsLoading(false);
        })
    } else {
      Alert.alert('Upps!', 'El código ingresado es incompleto.');
    }
  }

  const _handleRequest = async () => {
    let params = {
      email: form.email,
      password: form.password,
      isTayder: form.isTayder,
      name: form.name,
      last_name: form.lastname,
      phone: form.phone,
      chkTerms: true,
    };

    await AuthenticationService.signup(params)
      .then(async (response) => {
        setForm({
          phone: '',
          email: '',
          name: '',
          lastname: '',
          password: '',
          confirm: '',
        });
        setIsLoading(false);
        Alert.alert("Registro", "Se ha registrado tu cuenta exitosamente, inicia sesión para acceder a Tayd.")
        baseProps.navigation.navigate('Login', { hasMessage: true, message: 'Registro exitoso!' });
      })
      .catch(error => {
        setIsLoading(false);
        Alert.alert('Upps!', 'Ocurrió un error al realizar tu registro.');
      })
  }

  const _tryAgain = () => {
    setEnterCode(false);
    setCode('');
  }

  const _goBack = () => {
    if (enterCode)
      setEnterCode(false);
    else
      baseProps.navigation.navigate('Onboarding');
  }

  return (
    <DismissKeyboard>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
        <Block flex middle>
          <TouchableOpacity onPress={() => _goBack()} style={{ alignSelf: 'flex-start', marginLeft: 20 }}>
            <Image source={Images.Icons.RegresarRojo} style={{ width: 25, height: 25 }} />
          </TouchableOpacity>
          <Block flex space="evenly">
            <Block middle style={styles.titleContainer}>
              <Block middle>
                <Text style={{ fontFamily: 'trueno-extrabold', textAlign: 'center' }} color={nowTheme.COLORS.BASE} size={32}>
                  {title}
                </Text>
              </Block>

              <Block middle>
                <Image source={Images.TaydRegistro} style={styles.logoTayder} />
              </Block>
            </Block>

            <Block flex={1} middle space="between">
              <Block center flex={0.9}>
                <Block flex space="between">
                  <Block>
                    {
                      !enterCode ? (
                        <Block>
                          <Block width={width * 0.8}>
                            <Input
                              placeholder="Número telefónico"
                              placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                              type="phone-pad"
                              style={styles.inputs}
                              iconContent={
                                <Image style={styles.inputIcons} source={Images.Icons.Telefono} />
                              }
                              onChangeText={(text) => setForm({ ...form, phone: text })}
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
                              onChangeText={(text) => setForm({ ...form, email: text })}
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
                              onChangeText={(text) => setForm({ ...form, name: text })}
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
                              onChangeText={(text) => setForm({ ...form, lastname: text })}
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
                              onChangeText={(text) => setForm({ ...form, password: text })}
                            />
                          </Block>
                          <Block width={width * 0.7} style={{ justifyContent: 'center', alignSelf: 'center', marginVertical: 10, marginLeft: 15 }} row>
                            <Text style={{ color: nowTheme.COLORS.BASE, fontFamily: 'trueno', fontSize: 12 }} onPress={() => _handlePrivacyPress()}>Ver términos y condiciones</Text>
                          </Block>
                          <Block width={width * 0.6} style={{ justifyContent: 'center', alignSelf: 'center', marginVertical: 10, marginLeft: 15 }} row>
                            <Checkbox
                              checkboxStyle={{ borderWidth: 1, borderRadius: 2, borderColor: '#C0C0C0' }}
                              color={nowTheme.COLORS.BASE}
                              labelStyle={{ color: '#C0C0C0', fontFamily: 'montserrat-regular', fontSize: 12 }}
                              label="Acepto los términos y condiciones."
                              initialValue={chkTerms}
                              onChange={() => setChkTerms(!chkTerms)}
                            />
                          </Block>
                        </Block>
                      ) : (
                        <Block>
                          <Block width={width * 0.8} style={{ justifyContent: 'center', alignSelf: 'center' }}>
                            <CodeField
                              ref={ref}
                              {...props}
                              value={value}
                              onChangeText={setValue}
                              cellCount={6}
                              rootStyle={styles.codeFieldRoot}
                              keyboardType="numeric"
                              textContentType="oneTimeCode"
                              renderCell={({ index, symbol, isFocused }) => (
                                <View
                                  onLayout={getCellOnLayoutHandler(index)}
                                  key={index}
                                  style={[styles.cellRoot, isFocused && styles.focusCell]}>
                                  <Text style={styles.cellText}>
                                    {symbol || (isFocused ? <Cursor /> : null)}
                                  </Text>
                                </View>
                              )}
                            />
                          </Block>

                          {
                            enterCode && (
                              <View>
                                <Text style={styles.wrongNumberText} onPress={() => _tryAgain()}>¿Ingresaste un número erroneo o necesitas un nuevo código?</Text>
                              </View>
                            )
                          }
                        </Block>
                      )
                    }
                  </Block>
                  <Block center>
                    <Button
                      round
                      color={nowTheme.COLORS.BASE}
                      style={styles.createButton}
                      loading={isLoading}
                      disabled={isLoading}
                      onPress={() => _handleLogin()}>
                      <Text style={{ fontFamily: 'montserrat-bold' }} size={14} color={nowTheme.COLORS.WHITE}>
                        {buttonText}
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </Block>
            </Block>
          </Block>
        </Block>
      </ScrollView>
    </DismissKeyboard>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: nowTheme.COLORS.WHITE,
    paddingTop: 45
  },
  registerContainer: {
    width: width * 0.9,
    height: height < 812 ? height * 0.9 : height * 0.9,
    marginTop: 45,
    marginBottom: 20,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 25,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,
    overflow: 'hidden',
  },
  titleContainer: {
    backgroundColor: nowTheme.COLORS.WHITE
  },
  logoTayder: {
    width: 300,
    height: 300,
  },

  inputIcons: {
    marginRight: 25,
    width: 25,
    height: 25,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#C0C0C0',
    borderRadius: 21.5
  },
  passwordCheck: {
    paddingLeft: 2,
    paddingTop: 6,
    paddingBottom: 15
  },
  createButton: {
    width: width * 0.5,
    marginTop: 25,
    marginBottom: 40,

    shadowRadius: 0,
    shadowOpacity: 0,
  },

  wrongNumberText: {
    fontFamily: 'trueno',
    fontSize: 13,
    textAlign: 'center',
    color: nowTheme.COLORS.PLACEHOLDER,
    margin: 10,
  },
  codeFieldRoot: {
    marginTop: 20,
    width: 280,
    marginLeft: 'auto',
    marginRight: 'auto',
  },
  cellRoot: {
    width: 40,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomColor: nowTheme.COLORS.PLACEHOLDER,
    borderBottomWidth: 1,
  },
  cellText: {
    color: nowTheme.COLORS.SECONDARY,
    fontSize: 36,
    textAlign: 'center',
  },
  focusCell: {
    borderBottomColor: nowTheme.COLORS.BASE,
    borderBottomWidth: 2,
  },
});

export default withNavigation(RegisterScreen);
