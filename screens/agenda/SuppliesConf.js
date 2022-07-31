import React from 'react';
import { Image, StyleSheet, ScrollView, Dimensions, Platform, View } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { HeaderHeight } from '../../constants/utils';

import { Images, nowTheme } from '../../constants/';
import GeneralSettingService from "../../services/generalSetting";

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;

export default class AgendaInsumosScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSelected: false,
      userData: this.props.route.params.userData,
      propertyInfo: this.props.route.params.propertyInfo,
      datetime: this.props.route.params.datetime,
      setting: null,
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await GeneralSettingService.getByKey('SERVICIO_INSUMOS_EXTRA')
      .then(response => {
        this.setState({ setting: response });
      })
      .catch(error => console.error(error));

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState({
        isSelected: false,
        userData: this.props.route.params.userData,
        propertyInfo: this.props.route.params.propertyInfo,
        datetime: this.props.route.params.datetime,
      })
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  _handleSelection() {
    this.setState({ isSelected: !this.state.isSelected });
  }

  _handleNextAction() {
    this.props.navigation.navigate("AgendaCheckout", {
      userData: this.state.userData,
      propertyInfo: this.state.propertyInfo,
      datetime: this.state.datetime,
      hasSupplies: this.state.isSelected
    });
  }

  render() {
    const { isSelected, setting } = this.state;
    return (
      <Block flex style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <Block>
            <Image source={Images.AgendaInsumos} style={styles.image} />
          </Block>

          <Block flex style={{ backgroundColor: 'white' }}>
            <Block space="between" style={styles.padded}>
              <Block>
                <Text style={[styles.title, { paddingTop: 50 }]}>¿Cuentas con los insumos necesarios?</Text>
                <Text style={[styles.subtitle, { paddingVertical: 10, height: 100 }]}>
                  En TAYD ofrecemos los materiales básicos para limpiar tu domicilio de manera profunda con un costo extra de ${setting != null ? parseFloat(setting.value).toFixed(2) : '0.00'}
                </Text>

                <Block middle style={{ width: width - theme.SIZES.BASE * 4 }}>
                  {
                    isSelected ? (
                      <Button
                        round
                        color={'#F4F4F4'}
                        style={styles.addedButton}
                        onPress={() => this._handleSelection()}>
                        <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={'#DDDDDD'}>
                          INSUMOS AGREGADOS
                        </Text>
                      </Button>
                    ) : (
                      <Button
                        round
                        color={nowTheme.COLORS.WHITE}
                        style={styles.addButton}
                        onPress={() => this._handleSelection()}>
                        <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.BASE}>
                          AGREGAR INSUMOS +
                        </Text>
                      </Button>
                    )
                  }
                </Block>

                <Text style={[styles.subtitle2, { paddingVertical: 10 }]}>Los insumos solo se llevan para realizar la limpieza.</Text>

                <Block middle style={{ width: width - theme.SIZES.BASE * 4 }}>
                  <Button
                    round
                    color={nowTheme.COLORS.BASE}
                    style={styles.createButton}
                    onPress={() => this._handleNextAction()}>
                    <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                      {isSelected ? 'SIGUIENTE' : 'OMITIR'}
                    </Text>
                  </Button>
                </Block>
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
    height: smallScreen ? 435 : 450,
    marginTop: smallScreen ? 0 : 50,
  },
  title: {
    fontFamily: 'trueno-extrabold',
    paddingHorizontal: 10,
    fontSize: smallScreen ? 26 : 28,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'trueno',
    textAlign: 'center',
    fontSize: 16,
    paddingBottom: 7,
  },
  subtitle2: {
    fontFamily: 'trueno',
    textAlign: 'center',
    fontSize: 12,
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
  addButton: {
    width: width * 0.5,
    marginTop: 10,
    marginBottom: 10,

    shadowRadius: 0,
    shadowOpacity: 0,

    borderColor: nowTheme.COLORS.BASE,
    borderWidth: 1,
  },
  addedButton: {
    width: width * 0.5,
    marginTop: 10,
    marginBottom: 10,
    shadowRadius: 0,
    shadowOpacity: 0,
  },

  createButton: {
    width: width * 0.5,
    shadowRadius: 0,
    shadowOpacity: 0,
    marginTop: 10,
    marginBottom: 10
  },
});