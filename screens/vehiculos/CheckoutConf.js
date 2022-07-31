import React from "react";
import {
  ImageBackground,
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
  Modal,
  ScrollView,
  TouchableOpacity
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import { Icon, PaymentMethodModalComponent } from '../../components';
import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";
import PaymentMethodService from "../../services/paymentMethod";
import GeneralSettingService from "../../services/generalSetting";
import ServicesService from "../../services/service";
import Actions from "../../lib/actions";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class VehicleCheckoutScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: this.props.route.params.datetime,
      vehicleType: this.props.route.params.vehicleType,
      vehicleItems: this.props.route.params.vehicleItems,
      vehicleColor: this.props.route.params.vehicleColor,
      vehicleBrand: this.props.route.params.vehicleBrand,
      services: this.props.route.params.services,
      address: this.props.route.params.address,
      reference: this.props.route.params.reference,
      location: this.props.route.params.location,
      isLoading: false,
      userData: null,
      showPaymentMethodModal: false,
      hasError: false,
      errorTitle: '',
      errorMessage: '',
      serviceInfo: "",
      sourceInfo: null,
      weekDay: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
      serviceCost: 0,
      subtotal: 0,
      discount: 0,
      total: 0,
      generalSettings: [],
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
      }
    });

    await PaymentMethodService.getPredeterminedSource(this.state.userData.id)
      .then(response => {
        this.setState({ sourceInfo: response });
      })
      .catch(error => {
        console.error(error);
      });


    await GeneralSettingService.getAll()
      .then(response => {
        this.setState({ generalSettings: response });
      })
      .catch(e => console.error(e));

    this._getVehicleServicesDetails();

    this.focusListener = await navigation.addListener('focus', async () => {
      this.setState({
        datetime: this.props.route.params.datetime,
        vehicleType: this.props.route.params.vehicleType,
        vehicleItems: this.props.route.params.vehicleItems,
        vehicleColor: this.props.route.params.vehicleColor,
        vehicleBrand: this.props.route.params.vehicleBrand,
        services: this.props.route.params.services,
        address: this.props.route.params.address,
        reference: this.props.route.params.reference,
        location: this.props.route.params.location,
        userData: null,
        showPaymentMethodModal: false,
        hasError: false,
        errorTitle: '',
        errorMessage: '',
        serviceInfo: "",
        sourceInfo: null,
        serviceCost: 0,
        subtotal: 0,
        discount: 0,
        total: 0,
        generalSettings: [],
      })

      await Actions.extractUserData().then((result) => {
        if (result != null) {
          this.setState({ userData: result.user });
        }
      });

      await PaymentMethodService.getPredeterminedSource(this.state.userData.id)
        .then(response => {
          this.setState({ sourceInfo: response });
        })
        .catch(error => {
          console.error(error);
        });


      await GeneralSettingService.getAll()
        .then(response => {
          this.setState({ generalSettings: response });
        })
        .catch(e => console.error(e));

      this._getVehicleServicesDetails();
    });
  }

  _getGeneralSettings() {
    GeneralSettingService.getAll()
      .then(response => {
        this.setState({ generalSettings: response });
      })
      .catch(e => console.error(e));
  }

  _getSourceInfo() {
    PaymentMethodService.getPredeterminedSource(this.state.userData.id)
      .then(response => {
        this.setState({ sourceInfo: response });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _datetimeFormat() {
    const { weekDay, day, month, year, hour, minutes } = this.state.datetime;
    let _week = this.state.weekDay[weekDay];
    let _month = this.state.months[month];
    let _hour = hour;

    let type = "a.m.";
    let _minutes = minutes < 10 ? `0${minutes}` : minutes;

    if (_hour >= 12) {
      if (_hour > 12) _hour -= 12;
      type = "p.m.";
    }

    return `${_week}, ${day} de ${_month} de ${year}, ${_hour}:${_minutes} ${type}`;
  }

  _calculateService() {
    let { generalSettings, subtotal } = this.state;
    let serviceTotal = 0,
      taydCommission = 0,
      stripeCommission = 0,
      taxStripe = 0,
      taxService = 0,
      newSubtotal = 0;

    let taydCommissionSetting = generalSettings.filter(item => item.key == "TAYD_COMISION_30");
    let stripeCommissionPercentSetting = generalSettings.filter(item => item.key == "STRIPE_COMISION_PORCENTAJE");
    let stripeCommissionExtraSetting = generalSettings.filter(item => item.key == "STRIPE_COMISION_EXTRA");
    let taxPercentSetting = generalSettings.filter(item => item.key == "IVA_PORCENTAJE");

    // pre-subtotal del servicio
    serviceTotal = subtotal;

    // Comisión obtenida por Tayd
    taydCommission = serviceTotal * (parseFloat(taydCommissionSetting[0].value) / 100);

    // Impuesto aplicado al pre-subtotal
    taxService = (serviceTotal + taydCommission) * (parseFloat(taxPercentSetting[0].value) / 100);

    // Comisión obtenida por Stripe
    stripeCommission = ((serviceTotal + taxService + taydCommission) * (parseFloat(stripeCommissionPercentSetting[0].value) / 100)) + parseFloat(stripeCommissionExtraSetting[0].value);

    // Impuesto aplicado a la comisión de Stripe
    taxStripe = stripeCommission * (parseFloat(taxPercentSetting[0].value) / 100);

    // Total del proceso
    newSubtotal = serviceTotal + taxService + taydCommission + stripeCommission + taxStripe;

    this.setState({ subtotal: newSubtotal, serviceCost: serviceTotal });
  }

  _getVehicleServicesDetails() {
    let total = 0;
    let strDetails = "";

    this.state.services.map(item => {
      strDetails += `${item.label} \n`;
      total += parseFloat(item.price);
    });

    this.setState({ subtotal: total, serviceInfo: strDetails });
    this._calculateService();
  }

  storeService() {
    const { day, month, year, hour, minutes } = this.state.datetime;

    if (this.state.sourceInfo != null) {
      let _month = month <= 8 ? `0${month + 1}` : month + 1;
      let _day = day <= 9 ? `0${day}` : day;
      let _minutes = minutes <= 9 ? `0${minutes}` : minutes;
      let _hours = hour <= 9 ? `0${hour}` : hour

      let params = {
        user_id: this.state.userData.id,
        service_type_id: 2,
        vehicle_type_id: this.state.vehicleType,
        stripe_customer_source_id: this.state.sourceInfo.id,
        date: `${year}-${_month}-${_day}`,
        time: `${_hours}:${_minutes}:00`,
        has_consumables: false,
        service_cost: this.state.serviceCost,
        discount: 0,
        marca: this.state.vehicleBrand,
        color: this.state.vehicleColor,
        latitude: this.state.location.latitude,
        altitude: this.state.location.longitude,
        address: this.state.address,
        reference: this.state.reference,
        service_details: this.state.services.map(item => item.vehicle_type_price_id)
      };

      ServicesService.store(params)
        .then(response => {
          this.props.navigation.navigate("AgendaSuccess", {
            schedule: this._datetimeFormat()
          });
        })
        .catch(e => {
          this.setState({ hasError: true, errorTitle: 'Servicio', errorMessage: e.data.error });
        });
    } else {
      this.setState({ hasError: true, errorTitle: 'Tarjeta Bancaria', errorMessage: "No se ha registrado una tarjeta bancaria en tu cuenta." });
    }
  }

  paymentMethodModal = () => {
    let { userData, sourceInfo, showPaymentMethodModal } = this.state;
    if (userData != null && sourceInfo != null) {
      return (
        <PaymentMethodModalComponent
          userId={userData.id}
          showPaymentMethodModal={showPaymentMethodModal}
          defaultValue={sourceInfo.id}
          onClose={this._paymentMethodModalResponse}
        />
      )
    }
  }

  _paymentMethodModalResponse = (newValue) => {
    PaymentMethodService.get(newValue)
      .then(response => this.setState({ sourceInfo: response }))
      .catch(error => Alert.alert("Método de Pago", error.data.error));

    this.setState({ showPaymentMethodModal: false });
  }

  render() {
    const { navigation } = this.props;
    const { address, sourceInfo, serviceInfo, subtotal, discount, userData, isLoading } = this.state;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />
        <Block flex center>
          <ImageBackground source={Images.AgendaCheckout} style={{ height, width, zIndex: 1 }} />
        </Block>

        <Block flex space="between" style={styles.padded}>
          <Block style={styles.cardContainer}>
            <View style={{ height: smallScreen ? height * 0.7 : height * 0.62 }}>
              <ScrollView>
                <View style={[styles.sectionBorder, styles.section]}>
                  <TouchableOpacity onPress={() => navigation.navigate('AgendaFecha')}>
                    <Image source={Images.Icons.RegresarRojo} style={{ width: 25, height: 25 }} />
                  </TouchableOpacity>
                  <Image source={Images.TaydLogoLarge} style={{ width: 120, height: 25 }} />
                  <TouchableOpacity onPress={() => navigation.navigate('Schedule')}>
                    <Text style={styles.textCancel}>Cancelar</Text>
                  </TouchableOpacity>
                </View>

                <View style={[styles.sectionBorder, styles.section]}>
                  <Image source={Images.Icons.TarjetaBancaria} style={[styles.sectionItem, { width: 50, height: 34 }]} />
                  <Text style={[styles.sectionItem, styles.textNormal, { width: 190, paddingLeft: 30 }]}>
                    {sourceInfo != null ? `${sourceInfo.brand}\n${sourceInfo.number}\n${sourceInfo.name}` : 'No tienes una tarjeta agregada.'}
                  </Text>
                  <TouchableOpacity onPress={() => this.setState({ showPaymentMethodModal: true })}>
                    {sourceInfo != null && (
                      <Icon
                        size={22}
                        color={nowTheme.COLORS.BASE}
                        name="chevron-right"
                        family="FontAwesome"
                      />
                    )}
                  </TouchableOpacity>
                </View>

                <View style={[styles.sectionBorder, styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}>Contacto</Text>
                  <Text style={[styles.sectionItem, styles.textNormal, { width: 230 }]}>{`${userData?.email}\n${userData?.info?.phone}`}</Text>
                </View>

                <View style={[styles.sectionBorder, styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}>Dirección</Text>
                  <Text style={[styles.sectionItem, styles.textNormal, { width: 230 }]}>{address}</Text>
                </View>

                <View style={[styles.sectionBorder, styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}>Día y Hora</Text>
                  <Text style={[styles.sectionItem, styles.textNormal, { width: 230 }]}>{this._datetimeFormat()}</Text>
                </View>

                <View style={[styles.sectionBorder, styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}>Servicios</Text>
                  <Text style={[styles.sectionItem, styles.textNormal, { width: 230 }]}>
                    {serviceInfo}
                  </Text>
                </View>

                <View style={[styles.section, { paddingTop: 15 }]}>
                  <Text style={[styles.sectionItem, styles.textBold]}> </Text>
                  <Text style={[styles.sectionItem, styles.textNormal]}>Subtotal</Text>
                  <Text style={[styles.sectionItem, styles.textNormal,]}>{`$${subtotal.toFixed(2)}`}</Text>
                </View>
                <View style={[styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}> </Text>
                  <Text style={[styles.sectionItem, styles.textNormal]}>Cupón</Text>
                  <Text style={[styles.sectionItem, styles.textNormal,]}>{`$${discount.toFixed(2)}`}</Text>
                </View>
                <View style={[styles.section]}>
                  <Text style={[styles.sectionItem, styles.textBold]}> </Text>
                  <Text style={[styles.sectionItem, styles.textBold]}>Total</Text>
                  <Text style={[styles.sectionItem, styles.textBold,]}>{`$${(subtotal - discount).toFixed(2)}`}</Text>
                </View>

                <Block middle style={{ paddingTop: 25 }}>
                  <Button
                    round
                    color={nowTheme.COLORS.BASE}
                    style={styles.button}
                    loading={isLoading}
                    disabled={isLoading}
                    onPress={() => this.storeService()}>
                    <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                      AGENDAR
                    </Text>
                  </Button>
                </Block>
              </ScrollView>
            </View>
          </Block>
        </Block>

        {this.paymentMethodModal}

        <Modal
          animationType="fade"
          transparent
          visible={this.state.hasError}
          presentationStyle="overFullScreen">
          <View style={{ flex: 1, height: height, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end', flexDirection: 'column', }}>
            <View style={{ backgroundColor: 'white', padding: 25, paddingBottom: 30, }}>
              <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
                <Image source={require('../../assets/icons/warning.png')} style={{ height: 70, width: 79 }} />
                <Text style={styles.errorTitle}>{this.state.errorTitle}</Text>
                <Text style={styles.textNormal}>{this.state.errorMessage}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Button
                  round
                  color={nowTheme.COLORS.BASE}
                  style={styles.button}
                  onPress={() => this.setState({ hasError: false, errorTitle: '', errorMessage: '' })}>
                  <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                    ENTENDIDO
                  </Text>
                </Button>
              </View>
            </View>
          </View>
        </Modal>
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
  textCancel: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.BASE,
  },
  textBold: {
    fontFamily: 'trueno',
    fontSize: 14,
    fontWeight: 'bold',
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },
  textNormal: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.SECONDARY,
  },
  errorTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 22,
    fontWeight: 'bold',
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },
  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionItem: {
    paddingLeft: 15
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#E3E3E3',
    paddingVertical: 10,
  },
  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
});

export default VehicleCheckoutScreen;
