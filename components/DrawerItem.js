import React from 'react';
import { StyleSheet, Image } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import Icon from './Icon';
import Images from '../constants/Images';
import nowTheme from '../constants/Theme';

class DrawerItem extends React.Component {
  renderIcon = () => {
    const { title } = this.props;

    switch (title) {
      case 'Inicio':
        return (
          <Image source={Images.Icons.Home} style={{ width: 30, height: 30 }} />
        );
      case 'Perfil':
        return (
          <Image source={Images.Icons.Perfil} style={{ width: 30, height: 30 }} />
        );
      case 'Idioma':
        return (
          <Image source={Images.Icons.Idioma} style={{ width: 30, height: 30 }} />
        );
      case 'Domicilio':
        return (
          <Image source={Images.Icons.Ubicacion} style={{ width: 30, height: 30 }} />
        );
      case 'Método de pago':
        return (
          <Image source={Images.Icons.Pagos} style={{ width: 30, height: 30 }} />
        );
      case 'Cupones':
        return (
          <Image source={Images.Icons.Cupon} style={{ width: 30, height: 30 }} />
        );
      case 'Comparte y gana':
        return (
          <Image source={Images.Icons.Compartir} style={{ width: 30, height: 30 }} />
        );
      case 'Genera ingresos extras':
        return (
          <Image source={Images.Icons.Ingreso} style={{ width: 30, height: 30 }} />
        );
      case 'Cerrar sesión':
        return (
          <Image source={Images.Icons.Salir} style={{ width: 30, height: 30 }} />
        );
      default:
        return null;
    }
  };

  render() {
    const { focused, title } = this.props;

    const containerStyles = [styles.defaultStyle, focused ? [styles.activeStyle, styles.shadow] : null];

    return (
      <Block flex row style={containerStyles}>
        <Block middle flex={0.1} style={{ marginLeft: 25, marginRight: 25 }}>
          {this.renderIcon()}
        </Block>

        <Block row center flex={0.9}>
          <Text
            style={{ fontFamily: 'trueno', }}
            size={18}
            color={nowTheme.COLORS.SECONDARY}
          >
            {title}
          </Text>
        </Block>

        <Block middle flex={0.1} style={{ marginRight: 5 }}>
          <Icon
            size={22}
            color={nowTheme.COLORS.SECONDARY}
            name="chevron-right"
            family="FontAwesome"
          />
        </Block>
      </Block>
    );
  }
}

const styles = StyleSheet.create({
  defaultStyle: {
    paddingVertical: 15,
    paddingHorizontal: 14,
    backgroundColor: 'white',
    color: nowTheme.COLORS.SECONDARY
  },
  activeStyle: {
    backgroundColor: '#EBEBEB',
    color: nowTheme.COLORS.SECONDARY
  },
  shadow: {
    shadowColor: theme.COLORS.BLACK,
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowRadius: 8,
    shadowOpacity: 0.1
  }
});

export default DrawerItem;
