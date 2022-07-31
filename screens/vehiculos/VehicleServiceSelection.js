import React from 'react';
import { Image, StyleSheet, Dimensions, Platform, View, ScrollView, Alert } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';

import { Images, nowTheme } from '../../constants';
import { HeaderHeight, iPhoneX } from '../../constants/utils';

import VehicleService from "../../components/VehiclesServices";

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

export default class VehicleSelectionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: this.props.route.params.datetime,
      vehicleType: this.props.route.params.vehicleType,
      vehicleItems: this.props.route.params.vehicleItems,
      vehicleColor: this.props.route.params.vehicleColor,
      vehicleBrand: this.props.route.params.vehicleBrand,
      isIphone: Platform.OS === 'ios',
      serviceData: [],
      refresh: false,
    };
  }

  async componentDidMount() {
    this.focusListener = await this.props.navigation.addListener('focus', () => {
      this.setState({
        datetime: this.props.route.params.datetime,
        vehicleType: this.props.route.params.vehicleType,
        vehicleItems: this.props.route.params.vehicleItems,
        vehicleColor: this.props.route.params.vehicleColor,
        vehicleBrand: this.props.route.params.vehicleBrand,
        serviceData: [],
        refresh: true
      });

      this.setState({ refresh: false });
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  updateServiceInfo = (selected, data) => {
    let serviceData = this.state.serviceData;
    if (serviceData.length < 1 && selected) {
      serviceData.push({
        id: 0,
        label: data.label,
        vehicle_type_price_id: data.id,
        price: data.price,
        selected: selected
      });

      this.setState({ serviceData: serviceData });
    } else if (serviceData.findIndex(item => item.vehicle_type_price_id == data.id) == -1 && selected) {
      serviceData.push({
        id: 0,
        label: data.label,
        vehicle_type_price_id: data.id,
        price: data.price,
        selected: selected
      });

      this.setState({ serviceData: serviceData });

    } else if (!selected) {
      let index = serviceData.map(element => element.vehicle_type_price_id).indexOf(data.id);
      serviceData.splice(index, 1);
      this.setState({ serviceData: serviceData });
    } else {
      let index = serviceData.map(element => element.vehicle_type_price_id).indexOf(data.id);

      let item = {
        id: 0,
        label: data.label,
        vehicle_type_price_id: data.id,
        price: data.price,
        selected: selected
      };

      serviceData.splice(index, 1, item);
      this.setState({ serviceData: serviceData });
    }
  }

  _handleNextAction() {
    if (this.state.serviceData.length > 0) {
      this.props.navigation.navigate('VehiculoUbicacion', {
        datetime: this.state.datetime,
        vehicleType: this.state.vehicleType,
        vehicleItems: this.state.vehicleItems,
        vehicleColor: this.state.vehicleColor,
        vehicleBrand: this.state.vehicleBrand,
        services: this.state.serviceData
      });
    } else {
      Alert.alert("Upps!", "Debes seleccionar al menos un servicio.");
    }
  }

  render() {
    const { vehicleItems, refresh } = this.state;
    return (
      <Block flex style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block flex>
            <Image source={Images.AgendaTipoServicio} style={styles.image} />
          </Block>

          <Block flex style={{ backgroundColor: 'white' }}>
            <Block space="between" style={styles.padded}>
              <Text style={[styles.title, { paddingTop: smallScreen ? 50 : 30 }, { marginTop: iPhoneX && 30 }]}> Servicios </Text>
              <Text style={[styles.subtitle, { paddingVertical: 10 }]}> Selecciona los servicios a realizar </Text>

              {
                !refresh &&
                vehicleItems.map((value) => {
                  return <VehicleService key={value.id} id={value.id} label={value.name} price={value.price} value={value.key} getValues={(selected, data) => this.updateServiceInfo(selected, data)} />
                })
              }

              <Block middle style={{ width: width - theme.SIZES.BASE * 4, marginTop: 25 }}>
                <Button
                  round
                  color={nowTheme.COLORS.BASE}
                  style={styles.createButton}
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
});