import React from 'react';
import { Image, StyleSheet, Dimensions, Platform, View, ScrollView } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

import { Images, nowTheme } from '../../constants';
import { HeaderHeight, iPhoneX } from '../../constants/utils';
import { Input } from '../../components';
import VehicleType from "../../components/VehiclesTypes";

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

export default class VehicleServiceSelectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: this.props.route.params.datetime,
      isIphone: Platform.OS === 'ios',
      vehicleTypeValue: null,
      vehicleColor: '',
      vehicleBrand: '',
      vehicleItems: [],
    };
  }

  async componentDidMount() {
    this.focusListener = await this.props.navigation.addListener('focus', () => {
      this.setState({
        datetime: this.props.route.params.datetime,
        vehicleColor: '',
        vehicleBrand: '',
        vehicleTypeValue: null,
        vehicleItems: [],
      })
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  updateVehicleType = (value, arrPrices) => {
    this.setState({ vehicleTypeValue: value, vehicleItems: arrPrices });
  }

  _handleNextAction() {
    if (this.state.vehicleTypeValue != null) {
      this.props.navigation.navigate('VehiculoServicio', {
        datetime: this.state.datetime,
        vehicleType: this.state.vehicleTypeValue,
        vehicleItems: this.state.vehicleItems,
        vehicleColor: this.state.vehicleColor,
        vehicleBrand: this.state.vehicleBrand
      });
    }
  }

  render() {
    const { vehicleTypeValue, vehicleColor, vehicleBrand } = this.state;
    return (
      <Block flex style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block flex>
            <Image source={Images.AgendaTipoAuto} style={styles.image} />
          </Block>

          <Block flex style={{ backgroundColor: 'white' }}>
            <Block space="between" style={styles.padded}>
              <Text style={[styles.title, { paddingTop: smallScreen ? 50 : 30 }, { marginTop: iPhoneX && 30 }]}> Tipo de Vehículo </Text>
              <Text style={[styles.subtitle, { paddingVertical: 10 }]}> Selecciona tu tipo de vehículo </Text>

              <VehicleType value={vehicleTypeValue} updateValue={this.updateVehicleType} />

              <Input
                placeholder="Marca"
                value={vehicleBrand}
                onChangeText={(text) => this.setState({ vehicleBrand: text })}
                style={styles.inputs}
              />

              <Input
                placeholder="Color"
                value={vehicleColor}
                onChangeText={(text) => this.setState({ vehicleColor: text })}
                style={styles.inputs}
              />

              <Block middle style={{ width: width - theme.SIZES.BASE * 4, marginTop: 25 }}>
                <Button
                  round
                  color={nowTheme.COLORS.BASE}
                  style={styles.createButton}
                  disabled={vehicleTypeValue != null ? false : true}
                  onPress={() => this._handleNextAction()}>
                  <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                    SIGUIENTE
                  </Text>
                </Button>
              </Block>
            </Block>
          </Block>
        </ScrollView>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    marginTop: Platform.OS === 'android' ? -HeaderHeight : -HeaderHeight - 15,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
    bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
  },

  image: {
    width: width,
    height: 350,
    marginTop: smallScreen ? 30 : 70,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    paddingHorizontal: 20,
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  titleBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3'
  },
  subtitle: {
    fontFamily: 'trueno',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 15,
  },
  datetimeText: {
    fontFamily: 'trueno-extrabold',
    paddingHorizontal: 20,
    fontSize: 16,
    fontWeight: '700',
    color: nowTheme.COLORS.BASE
  },
  itemContainer: {
    flexDirection: 'row',
    alignContent: 'center',
    justifyContent: 'center',
    alignItems: 'baseline'
  },
  icons: {
    marginRight: 20,
    width: 25,
    height: 25,
  },
  labels: {
    fontFamily: 'trueno-semibold',
    fontSize: 16,
    width: 150,
    marginRight: 20,
  },

  createButton: {
    width: width * 0.5,
    marginTop: 10,
    marginBottom: 10,

    shadowRadius: 0,
    shadowOpacity: 0,
  },

  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    fontFamily: 'trueno',
    fontSize: 17,
    letterSpacing: 20
  },
});