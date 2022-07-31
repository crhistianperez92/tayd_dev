import React from 'react';
import { Image, StyleSheet, StatusBar, Dimensions, Platform, View, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { withNavigation } from '@react-navigation/compat';

import Actions from '../../lib/actions';
import { Images, nowTheme } from '../../constants';

const { height, width } = Dimensions.get('screen');

class DocumentosIndexScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null
    };
  }

  async componentDidMount() {
    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
      }
    });
  }

  _logout() {
    Actions.removeUserData().then((response) => {
      if (response) {
        this.props.navigation.navigate('Onboarding')
      }
    });
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />

        <Block middle style={{ paddingTop: 30 }}>
          <Text style={styles.title}>
            Hola, {this.state.userData != null ? this.state.userData.info.name : "Tayder"}
          </Text>
        </Block>

        <View style={{ height: height * 0.8 }}>
          <ScrollView>
            <Block flex={1} middle space="between" style={styles.padded}>
              <Block style={styles.itemGroup} row width={width * 0.8}>
                <Image source={Images.Icons.Camara} style={styles.imageCamara} />
                <Text style={[styles.subtitle, styles.groupTextContainer]}>
                  Para formar parte de nuestro equipo, necesitamos subas una fotografía de los siguientes documentos,
                  te recomendamos tenerlos a la mano.
                </Text>
              </Block>

              <Block style={styles.itemGroup} row width={width * 0.8}>
                <Image source={Images.Icons.Grupo1} style={styles.imageGroup} />
                <Block style={styles.groupTextContainer}>
                  <Text style={styles.title2}>Identificación oficial</Text>
                  <Text style={styles.subtitle}>
                    IFE ó INE (Visible) con CURP.
                  </Text>
                </Block>
              </Block>

              <Block style={styles.itemGroup} row width={width * 0.8}>
                <Image source={Images.Icons.Grupo2} style={styles.imageGroup} />
                <Block style={styles.groupTextContainer}>
                  <Text style={styles.title2}>Comprobante de domicilio</Text>
                  <Text style={styles.subtitle}>
                    Recibo de luz o agua.
                  </Text>
                </Block>
              </Block>

              <Block style={styles.itemGroup} row width={width * 0.8}>
                <Image source={Images.Icons.Grupo3} style={styles.imageGroup} />
                <Block style={styles.groupTextContainer}>
                  <Text style={styles.title2}>R.F.C.</Text>
                  <Text style={styles.subtitle}>
                    Realiza tu inscripción o actualización de RFC en el SAT.
                  </Text>
                </Block>
              </Block>

              <Block style={styles.itemGroup} row width={width * 0.8}>
                <Image source={Images.Icons.Grupo4} style={styles.imageGroup} />
                <Block style={styles.groupTextContainer}>
                  <Text style={styles.title2}>Clabe interbancaria</Text>
                  <Text style={styles.subtitle}>
                    Herramienta para poder depositar tus ganancias en TAYD.
                  </Text>
                </Block>
              </Block>

              <Block center>
                <Button
                  round
                  color={nowTheme.COLORS.BASE}
                  style={styles.button}
                  loading={this.state.isLoading}
                  disabled={this.state.isLoading}
                  onPress={() => this.props.navigation.navigate('DocumentosStep1')}>
                  <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                    Iniciar
                  </Text>
                </Button>
              </Block>

              <Block center style={{ marginTop: 15 }}>
                <Button
                  round
                  color={nowTheme.COLORS.BASE}
                  style={styles.cancelButton}
                  onPress={() => this._logout()}>
                  <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                    Cancelar
                  </Text>
                </Button>
              </Block>
            </Block>
          </ScrollView>
        </View>
      </Block>
    );
  }
}

export default withNavigation(DocumentosIndexScreen);

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  padded: {
    paddingTop: 20,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.WHITE,
    fontSize: 45,
    textAlign: 'center',
  },
  itemGroup: {
    paddingVertical: 15,
  },
  groupTextContainer: {
    paddingLeft: 15,
    paddingRight: 10,
    width: width * 0.7
  },
  title2: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.WHITE,
    fontSize: 24,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'trueno-light',
    fontSize: 18,
    color: nowTheme.COLORS.WHITE,
    textAlign: 'left',
  },
  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  cancelButton: {
    width: width * 0.35,
    height: theme.SIZES.BASE * 2.4,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  imageCamara: {
    width: 50,
    height: 40,
  },
  imageGroup: {
    width: 50,
    height: 50
  }
});

