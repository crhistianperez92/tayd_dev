import React from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer'
// screens
import Home from '../screens/Home';
import History from '../screens/History';
import Schedule from '../screens/Schedule';
import ProfileScreen from '../screens/perfil/index';
import RegisterScreen from '../screens/Register';
import RegisterTayderScreen from '../screens/RegisterTayder';
import LoginScreen from '../screens/Login';
import Onboarding from '../screens/Onboarding';
import PropertyLocationScreen from '../screens/PropertyLocation';
import PropertyInfoScreen from '../screens/PropertyInfo';

import DocumentosIndexScreen from '../screens/documentos/Index';
import DocumentosStep1Screen from '../screens/documentos/Step1';
import DocumentosStep2Screen from '../screens/documentos/Step2';
import DocumentosStep3Screen from '../screens/documentos/Step3';
import DocumentosStep4Screen from '../screens/documentos/Step4';
import DocumentosSuccessScreen from '../screens/documentos/Success';
import DocumentosValidationScreen from '../screens/documentos/Validation';

import WelcomeScreen from '../t-screens/Welcome';
import HomeTayder from '../t-screens/Home';
import EarningsTayder from '../t-screens/Earnings';
import HistoryTayder from '../t-screens/History';
import ServiceInfoTayder from '../t-screens/ServiceInfo';
import ServiceProgressTayder from '../t-screens/ServiceProgress';
import ServiceFinishTayder from '../t-screens/ServiceFinish';
import ChatTayderScreen from '../t-screens/Chat';

import AgendaIndexScreen from '../screens/agenda/Index';
import AgendaFechaScreen from '../screens/agenda/DateAddressConf';
import AgendaInsumosScreen from '../screens/agenda/SuppliesConf';
import AgendaCheckoutScreen from '../screens/agenda/CheckoutConf';
import AgendaSuccessScreen from '../screens/agenda/Success';
import AgendaProgressScreen from '../screens/agenda/Progress';
import AgendaChatScreen from '../screens/agenda/Chat';

import VehicleDateTimeScreen from '../screens/vehiculos/DateTimeConfiguration';
import VehicleSelectionScreen from '../screens/vehiculos/VehicleSelection';
import VehicleServiceSelectionScreen from '../screens/vehiculos/VehicleServiceSelection';
import VehicleLocationScreen from '../screens/vehiculos/Location';
import VehicleCheckoutScreen from '../screens/vehiculos/CheckoutConf';

import RateServiceScreen from '../screens/RateService';

import DomicilioIndexScreen from '../screens/domicilios/Index';
import DomicilioInfoScreen from '../screens/domicilios/Information';
import DomicilioLocationScreen from '../screens/domicilios/Location';

import MetodoPagoIndexScreen from '../screens/metodosPagos/Index';
import MetodoPagoAddCardScreen from '../screens/metodosPagos/AddCard';

import CuponesIndexScreen from '../screens/cupones/Index';

import GeneraIngresoIndexScreen from '../screens/generarIngresos/Index';

import SoporteIndexScreen from '../screens/soporte/Index';
import SoporteCitaScreen from '../screens/soporte/Cita';

import SoporteTayderIndexScreen from '../t-screens/soporte/Index';
import SoporteTayderGuiaBasicaScreen from '../t-screens/soporte/GuiaBasica';

// drawer
import DrawerUser from './DrawerUser';
import DrawerTayder from './DrawerTayder';
import DrawerItem from '../components/DrawerItem';

// header for screens
import Header from '../components/Header';
import { nowTheme } from '../constants';

const { width } = Dimensions.get('screen');

const Stack = createStackNavigator()
const Drawer = createDrawerNavigator();

