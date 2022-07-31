import React from 'react';
import { StyleSheet, Image, Dimensions, TouchableWithoutFeedback, Keyboard, View, Alert, KeyboardAvoidingView } from 'react-native';
import { Text, Button } from 'galio-framework';
import MapView from 'react-native-maps';
import * as Location from 'expo-location';

import { Input } from '../../components';
import { Images, nowTheme } from '../../constants';
import PropertyService from "../../services/property";

const { width, height } = Dimensions.get('screen');

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={"height"} style={{ flex: 1 }}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      {children}
    </TouchableWithoutFeedback>
  </KeyboardAvoidingView>
);

class VehicleLocationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      datetime: this.props.route.params.datetime,
      vehicleType: this.props.route.params.vehicleType,
      vehicleItems: this.props.route.params.vehicleItems,
      vehicleColor: this.props.route.params.vehicleColor,
      vehicleBrand: this.props.route.params.vehicleBrand,
      services: this.props.route.params.services,
      isLoading: true,
      location: null,
      errorMessage: null,
      address: '',
      reference: '',
      wizardIndex: 0,
      wizardText: [
        {
          title: "Direccion",
          subtitle: "Usa el PIN para verificar tu domicilio en el mapa."
        }, {
          title: "Referencia",
          subtitle: "Escribe una referencia para poder encontrar el lugar."
        }
      ]
    };

    this._getLocationAsync();
  }

  async componentDidMount() {
    this.focusListener = await this.props.navigation.addListener('focus', () => {
      this.setState({
        isLoading: true,
        location: null,
        errorMessage: null,
        address: '',
        reference: '',
        wizardIndex: 0,
        datetime: this.props.route.params.datetime,
        vehicleType: this.props.route.params.vehicleType,
        vehicleItems: this.props.route.params.vehicleItems,
        vehicleColor: this.props.route.params.vehicleColor,
        vehicleBrand: this.props.route.params.vehicleBrand,
        services: this.props.route.params.services,
      });

      this._getLocationAsync();
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  _getLocationAsync = async () => {
    let { status } = await Location.requestForegroundPermissionsAsync()
    if (status !== 'granted') {
      this.setState({
        errorMessage: 'No se ha concedido permiso para acceder a la localización.',
      });
    }

    let location = await Location.getCurrentPositionAsync({});
    PropertyService.getMapAddress(location.coords)
      .then(response => this.setState({ address: response.results[0].formatted_address }))
      .catch(err => console.error(err));

    this.setState({ location });
  }

  handleBottomButton = () => {
    if (this.state.wizardIndex == 0) {
      if (this.state.address != '')
        this.setState({ wizardIndex: 1 });
    } else if (this.state.wizardIndex == 1) {
      if (this.state.reference != '')
        this.props.navigation.navigate('VehiculoCheckout', {
          datetime: this.state.datetime,
          vehicleType: this.state.vehicleType,
          vehicleItems: this.state.vehicleItems,
          vehicleColor: this.state.vehicleColor,
          vehicleBrand: this.state.vehicleBrand,
          services: this.state.services,
          address: this.state.address,
          reference: this.state.reference,
          location: this.state.location.coords
        });
    } else {
      Alert.alert("Upps!", "Los datos de tu ubicación se encuentran incompletos.");
    }
  }

  updateCoordsAddress(coords) {
    PropertyService.getMapAddress(coords)
      .then(response => this.setState({ address: response.results[0].formatted_address }))
      .catch(err => console.error(err));

    this.setState({
      location: {
        coords: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        }
      }
    })
  }

  dynamicInput = () => {
    let { address, reference } = this.state;

    if (this.state.wizardIndex == 0) {
      return (
        <Input
          placeholder="Av. Paseo Tabasco #457"
          value={address}
          onChangeText={(text) => this.setState({ address: text })}
          style={styles.inputs}
          iconContent={
            <Image style={styles.inputIcons} source={Images.Icons.Ubicacion} />
          }
        />
      )
    } else if (this.state.wizardIndex == 1) {
      return (
        <Input
          placeholder="Ej. Casa Blanca"
          value={reference}
          onChangeText={(text) => this.setState({ reference: text })}
          style={styles.inputs}
        />
      )
    }
  }

  render() {
    let { location, wizardText, wizardIndex } = this.state;
    return (
      <DismissKeyboard>
        {
          location != null ?
            (
              <View style={styles.container}>
                <MapView
                  style={styles.mapStyle}
                  pitchEnabled={true}
                  rotateEnabled={true}
                  scrollEnabled={true}
                  zoomEnabled={true}
                  initialRegion={{
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01
                  }}
                >
                  <MapView.Marker
                    key={0}
                    draggable={true}
                    onDragEnd={(e) => this.updateCoordsAddress(e.nativeEvent.coordinate)}
                    coordinate={{
                      latitude: location.coords.latitude,
                      longitude: location.coords.longitude,
                    }}
                    title={'Mi ubicación'}
                    description={'Esta ubicación será registrada en tayd'}
                  />
                </MapView>

                <View style={[styles.bottomContainer, { height: 220 }]}>
                  <View style={[{ justifyContent: 'center', alignContent: 'center', marginTop: 15 }]}>
                    <Text style={{ fontFamily: 'trueno-extrabold', textAlign: 'center', fontWeight: '700', paddingBottom: 10 }} color={nowTheme.COLORS.SECONDARY} size={24}>
                      {wizardText[wizardIndex].title}
                    </Text>
                  </View>

                  <View>
                    <View style={{ justifyContent: 'center', alignContent: 'center' }}>
                      <Text style={{ fontFamily: 'trueno', textAlign: 'center', fontWeight: '500' }} color={nowTheme.COLORS.SECONDARY} size={12}>
                        {wizardText[wizardIndex].subtitle}
                      </Text>
                    </View>

                    <View style={{ justifyContent: 'center', alignContent: 'center', paddingTop: 10, }}>
                      {this.dynamicInput()}
                    </View>

                    <View style={{ justifyContent: 'center', alignSelf: 'center', }}>
                      <Button color={nowTheme.COLORS.BASE} round style={styles.createButton} onPress={() => this.handleBottomButton()}>
                        <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}> SIGUIENTE </Text>
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
            ) : (
              <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.SECONDARY, fontSize: 24 }}>Cargando...</Text>
              </View>
            )
        }
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  overlay: {
    flex: 1,
    position: 'absolute',
    left: 0,
    top: 0,
    opacity: 0.5,
    backgroundColor: 'black',
    width: width,
    zIndex: 1
  },
  mapStyle: {
    zIndex: -1,
    ...StyleSheet.absoluteFillObject,
  },

  inputIcons: {
    marginRight: 25,
    width: 25,
    height: 25,
  },
  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    fontFamily: 'trueno',
    fontSize: 17,
    letterSpacing: 20
  },

  bottomContainer: {
    zIndex: 2,
    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 30,
    width: width * 0.88,
    paddingHorizontal: 20,
    shadowColor: nowTheme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 4
    },
    shadowRadius: 8,
    shadowOpacity: 0.6,
    elevation: 1,
    justifyContent: 'center',
    alignContent: 'center',
    marginBottom: 30,
  },

  createButton: {
    width: width * 0.4,
    marginTop: 15,
    marginBottom: 40
  },
});

export default VehicleLocationScreen;
