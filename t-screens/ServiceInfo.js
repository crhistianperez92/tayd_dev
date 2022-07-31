import React from "react";
import {
  StyleSheet,
  StatusBar,
  Dimensions,
  Text,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Modal
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import MapView from 'react-native-maps';
import nowTheme from "../constants/Theme";
import Images from "../constants/Images";
import ServicesService from "../services/service";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceInfoTayder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: this.props.route.params.service,
      propertyDist: "",
      serviceDetails: "",
      mapRefresh: false,
      showModal: false,
      isLoading: false,
      isCanceled: false,
      weekDay: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
      months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;
    const { service } = this.state;

    if (service.service_type_id == 1)
      this._getPropertyDistribution();
    else if (service.service_type_id == 2)
      this._getVehicleServiceDetails();

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState((state) => {
        return { service: this.props.route.params.service, mapRefresh: false }
      });

      if (service.service_type_id == 1)
        this._getPropertyDistribution();
      else if (service.service_type_id == 2)
        this._getVehicleServiceDetails();
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  formatDateTime = (item) => {
    let arrItem = item.dt_request.split(" ");
    let arrDate = arrItem[0].split("-");
    let arrTime = arrItem[1].split(":");

    let datetime = new Date(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]), Number(arrTime[0]), Number(arrTime[1]));
    let week = this.state.weekDay[datetime.getDay()];
    let month = this.state.months[datetime.getMonth()];
    let type = "a.m.";
    let minutes = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
    let hour = datetime.getHours();

    if (hour >= 12) {
      if (hour > 12) hour -= 12;
      type = "p.m.";
    }

    return `${week} ${datetime.getDate()} de ${month} del ${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
  }

  _getPropertyDistribution() {
    let strDistribution = "";

    this.state.service.distribution.map(item => {
      strDistribution += `${item.quantity} ${item.name} \n`;
    });

    this.setState({ propertyDist: strDistribution });
  }

  _getVehicleServiceDetails() {
    let strService = "";

    this.state.service.details.map(item => {
      strService += `${item.name} \n`;
    });

    this.setState({ serviceDetails: strService });
  }

  _handleActionButton() {
    this.setState({ mapRefresh: true });
    this.props.navigation.navigate("HomeTayder");
  }

  cancelService = (item) => {
    if (item.service_status_id != 5) {
      this.setState({ isLoading: true });

      let objCancel = {
        service_id: item.id,
        service_status: item.service_status_id,
        from_tayder: true,
      };

      ServicesService.cancelService(objCancel)
        .then(response => this.setState({ isCanceled: true, isLoading: false }))
        .catch(error => Alert.alert("Servicio", error.data.error));
    }
  }

  _closeModal = () => {
    this.setState({ showModal: false, isCanceled: false });
    this.props.navigation.navigate("HomeTayder");
  }

  render() {
    const { serviceDetails, propertyDist, service, mapRefresh, showModal, isLoading, isCanceled } = this.state;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="dark-content" />
        {
          service != null && !mapRefresh ? (
            <MapView
              style={styles.mapStyle}
              pitchEnabled={true}
              rotateEnabled={true}
              scrollEnabled={true}
              zoomEnabled={true}
              initialRegion={{
                latitude: parseFloat(service.property_latitude),
                longitude: parseFloat(service.property_altitude),
                latitudeDelta: 0.01,
                longitudeDelta: 0.01
              }}
            >
              <MapView.Marker
                key={0}
                draggable={false}
                coordinate={{
                  latitude: parseFloat(service.property_latitude),
                  longitude: parseFloat(service.property_altitude),
                }}
                title={'Mi ubicación'}
                description={'Esta ubicación será registrada en tayd'}
              />
            </MapView>
          ) : (
            <View style={{ bottom: height * 0.6, justifyContent: 'center', alignItems: 'center', backgroundColor: '#FFF' }}>
              <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.SECONDARY, fontSize: 24 }}>Cargando...</Text>
            </View>
          )
        }

        <Block flex space="between" style={styles.padded}>
          <Block style={styles.cardContainer}>
            <View style={{ height: smallScreen ? height * 0.6 : height * 0.62 }}>
              <ScrollView>
                <View style={[styles.section]}>
                  <Image source={Images.Icons.Calendario} style={[{ width: 60, height: 60, marginTop: 20 }]} />
                  <Block style={[styles.sectionItem, styles.sectionBorder, { width: 280 }]}>
                    <Text style={[styles.textExtraBold]}>Cita aceptada</Text>
                    <Text style={[styles.textNormal]}>
                      <Text style={styles.textBold}>{service.request_user_name} </Text>
                      agendó una cita contigo para el {this.formatDateTime(service)}
                    </Text>
                  </Block>
                </View>

                <View style={[styles.section]}>
                  <Image source={Images.Icons.Ubicacion2} style={[{ width: 45, height: 63, marginTop: 20 }]} />
                  <Block style={[styles.sectionItem, styles.sectionBorder, { width: 280, marginLeft: 30 }]}>
                    <Text style={[styles.textRedBold]}>Dirección:</Text>
                    <Text style={[styles.textNormal]}>{service.service_type_id == 1 ? service.property_name : service.address}</Text>
                  </Block>
                </View>

                <View style={[styles.section]}>
                  <Image source={service.service_type_id == 1 ? Images.Icons.Inmueble : Images.Icons.Vehiculo} style={[{ width: 60, height: 60, marginTop: 20 }]} />
                  <Block style={[styles.sectionItem, styles.sectionBorder, { width: 280 }]}>
                    <Text style={[styles.textRedBold]}>{service.service_type_id == 1 ? `Inmuebles: ${service.property_type_name}` : `Servicio: ${service.vehicle_type}`}</Text>
                    <Text style={[styles.textNormal]}>{service.service_type_id == 1 ? propertyDist : serviceDetails}</Text>
                  </Block>
                </View>

                <View style={[styles.section, { marginVertical: 20 }]}>
                  <Block style={{ width: 60 }} />
                  <Block style={[styles.sectionItem, { width: 300 }]}>
                    <Text style={[styles.textBold]}>{service.has_consumables ? 'Se solicitaron insumos.' : 'No se solicitaron insumos.'}</Text>
                  </Block>
                </View>

                <Block middle style={{ marginBottom: 25 }}>
                  <Block row style={{ marginBottom: 15 }}>
                    <Button
                      color={nowTheme.COLORS.BLACK}
                      style={styles.buttonCancel}
                      onPress={() => this.setState({ showModal: true })}>
                      <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.BASE, lineHeight: 16, textAlign: 'center' }} size={14}>
                        CANCELAR SERVICIO
                      </Text>
                    </Button>

                    <Button
                      color={nowTheme.COLORS.WHITE}
                      style={styles.buttonContact}
                      onPress={() => this.props.navigation.navigate("ChatTayder", { service_id: service.id })}>
                      <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.BASE, lineHeight: 16, textAlign: 'center' }} size={14}>
                        CONTACTAR CLIENTE
                      </Text>
                    </Button>
                  </Block>

                  <Button
                    round
                    color={nowTheme.COLORS.BASE}
                    style={styles.button}
                    onPress={() => this._handleActionButton()}>
                    <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, lineHeight: 16 }} size={14}>
                      ENTENDIDO
                    </Text>
                  </Button>
                </Block>
              </ScrollView>
            </View>
          </Block>
        </Block>

        <Modal
          animationType="slide"
          transparent
          visible={showModal}
          presentationStyle="overFullScreen">
          <View style={{ flex: 1 }}>
            <View style={styles.modalContainer}>
              {
                !isCanceled ? (
                  <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30, }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
                      <TouchableOpacity onPress={() => this.setState({ showModal: false })} style={{ alignSelf: 'flex-end' }}>
                        <Image source={Images.Icons.Close01} />
                      </TouchableOpacity>
                      <Image source={Images.TaydLogoLarge} style={{ height: 25, width: 120 }} />
                      <Text style={styles.modalTitle}>¿Deseas cancelar el servicio</Text>
                      <Text style={styles.modalDescription}>Recuerda que cada vez que cancelas tu puntuación disminuye.</Text>
                    </View>
                    <Block middle style={{ alignItems: 'center' }}>
                      <Button
                        round
                        color={nowTheme.COLORS.BASE}
                        style={styles.modalButton}
                        loading={isLoading}
                        loadingColor={nowTheme.COLORS.WHITE}
                        disabled={isLoading}
                        onPress={() => this.cancelService(service)}>
                        <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>CANCELAR CITA</Text>
                      </Button>
                    </Block>
                  </View>
                ) : (
                  <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30, }}>
                    <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
                      <Image source={require('../assets/icons/success.png')} style={{ height: 79, width: 79 }} />
                      <Text style={[styles.modalTitle, { marginBottom: 15 }]}>Cita cancelada</Text>
                      <Text style={styles.modalDescription}>Nos vemos en futuras citas</Text>
                    </View>
                    <Block middle style={{ alignItems: 'center' }}>
                      <Button
                        round
                        color={nowTheme.COLORS.BASE}
                        style={styles.modalButton}
                        onPress={() => this._closeModal()}>
                        <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>LISTO</Text>
                      </Button>
                    </Block>
                  </View>
                )
              }
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
  mapStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: height * 0.6,
  },
  padded: {
    top: smallScreen ? 350 : 390,
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: theme.SIZES.BASE * 1.3,
    position: 'absolute',
    bottom: theme.SIZES.BASE,
    zIndex: 2,
    width: width,
  },
  textExtraBold: {
    fontFamily: 'trueno-extrabold',
    fontSize: 26,
    lineHeight: 29,
    color: nowTheme.COLORS.WHITE,

    marginBottom: 10,
  },
  textBold: {
    fontFamily: 'trueno-semibold',
    fontSize: 16,
    lineHeight: 17,
    color: nowTheme.COLORS.WHITE,
  },
  textRedBold: {
    fontFamily: 'trueno-semibold',
    fontSize: 16,
    lineHeight: 17,
    color: nowTheme.COLORS.BASE,
  },
  textNormal: {
    fontFamily: 'trueno',
    fontSize: 16,
    lineHeight: 19,
    color: nowTheme.COLORS.WHITE,
  },

  section: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionItem: {
    marginLeft: 15
  },
  sectionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#B5B5B5',
    paddingVertical: 20,
  },

  button: {
    width: width * 0.8,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
  buttonCancel: {
    width: width * 0.3,
    height: theme.SIZES.BASE * 3.5,
    shadowRadius: 0,
    shadowOpacity: 0,
    paddingVertical: 10,

    borderColor: nowTheme.COLORS.BASE,
    borderWidth: 1,
    borderRadius: 20,
  },
  buttonContact: {
    width: width * 0.45,
    height: theme.SIZES.BASE * 3.5,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginLeft: 10,
    paddingHorizontal: 25,
    paddingVertical: 10,
    borderRadius: 20,
  },

  modalContainer: {
    flex: 1,
    height: height,
    backgroundColor: 'rgba(0,0,0,.2)',
    justifyContent: 'flex-end',
    flexDirection: 'column'
  },
  modalTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 30,
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'center',
  },
  modalDescription: {
    fontFamily: 'trueno',
    fontSize: 16,
    color: nowTheme.COLORS.SECONDARY,
  },
  modalButton: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
});

export default ServiceInfoTayder;
