import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Text, Block } from 'galio-framework'
import PropertyTypeService from '../services/propertyType';
import Icon from './Icon';
import { nowTheme } from "../constants";

const icons = [
  require('../assets/icons/T-casa.png'),
  require('../assets/icons/T-Depa.png'),
  require('../assets/icons/T-Ofi.png'),
];

const iconsDisabled = [
  require('../assets/icons/T-casa-gris.png'),
  require('../assets/icons/T-Depa-gris.png'),
  require('../assets/icons/T-Ofi-gris.png'),
];

export default class PropertyType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      propertyTypes: [],
      newValue: this.props.value,
    };
  }

  async componentDidMount() {
    await PropertyTypeService.getAll()
      .then(response => {
        this.setState({ propertyTypes: response.propertyTypes });
      })
      .catch(error => {
        console.error(error);
        alert('Ocurrió un error al generar los tipos de inmuebles.');
      })
  }

  _onPress(_id, prices) {
    this.setState({ newValue: _id });
    this.props.updateValue(_id, prices);
  }

  render() {
    const { propertyTypes, newValue } = this.state;
    return (
      <Block style={{ justifyContent: 'space-evenly', flexDirection: 'row' }}>
        {
          propertyTypes.map((value) => {
            return (
              <TouchableOpacity style={{ backgroundColor: 'transparent' }} key={value.id} onPress={() => this._onPress(value.id, value.prices)}>
                <Block middle>
                  <Block row>
                    {
                      (newValue == value.id)
                        ? (
                          <Image source={icons[value.id - 1]} style={{ width: 40, height: 40 }} />
                        )
                        : (
                          <Image source={iconsDisabled[value.id - 1]} style={{ width: 40, height: 40 }} />
                        )
                    }
                    <Block middle>
                      {
                        newValue == value.id && (
                          <Icon
                            size={22}
                            color={nowTheme.COLORS.BASE}
                            name="chevron-right"
                            family="FontAwesome"
                          />
                        )
                      }
                    </Block>
                  </Block>
                  <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.label}>{value.name}</Text>
                  </View>
                </Block>
              </TouchableOpacity>
            )
          })
        }
      </Block>
    );
  }
}

PropertyType.propTypes = {
  newValue: PropTypes.number,
  label: PropTypes.string,
};

const styles = StyleSheet.create({
  checkboxContainer: {
    alignItems: 'center',
    padding: 10,
  },
  label: {
    fontFamily: 'trueno',
    fontWeight: '400',
    color: '#444444',
    fontSize: 16,
  }
});
