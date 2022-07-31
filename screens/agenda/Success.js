import React from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class AgendaCheckoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      successTitle: 'Agendado con éxito',
      successMessage: 'Nos vemos el ' + this.props.route.params.schedule,
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState({
        hasError: false,
        successTitle: 'Agendado con éxito',
        successMessage: 'Nos vemos el ' + this.props.route.params.schedule,
      })
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          <ImageBackground source={Images.LightsBackground} style={{ height, width, zIndex: 1 }} />
        </Block>

        <Block flex space="between" style={styles.padded}>
          <Block style={styles.cardContainer}>
            <View>
              <Image source={require('../../assets/icons/success.png')} style={{ height: 100, width: 100 }} />
            </View>

            <View style={{ paddingHorizontal: 40 }}>
              <Text style={styles.successTitle}>{this.state.successTitle}</Text>
            </View>

            <View style={{ marginTop: 80, paddingBottom: 25 }}>
              <Image source={Images.TaydLogoLarge} style={{ width: 120, height: 25 }} />
            </View>

            <View style={{ paddingHorizontal: 40, paddingBottom: 30 }}>
              <Text style={styles.textNormal}>{this.state.successMessage}</Text>
            </View>

            <Block middle style={{ paddingTop: 30 }}>
              <Button
                round
                color={nowTheme.COLORS.BASE}
                style={styles.button}
                onPress={() => navigation.navigate("Schedule")}>
                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                  TERMINAR
                </Text>
              </Button>
            </Block>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  cardContainer: {
    height: height < 812 ? height * 0.7 : height * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  padded: {
    top: smallScreen ? 150 : 285,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: theme.SIZES.BASE * 1.3,
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    zIndex: 2,
    width: width,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.SECONDARY,
    fontSize: 32,
    textAlign: 'center',
  },

  textNormal: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },
  successTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 22,
    fontWeight: 'bold',
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },

  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
});

export default AgendaCheckoutScreen;
