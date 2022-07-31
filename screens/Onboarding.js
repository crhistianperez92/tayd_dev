import React from 'react';
import { Image, StyleSheet, StatusBar, Dimensions, Platform, TouchableHighlight, View, SafeAreaView } from 'react-native';
import { Block, Button, Text, theme, Toast } from 'galio-framework';
import AppIntroSlider from 'react-native-app-intro-slider';
import { Switch } from '../components';

const { height, width } = Dimensions.get('screen');
import { Images, nowTheme } from '../constants/';
import { HeaderHeight } from '../constants/utils';
import Actions from '../lib/actions';

const smallScreen = height < 812 ? true : false;
const slides = [
  {
    key: 'first',
    image: require('../assets/imgs/slide1_no_text.jpg'),
    last: false,
  },
  {
    key: 'second',
    image: Images.Slide002,
    last: false,
  },
  {
    key: 'third',
    image: Images.Slide003,
    last: false,
  },
  {
    key: 'last',
    image: Images.Slide004,
    last: true,
  }
];

export default class Onboarding extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isTayder: false,
      showRealApp: false,
      hasMessage: this.props.route.params ? this.props.route.params.hasMessage : false,
      message: this.props.route.params ? this.props.route.params.message : '',
    };
  }

  async componentDidMount() {
    //await Actions.removeUserData().then((response) => console.log("BORRADO"));

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        if (result.user.first_login && !result.user.isTayder) {
          this.props.navigation.navigate('PropertyLocation');
        } else if (!result.user.first_login && !result.user.isTayder) {
          this.props.navigation.navigate('DrawerClient', { screen: 'Home' });
        } else if (result.user.first_login_tayder && result.user.isTayder && !result.user.confirmed && !result.user.on_review) {
          this.props.navigation.navigate('DocumentosIndex');
        } else if (result.user.first_login_tayder && result.user.isTayder && !result.user.confirmed && result.user.on_review) {
          this.props.navigation.navigate('DocumentosValidacion');
        } else if (result.user.first_login_tayder && result.user.isTayder && result.user.confirmed) {
          this.props.navigation.navigate('Welcome');
        } else if (!result.user.first_login_tayder && result.user.isTayder) {
          this.props.navigation.navigate('DrawerTayder', { screen: 'HomeTayder' });
        }
      }
    });
  }

  _renderItem = ({ item, dimensions }) => {
    if (item.key == "first") {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar barStyle="dark-content" />
          <Image style={{ width: dimensions.width, height: dimensions.height, resizeMode: 'cover' }} source={Images.Slide001} />
        </View>
      );
    } else if (item.key == "second") {
      return (
        <View style={{ flex: 1, }}>
          <StatusBar barStyle="dark-content" />
          <Image style={{ width: dimensions.width, height: dimensions.height, resizeMode: 'cover' }} source={Images.Slide002} />
        </View>
      );
    } else if (item.key == "third") {
      return (
        <View style={{ flex: 1, }}>
          <StatusBar barStyle="dark-content" />
          <Image style={{ width: dimensions.width, height: dimensions.height, resizeMode: 'cover' }} source={Images.Slide003} />
        </View>
      );
    } else if (item.key == "last") {
      return (
        <View style={{ flex: 1, }}>
          <StatusBar barStyle="dark-content" />
          <Image style={{ width: dimensions.width, height: dimensions.height, resizeMode: 'cover' }} source={Images.Slide004} />
        </View>
      );
    }
  }

  _renderDoneButton = () => {
    return (
      <Button
        shadowless
        style={styles.buttonCircle}
        color={nowTheme.COLORS.WHITE}
        onPress={() => this.setState({ showRealApp: true })}
      >
        <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={nowTheme.COLORS.BASE}>
          COMENZAR
        </Text>
      </Button>
    );
  };

  _onDone = () => {
    this.setState({ showRealApp: true });
  }

  render() {
    const { navigation } = this.props;

    if (this.state.showRealApp) {
      return (
        <Block flex style={[styles.container, this.state.isTayder ? styles.containerBlack : styles.containerRed]}>
          <StatusBar barStyle="light-content" />
          <Block flex>
            <Block space="between" style={styles.padded}>
              <Toast isShow={this.state.hasMessage} positionIndicator="top" color="success">{this.state.message}</Toast>
              <Block>
                <Block row style={{ justifyContent: 'center' }}>
                  <Image source={this.state.isTayder ? Images.LogoTayder : Images.Logo} style={[this.state.isTayder ? styles.logoTayder : styles.logoTayd]} />
                </Block>

                <Block middle style={{ width: width - theme.SIZES.BASE * 4, backgroundColor: 'green' }}>
                  <Text style={[styles.sloganText, { bottom: 25 }]} color="white">
                    {this.state.isTayder ? 'Forma parte de nuestro equipo y genera ganancias' : 'Bienvenido a la nueva red de limpieza doméstica'}
                  </Text>
                </Block>

                <Block middle style={{ width: width - theme.SIZES.BASE * 4 }}>
                  <Image source={Images.TaydLogo} style={styles.logoTaydHorizontal} />
                </Block>

                <Block middle style={{ marginBottom: 8, width: width - theme.SIZES.BASE * 4 }}>
                  <Text style={{ fontFamily: 'trueno-semibold', fontWeight: '600', fontSize: smallScreen ? 16 : 18 }} color={nowTheme.COLORS.WHITE}>¿Eres Tayder?</Text>
                </Block>

                <Block middle style={{ marginBottom: theme.SIZES.BASE, width: width - theme.SIZES.BASE * 4 }}>
                  <Switch
                    value={this.state.isTayder}
                    onValueChange={(value) => this.setState({ isTayder: !this.state.isTayder })}
                  />
                </Block>

                <Block row>
                  <Button
                    shadowless
                    style={styles.button}
                    color={nowTheme.COLORS.WHITE}
                    onPress={() => navigation.navigate('Login')}
                  >
                    <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={this.state.isTayder ? nowTheme.COLORS.BLACK : nowTheme.COLORS.BASE}>INICIAR SESIÓN</Text>
                  </Button>
                </Block>
                {
                  !this.state.isTayder
                    ? (
                      <Block row style={{ marginTop: theme.SIZES.BASE * 0.8, marginBottom: theme.SIZES.BASE * 0.5 }}>
                        <Button
                          shadowless
                          style={styles.button}
                          color={nowTheme.COLORS.WHITE}
                          onPress={() => navigation.navigate('Register', { isTayder: this.state.isTayder })}
                        >
                          <Text style={{ fontFamily: 'trueno-semibold', fontSize: 20, fontWeight: '600' }} color={nowTheme.COLORS.BASE}>
                            REGISTRARSE
                          </Text>
                        </Button>
                      </Block>
                    )
                    : (
                      <Block row style={{ marginTop: theme.SIZES.BASE * 0.8, marginBottom: theme.SIZES.BASE * 2 }}>
                        <View style={{ flexDirection: 'row', alignContent: 'center', justifyContent: 'center' }}>
                          <Text style={{ fontFamily: 'trueno-semibold', fontSize: 16 }} color={nowTheme.COLORS.WHITE}>¿Aún no tienes una cuenta? </Text>
                          <TouchableHighlight onPress={() => navigation.navigate('RegisterTayder', { isTayder: this.state.isTayder })}>
                            <View>
                              <Text style={{ fontFamily: 'trueno-semibold', fontSize: 19, fontWeight: '400' }} color={nowTheme.COLORS.BASE}> Regístrate</Text>
                            </View>
                          </TouchableHighlight>
                        </View>
                      </Block>
                    )
                }
              </Block>
            </Block>
          </Block>
        </Block>
      );
    } else {
      return <SafeAreaView style={{ flex: 1 }}>
        <AppIntroSlider
          renderItem={this._renderItem}
          slides={slides}
          nextLabel=''
          dotStyle={{ backgroundColor: nowTheme.COLORS.WHITE }}
          activeDotStyle={{ backgroundColor: nowTheme.COLORS.BASE }}
          renderDoneButton={this._renderDoneButton}
          onDone={this._onDone} />
      </SafeAreaView>
    }
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? - HeaderHeight : 0
  },
  containerRed: {
    backgroundColor: nowTheme.COLORS.BASE,
  },
  containerBlack: {
    backgroundColor: nowTheme.COLORS.BLACK,
  },

  logoTayd: {
    width: smallScreen ? 400 : 480,
    height: smallScreen ? 400 : 480,
    bottom: smallScreen ? 0 : 25
  },
  logoTayder: {
    width: smallScreen ? 250 : 300,
    height: smallScreen ? 250 : 300,
    bottom: smallScreen ? 110 : 125
  },
  logoTaydHorizontal: {
    width: smallScreen ? 250 : 320,
    height: smallScreen ? 50 : 70,
    bottom: 10
  },

  sloganText: {
    fontFamily: 'trueno-semibold',
    position: 'absolute',
    letterSpacing: 2,
    paddingHorizontal: smallScreen ? 12 : 20,
    fontWeight: '600',
    textAlign: 'center',
    fontSize: smallScreen ? 16 : 18,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    zIndex: 3,
    position: 'absolute',
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3
  },
  button: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    borderRadius: 50,
  },

  buttonCircle: {
    width: width - theme.SIZES.BASE * 4,
    height: theme.SIZES.BASE * 3,
    borderRadius: 50,
    bottom: 50,
    marginRight: 20,

    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