const transitionConfig = (transitionProps, prevTransitionProps) => ({
  transitionSpec: {
    duration: 400,
    easing: Easing.out(Easing.poly(4)),
    timing: Animated.timing
  },
  screenInterpolator: sceneProps => {
    const { layout, position, scene } = sceneProps;
    const thisSceneIndex = scene.index;
    const width = layout.initWidth;

    const scale = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [4, 1, 1]
    });
    const opacity = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex, thisSceneIndex + 1],
      outputRange: [0, 1, 1]
    });
    const translateX = position.interpolate({
      inputRange: [thisSceneIndex - 1, thisSceneIndex],
      outputRange: [width, 0]
    });

    const scaleWithOpacity = { opacity };
    const screenName = 'Search';

    if (
      screenName === transitionProps.scene.route.routeName ||
      (prevTransitionProps && screenName === prevTransitionProps.scene.route.routeName)
    ) {
      return scaleWithOpacity;
    }
    return { transform: [{ translateX }] };
  }
});

function ProfileStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Perfil" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }
        }
      />
    </Stack.Navigator>
  )
}
function ChatStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="Chat"
        component={AgendaChatScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Chat" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }
        }
      />
    </Stack.Navigator>
  )
}
function ChatTayderStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="ChatTayder"
        component={ChatTayderScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Chat" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }
        }
      />
    </Stack.Navigator>
  )
}

function DomicilioStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="DomicilioIndex"
        component={DomicilioIndexScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }}
      />
      <Stack.Screen
        name="DomicilioLocation"
        component={DomicilioLocationScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }}
      />
      <Stack.Screen
        name="DomicilioInfo"
        component={DomicilioInfoScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }}
      />
    </Stack.Navigator>
  )
}
function MetodoPagoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="MetodoPagoIndex"
        component={MetodoPagoIndexScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }}
      />
      <Stack.Screen
        name="MetodoPagoAddCard"
        component={MetodoPagoAddCardScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }}
      />
    </Stack.Navigator>
  )
}

function GeneraIngresoStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="GeneraIngresoIndex"
        component={GeneraIngresoIndexScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Genera Ingresos" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }
        }
      />
    </Stack.Navigator>
  )
}

function CuponesStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        gestureEnabled: false
      }}
    >
      <Stack.Screen
        name="CuponesIndex"
        component={CuponesIndexScreen}
        options={navOpt => {
          return {
            header: (
              <Header title="Cupones" iconColor={nowTheme.COLORS.SECONDARY} navigation={navOpt} />
            ),
            headerTransparent: false
          }
        }
        }
      />
    </Stack.Navigator>
  )
}


function Drawer2() {
  return (
    <Drawer.Navigator>
      <Drawer.Screen
        name="HomeTayder"
        component={HomeTayder}
        options={navOpt => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="HomeTayder" title="Inicio" />
          )
        })
        }
      />
      <Drawer.Screen
        name="HistoryTayder"
        component={HistoryTayder}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="ServiceInfoTayder"
        component={ServiceInfoTayder}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="ServiceProgressTayder"
        component={ServiceProgressTayder}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="ServiceFinishTayder"
        component={ServiceFinishTayder}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="EarningsTayder"
        component={EarningsTayder}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="ChatServiceTayder"
        component={ChatTayderStack}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="SoporteTayder"
        component={SoporteTayderIndexScreen}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="SoporteTayderGuiaBasica"
        component={SoporteTayderGuiaBasicaScreen}
        options={navOpt => ({
          drawerLabel: () => { }
        })
        }
      />
    </Drawer.Navigator>
  )
}

