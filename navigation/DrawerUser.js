import React, { useState, useEffect } from 'react';
import { DrawerContentScrollView, DrawerItemList, DrawerItem } from '@react-navigation/drawer'
import { ScrollView, StyleSheet, Dimensions, Image, TouchableOpacity } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import Images from '../constants/Images';
import { iPhoneX } from "../constants/utils";
import { DrawerItem as Item } from '../components/index';
import Actions from '../lib/actions';

import nowTheme from '../constants/Theme';

function DrawerUser(props) {
  const { state, ...rest } = props;

  const [userData, setUserData] = useState(null)
  const [newState, setNewState] = useState({ ...props.state })
  const _logout = () => {
    Actions.removeUserData().then((response) => {
      if (response) {
        setTimeout(() => {
          props.navigation.navigate('Onboarding')
        }, 500);
      }
    });
  }

  useEffect(() => {
    Actions.extractUserData().then((result) => {
      if (result != null) {
        setUserData(result.user)
      }
    });
    newState.routes = newState.routes.filter(item =>
      item.name !== 'History' &&
      item.name !== 'RateService' &&
      item.name !== 'Soporte' &&
      item.name !== 'SoporteCita' &&
      item.name !== 'BolsaTrabajo' &&
      item.name !== 'Schedule' &&
      item.name !== 'Agenda' &&
      item.name !== 'AgendaFecha' &&
      item.name !== 'AgendaInsumos' &&
      item.name !== 'AgendaCheckout' &&
      item.name !== 'AgendaSuccess' &&
      item.name !== 'AgendaProgreso' &&
      item.name !== 'AgendaChat' &&
      item.name !== 'VehiculoFecha' &&
      item.name !== 'VehiculoSeleccion' &&
      item.name !== 'VehiculoServicio' &&
      item.name !== 'VehiculoUbicacion' &&
      item.name !== 'VehiculoCheckout' &&
      item.name !== 'GeneraIngreso' &&
      item.name !== 'MetodoPago' &&
      item.name !== 'Cupones' &&
      item.name !== 'Idioma'
    )
    setNewState(newState)
  }, [])

  return (
    <DrawerContentScrollView {...props}>
      <Block style={styles.container} forceInset={{ top: 'always', horizontal: 'never' }}>
        <Block row style={styles.header}>
          <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginRight: 25 }} />
          <Block flex>
            <Text style={styles.nameTitle}>{userData != null && userData.info ? userData.info.name : ''}</Text>
            <Text style={{ fontFamily: 'trueno', fontSize: 14, lineHeight: 15 }}>{userData != null ? userData.email : ''}</Text>
          </Block>
        </Block>
        <Block flex>
          <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
            <Block style={{ paddingTop: 20 }}>
              <Text style={styles.sectionTitle}>Cuenta</Text>
            </Block>
            <TouchableOpacity onPress={() => props.navigation.navigate('DrawerClient', { screen: 'Home' })} style={{ fontFamily: 'trueno', fontSize: 18, paddingTop: 20 }}>
              <Item {...props} title="Inicio" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('Domicilio')} style={{ fontFamily: 'trueno', fontSize: 18 }}>
              <Item {...props} title="Domicilio" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('MetodoPago')} style={{ fontFamily: 'trueno', fontSize: 18, paddingBottom: 20 }}>
              <Item {...props} title="Método de pago" />
            </TouchableOpacity>
            <Text style={styles.sectionTitle}>Extra</Text>
            <TouchableOpacity onPress={() => props.navigation.navigate('Cupones', { screen: 'CuponesIndex' })} style={{ fontFamily: 'trueno', fontSize: 18, paddingTop: 20 }}>
              <Item {...props} title="Cupones" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => props.navigation.navigate('GeneraIngreso')} style={{ fontFamily: 'trueno', fontSize: 18, }}>
              <Item {...props} title="Genera ingresos extras" />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => _logout(props)} style={{ fontFamily: 'trueno', fontSize: 18, }}>
              <Item {...props} title="Cerrar sesión" />
            </TouchableOpacity>
          </ScrollView>
        </Block>

        <Block style={{ justifyContent: 'center', alignSelf: 'center', paddingBottom: 30 }}>
          <Image source={Images.TaydLogoGris} style={{ height: 30, width: 140, marginTop: 20 }} />
        </Block>
      </Block>
    </DrawerContentScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  header: {
    paddingHorizontal: 28,
    paddingTop: theme.SIZES.BASE,
    justifyContent: 'center'
  },
  sectionTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 32,
    color: nowTheme.COLORS.SECONDARY,
    paddingLeft: 20,
  },
  nameTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 24,
    color: nowTheme.COLORS.SECONDARY,
    lineHeight: 29,
  },
  headerIcon: {
    marginTop: -20
  },
  logo: {
    height: 40,
    width: 37
  }
});

export default DrawerUser