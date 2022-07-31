import React from "react";
import {
  Image,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Text, View, Alert, ScrollView
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import { CommonActions } from '@react-navigation/native';

const { height, width } = Dimensions.get("screen");

import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";
import Actions from "../../lib/actions";
import PropertyService from "../../services/property";

class DomicilioIndexScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      properties: [],
    }
  }

  async componentDidMount() {
    const { navigation, route } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
        this._getProperties();
      }
    });

    this.focusListener = await navigation.addListener('focus', () => {
      this._getProperties();
    });
    this.blurListener = await navigation.addListener('blur', () => {
      navigation.dispatch(CommonActions.setParams({ isNewProperty: false }));

    });
  }

  componentWillUnmount() {
    this.blurListener()
    this.focusListener()
  }

  async _getProperties() {
    const { route } = this.props;
    await PropertyService.getUserProperties(this.state.userData.id)
      .then(response => {
        this.setState({ properties: response })
        route?.params?.isNewProperty && this.setPredetermined(response[response.length - 1])
      })
      .catch(error => {
        Alert.alert("No se encontraron domicilios vinculados a este usuario.");
      })
  }

  async setPredetermined(itemProperty) {
    if (!itemProperty.is_predetermined) {
      await PropertyService.setPredeterminedProperty(itemProperty.id)
        .then(response => {
          this._getProperties();
        })
        .catch(error => {
          Alert.alert("No se logró predeterminar este domicilio.");
        })
    }
  }

  render() {
    const { navigation } = this.props;

    return (
      <Block safe flex={1} style={styles.container}>
        <Block flex={2} space="between" style={styles.padded}>
          <Block flex={5} style={styles.list}>
            <ScrollView>
              {
                this.state.properties.map((item) => {
                  return (
                    <Block middle style={styles.cardContainer} key={item.id}>
                      <TouchableOpacity onPress={() => this.setPredetermined(item)}>
                        <View style={{ width: width - theme.SIZES.BASE * 4, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10, paddingRight: 10 }}>
                          {item.is_predetermined == true && (<Image source={require('../../assets/icons/success.png')} style={{ width: 25, height: 25 }} />)}
                        </View>

                        <Block row style={[{ width: width - theme.SIZES.BASE * 4, paddingBottom: 10, paddingHorizontal: 15, alignItems: 'center' }, !item.is_predetermined && { paddingTop: 15 }]}>
                          <View style={{ paddingHorizontal: 25 }}>
                            {item.property_type_id == 1 && (<Image source={Images.Icons.Casa} style={styles.imageProperty} />)}
                            {item.property_type_id == 2 && (<Image source={Images.Icons.Departamento} style={styles.imageProperty} />)}
                            {item.property_type_id == 3 && (<Image source={Images.Icons.Oficina} style={styles.imageProperty} />)}
                          </View>

                          <View style={{ width: 150, marginTop: -15 }}>
                            <Text style={[styles.title]}>{item.property_type.name == "Departamento" ? "Dpto." : item.property_type.name}</Text>
                            <Text style={[styles.subtitle]} color={nowTheme.COLORS.SECONDARY}>{item.name}</Text>
                          </View>
                        </Block>
                      </TouchableOpacity>
                    </Block>
                  )
                })
              }
              <Block middle flex style={{ justifyContent: 'flex-end' }}>
                <Button
                  round
                  color={nowTheme.COLORS.WHITE}
                  style={styles.button}
                  onPress={() => navigation.navigate('DomicilioLocation')}>
                  <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.BASE, }} size={14}>
                    AGREGAR DOMICILIO  +
                  </Text>
                </Button>
              </Block>
            </ScrollView>
          </Block>
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: 80,
    backgroundColor: '#F2F2F2'
  },
  list: {
    paddingTop: 25,
  },
  cardContainer: {
    backgroundColor: nowTheme.COLORS.WHITE,
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

    marginBottom: 20,
  },
  padded: {
    paddingHorizontal: theme.SIZES.BASE * 2,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.SECONDARY,
    fontSize: 24,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'left',
  },
  button: {
    width: width * 0.5,
    height: theme.SIZES.BASE * 2.5,
    marginTop: 10,
    marginBottom: 10,

    shadowRadius: 0,
    shadowOpacity: 0,

    borderColor: nowTheme.COLORS.BASE,
    borderWidth: 1,
  },
  imageProperty: {
    width: 65,
    height: 65
  }
});

export default DomicilioIndexScreen;