function DrawerClient() {
  return (
    <Drawer.Navigator
      initialRouteName={'Home'}
      drawerContent={props => <DrawerUser {...props} />}
      drawerStyle={
        {
          width: width * 0.95,
          backgroundColor: '#F7F7F7'
        }
      }
      drawerContentOptions={{
        activeTintColor: nowTheme.COLORS.SECONDARY,
        inactiveTintColor: nowTheme.COLORS.SECONDARY,
        activeBackgroundColor: 'transparent',
        itemStyle: {
          width: width * 1,
          backgroundColor: 'transparent'
        },
        labelStyle: {
          fontSize: 18,
          marginLeft: 20,
          fontWeight: 'normal'
        },
        itemsContainerStyle: {
          paddingVertical: 16,
          paddingHorizonal: 12,
          justifyContent: 'center',
          alignContent: 'center',
          alignItems: 'center',
          overflow: 'hidden',
        }
      }}
    >
      <Drawer.Screen
        name="Home"
        component={Home}
        options={() => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="Home" title="Inicio" />
          )
        })}
      />
      <Drawer.Screen
        name="History"
        component={History}
        options={{
          drawerLabel: () => null
        }}
      />
      <Drawer.Screen
        name="RateService"
        component={RateServiceScreen}
        options={() => ({
          drawerLabel: () => null
        })}
      />
      <Drawer.Screen
        name="Soporte"
        component={SoporteIndexScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="SoporteCita"
        component={SoporteCitaScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="BolsaTrabajo"
        component={SoporteCitaScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="Schedule"
        component={Schedule}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="Agenda"
        component={AgendaIndexScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaFecha"
        component={AgendaFechaScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaInsumos"
        component={AgendaInsumosScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaCheckout"
        component={AgendaCheckoutScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaSuccess"
        component={AgendaSuccessScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaProgreso"
        component={AgendaProgressScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="AgendaChat"
        component={ChatStack}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="VehiculoFecha"
        component={VehicleDateTimeScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="VehiculoSeleccion"
        component={VehicleSelectionScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="VehiculoServicio"
        component={VehicleServiceSelectionScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="VehiculoUbicacion"
        component={VehicleLocationScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="VehiculoCheckout"
        component={VehicleCheckoutScreen}
        options={() => ({
          drawerLabel: () => null
        })
        }
      />
      <Drawer.Screen
        name="Perfil"
        component={ProfileStack}
        options={() => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="Profile" title="Perfil" />
          )
        })
        }
      />
      <Drawer.Screen
        name="Idioma"
        component={ProfileStack}
        options={() => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="Profile" title="Idioma" />
          )
        })
        }
      />
      <Drawer.Screen
        name="Domicilio"
        component={DomicilioStack}
        options={() => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="DomicilioIndex" title="Domicilio" />
          )
        })
        }
      />
      <Drawer.Screen
        name="MetodoPago"
        component={MetodoPagoStack}
        options={() => ({
          drawerLabel: ({ focused }) => (
            <DrawerItem focused={focused} screen="MetodoPagoIndex" title="Método de pago" />
          )
        })
        }
      />
      <Drawer.Screen
        name="GeneraIngreso"
        component={GeneraIngresoStack}
        options={() => ({
          drawerLabel: () => { }
        })
        }
      />
      <Drawer.Screen
        name="Cupones"
        component={CuponesStack}
        options={() => ({
          drawerLabel: () => { }
        })
        }
      />
    </Drawer.Navigator>
  )
}

function RootStack() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Onboarding"
        screenOptions={{
          headerShown: false,
          gestureEnabled: false
        }}
      >
        <Stack.Screen
          name="Onboarding"
          component={Onboarding}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="Register"
          component={RegisterScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="RegisterTayder"
          component={RegisterTayderScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosIndex"
          component={DocumentosIndexScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosStep1"
          component={DocumentosStep1Screen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosStep2"
          component={DocumentosStep2Screen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosStep3"
          component={DocumentosStep3Screen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosStep4"
          component={DocumentosStep4Screen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosSuccess"
          component={DocumentosSuccessScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DocumentosValidacion"
          component={DocumentosValidationScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="Welcome"
          component={WelcomeScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="PropertyLocation"
          component={PropertyLocationScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="PropertyInfo"
          component={PropertyInfoScreen}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DrawerClient"
          component={DrawerClient}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
        <Stack.Screen
          name="DrawerTayder"
          component={Drawer2}
        // options={{
        //   header: null,
        //   gesturesEnabled: true
        // }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  )
}

export default RootStack;
