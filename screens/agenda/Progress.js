import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, View, ImageBackground } from "react-native";
import { Block, theme, Text } from "galio-framework";

import { TabBar } from "../../components";
import { Images, nowTheme } from '../../constants/';
import Actions from "../../lib/actions";

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class AgendaProgressScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      tayder: this.props.route.params.tayder,
      serviceStatus: this.props.route.params.status,
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
      }
    });

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState({
        tayder: this.props.route.params.tayder,
        serviceStatus: this.props.route.params.status,
      })
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  renderBlocks = () => {
    let { userData } = this.state;

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
        <Block flex>
          <Block flex row style={{ paddingTop: 10 }}>
            <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginRight: 25 }} />
            <Block flex>
              <Text style={styles.nameTitle}>Agenda de {userData != null && userData.info ? userData.info.name : ''}</Text>
              <Text style={styles.subtitle}>Limpieza en curso</Text>
            </Block>
          </Block>

          <View style={{ height: height * 0.7 }}>
            <ScrollView>
              <Block flex style={{ marginTop: 20 }}>
                <Block middle style={styles.cardContainer}>
                  <ImageBackground source={Images.LightsBackground} style={{ width: width }}>
                    <Block middle style={{ paddingHorizontal: 15 }}>
                      <Image source={Images.TaydLogoLarge} style={{ width: 160, height: 35, marginTop: 30 }} />

                      <Text style={[styles.serviceTitle]}>Manos a la obra</Text>

                      <Text style={[styles.serviceSubtitle, { marginTop: 15, paddingHorizontal: 20 }]}>
                        Nuestro TAYDER se encuentra en tu domicilio realizando los trabajos de limpieza y orden.
                      </Text>

                      <Block style={[styles.tayderCardContainer]}>
                        <ImageBackground source={Images.TayderInfoBackground} style={{ width: width * 0.8, borderRadius: 50 }}>
                          <Block flex row style={{ paddingVertical: 25 }}>
                            <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginRight: 10, marginLeft: 20, borderColor: '#FFF', borderWidth: 2 }} />
                            <Block>
                              <Text style={styles.tayderNormal}>TAYDER:</Text>
                              <Text style={styles.tayderBold}>{/* this.state.tayder */ 'María de Jesús'}</Text>
                              <Text style={styles.tayderNormal2}>Morales Perez</Text>
                            </Block>
                          </Block>
                        </ImageBackground>
                      </Block>

                      <Text style={[styles.serviceSubtitle, { marginTop: 15, paddingHorizontal: 20 }]}>
                        No olvides firmar la hoja de salida de nuestro empleado y revisar los servicios realizados en los inmuebles para
                        corroborar la calidad de nuestro servicio.
                      </Text>

                      <Text style={[styles.serviceSubtitleBold, { marginTop: 30 }]}>Estatus:</Text>
                      <Text style={[styles.serviceSubtitleBoldRed, { marginBottom: 30 }]}>{this.state.serviceStatus.toUpperCase()}</Text>
                    </Block>
                  </ImageBackground>
                </Block>
              </Block>
            </ScrollView>
          </View>
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderBlocks()}

        <TabBar {...this.props} activeScreen="agenda" />
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  home: {
    width: width,
    backgroundColor: nowTheme.COLORS.BACKGROUND,
  },
  nameTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 24,
    color: nowTheme.COLORS.SECONDARY,
    lineHeight: 29,
  },
  subtitle: {
    fontFamily: 'trueno',
    fontSize: 14,
    lineHeight: 15,
    color: nowTheme.COLORS.SECONDARY,
  },
  blocksContainer: {
    width: width - theme.SIZES.BASE * 2,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
  },

  cardContainer: {
    backgroundColor: nowTheme.COLORS.BLACK,
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
  tayderCardContainer: {
    backgroundColor: nowTheme.COLORS.BLACK,
    borderRadius: 25,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.1,
    elevation: 1,

    marginVertical: 30,
    overflow: 'hidden',
  },
  serviceTitle: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.GREY5,
    fontSize: 32,
    textAlign: 'center',
    marginTop: 20,
  },
  serviceSubtitle: {
    fontFamily: 'trueno',
    fontSize: 16,
    color: nowTheme.COLORS.GREY5,
    textAlign: 'center',
  },
  serviceSubtitleBold: {
    fontFamily: 'trueno-semibold',
    color: nowTheme.COLORS.GREY5,
    fontSize: 20,
    textAlign: 'center',
  },
  serviceSubtitleBoldRed: {
    fontFamily: 'trueno-semibold',
    color: nowTheme.COLORS.BASE,
    fontSize: 26,
    textAlign: 'center',
    width: width * 0.5,
  },

  tayderNormal: {
    fontFamily: 'trueno-semibold',
    fontSize: 16,
    color: nowTheme.COLORS.WHITE,
    textAlign: 'left',
  },
  tayderNormal2: {
    fontFamily: 'trueno',
    fontSize: 18,
    color: nowTheme.COLORS.WHITE,
    textAlign: 'left',
  },
  tayderBold: {
    fontFamily: 'trueno-extrabold',
    fontSize: 22,
    color: nowTheme.COLORS.WHITE,
    textAlign: 'left',
  },
});

export default AgendaProgressScreen;
