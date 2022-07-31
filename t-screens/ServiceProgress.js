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
  ImageBackground,
  Alert
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import nowTheme from "../constants/Theme";
import Images from "../constants/Images";
import ServicesService from '../services/service';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceProgressTayder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      service: this.props.route.params.service,
      isLoading: false,
      propertyDist: "",
      serviceDetails: "",
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
        return { service: this.props.route.params.service }
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
    Alert.alert("Finalizar servicio", "¿Estás seguro que deseas finalizar este servicio?", [
      {
        text: 'Cancelar',
        onPress: () => this.setState({ openCamera: false }),
        style: 'cancel'
      },
      {
        text: 'Finalizar', onPress: () => {
          let objService = {
            service_id: this.state.service.id
          };

          this.setState({ isLoading: true });

          ServicesService.finishService(objService)
            .then(response => {
              this.setState({ isLoading: false });
              this.props.navigation.navigate("ServiceFinishTayder");
            })
            .catch(error => {
              //console.error(error);
              Alert.alert("Servicio", error.data.error);
            })
        }
      }
    ])
  }

  render() {
    const { serviceDetails, propertyDist, service, isLoading } = this.state;

    return (
      <Block flex style={styles.container}>
        <StatusBar barStyle="light-content" />

        <ImageBackground source={Images.BlackLightsBackground} style={{ width, height }}>
          <Block flex space="between" style={styles.padded}>
            <Block style={styles.cardContainer}>
              <View style={{ height: height }}>
                <ScrollView>
                  <Image source={Images.TaydLogoLarge} style={{ width: 120, height: 25, marginTop: 60, alignSelf: 'center' }} />

                  <Text style={styles.textExtraBold2}>Manos a la obra</Text>

                  <View style={[styles.section]}>
                    <Image source={Images.Icons.Calendario} style={[{ width: 60, height: 60, marginTop: 20 }]} />
                    <Block style={[styles.sectionItem, styles.sectionBorder, { width: 280 }]}>
                      <Text style={[styles.textExtraBold]}>Cita en curso</Text>
                      <Text style={[styles.textNormal]}>
                        Al finalizar las labores no olvides pasar lista de lo que realizaste.
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
                    <Block style={{ width: 60 }} />
                    <Block style={[styles.sectionItem, styles.sectionBorder, { width: 300 }]}>
                      <Text style={[styles.textBold]}>{service.has_consumables ? 'Se solicitaron insumos.' : 'No se solicitaron insumos.'}</Text>
                    </Block>
                  </View>

                  <View style={[styles.section]}>
                    <Image source={service.service_type_id == 1 ? Images.Icons.Inmueble : Images.Icons.Vehiculo} style={[{ width: 60, height: 60, marginTop: 20 }]} />
                    <Block style={[styles.sectionItem, { width: 280, paddingTop: 20 }]}>
                      <Text style={[styles.textRedBold]}>{service.service_type_id == 1 ? `Inmuebles: ${service.property_type_name}` : `Servicio: ${service.vehicle_type}`}</Text>
                      <Text style={[styles.textNormal]}>{service.service_type_id == 1 ? propertyDist : serviceDetails}</Text>
                    </Block>
                  </View>

                  <Block middle style={{ paddingTop: 25, marginBottom: 25 }}>
                    <Button
                      round
                      color={nowTheme.COLORS.BASE}
                      style={styles.button}
                      disabled={isLoading}
                      loading={isLoading}
                      onPress={() => this._handleActionButton()}>
                      <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                        HE TERMINADO
                      </Text>
                    </Button>
                  </Block>
                </ScrollView>
              </View>
            </Block>
          </Block>
        </ImageBackground>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.COLORS.BLACK
  },
  cardContainer: {
    height: height
  },
  padded: {
    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: theme.SIZES.BASE * 1.3,
    bottom: theme.SIZES.BASE,
    width: width,
  },
  textExtraBold: {
    fontFamily: 'trueno-extrabold',
    fontSize: 26,
    lineHeight: 29,
    color: nowTheme.COLORS.WHITE,

    marginBottom: 10,
  },
  textExtraBold2: {
    fontFamily: 'trueno-extrabold',
    fontSize: 50,
    lineHeight: 44,
    color: nowTheme.COLORS.WHITE,

    alignSelf: 'center',
    textAlign: 'center',
    marginVertical: 15,
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
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },
});

export default ServiceProgressTayder;
