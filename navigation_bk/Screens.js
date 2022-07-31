import React from 'react';
import { Easing, Animated, Dimensions } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import { createDrawerNavigator } from 'react-navigation-drawer';

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
import Drawer from './Drawer';
import DrawerTayder from './DrawerTayder';
import DrawerItem from '../components/DrawerItem';

// header for screens
import Header from '../components/Header';
import { nowTheme } from '../constants';

const { width } = Dimensions.get('screen');

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

const ProfileStack = createStackNavigator(
  {
    Profile: {
      screen: ProfileScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Perfil" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: true
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const ChatStack = createStackNavigator(
  {
    Chat: {
      screen: AgendaChatScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back goToSchedule title="Chat" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const ChatTayderStack = createStackNavigator(
  {
    ChatTayder: {
      screen: ChatTayderScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back goToScheduleTayder title="Chat" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const DomicilioStack = createStackNavigator(
  {
    DomicilioIndex: {
      screen: DomicilioIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    DomicilioLocation: {
      screen: DomicilioLocationScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    DomicilioInfo: {
      screen: DomicilioInfoScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Domicilio" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const MetodoPagoStack = createStackNavigator(
  {
    MetodoPagoIndex: {
      screen: MetodoPagoIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    },
    MetodoPagoAddCard: {
      screen: MetodoPagoAddCardScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header back title="Método de pago" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const GeneraIngresoStack = createStackNavigator(
  {
    GeneraIngresoIndex: {
      screen: GeneraIngresoIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Genera Ingresos" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const CuponesStack = createStackNavigator(
  {
    CuponesIndex: {
      screen: CuponesIndexScreen,
      navigationOptions: ({ navigation }) => ({
        header: (
          <Header title="Cupones" iconColor={nowTheme.COLORS.SECONDARY} navigation={navigation} />
        ),
        headerTransparent: false
      })
    }
  },
  {
    cardStyle: { backgroundColor: '#FFFFFF' },
    transitionConfig
  }
);

const Drawer2 = createDrawerNavigator(
  {
    HomeTayder: {
      screen: HomeTayder,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="HomeTayder" title="Inicio" />
        )
      })
    },
    HistoryTayder: {
      screen: HistoryTayder,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    ServiceInfoTayder: {
      screen: ServiceInfoTayder,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    ServiceProgressTayder: {
      screen: ServiceProgressTayder,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    ServiceFinishTayder: {
      screen: ServiceFinishTayder,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    EarningsTayder: {
      screen: EarningsTayder,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    ChatServiceTayder: {
      screen: ChatTayderStack,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    SoporteTayder: {
      screen: SoporteTayderIndexScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    SoporteTayderGuiaBasica: {
      screen: SoporteTayderGuiaBasicaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
  },
  {
    contentComponent: DrawerTayder,
    drawerBackgroundColor: '#F7F7F7',
    drawerWidth: width * 0.95,
    contentOptions: {
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
    },
    initialRouteName: 'HomeTayder',
  }
)

const DrawerClient = createDrawerNavigator(
  {
    Home: {
      screen: Home,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Home" title="Inicio" />
        )
      })
    },
    History: {
      screen: History,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    RateService: {
      screen: RateServiceScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },

    Soporte: {
      screen: SoporteIndexScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    SoporteCita: {
      screen: SoporteCitaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    BolsaTrabajo: {
      screen: SoporteCitaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },

    Schedule: {
      screen: Schedule,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Agenda: {
      screen: AgendaIndexScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaFecha: {
      screen: AgendaFechaScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaInsumos: {
      screen: AgendaInsumosScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaCheckout: {
      screen: AgendaCheckoutScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaSuccess: {
      screen: AgendaSuccessScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaProgreso: {
      screen: AgendaProgressScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    AgendaChat: {
      screen: ChatStack,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },

    VehiculoFecha: {
      screen: VehicleDateTimeScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    VehiculoSeleccion: {
      screen: VehicleSelectionScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    VehiculoServicio: {
      screen: VehicleServiceSelectionScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    VehiculoUbicacion: {
      screen: VehicleLocationScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    VehiculoCheckout: {
      screen: VehicleCheckoutScreen,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },

    Perfil: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Perfil" />
        )
      })
    },
    Idioma: {
      screen: ProfileStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="Profile" title="Idioma" />
        )
      })
    },
    Domicilio: {
      screen: DomicilioStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="DomicilioIndex" title="Domicilio" />
        )
      })
    },
    MetodoPago: {
      screen: MetodoPagoStack,
      navigationOptions: navOpt => ({
        drawerLabel: ({ focused }) => (
          <DrawerItem focused={focused} screen="MetodoPagoIndex" title="Método de pago" />
        )
      })
    },
    GeneraIngreso: {
      screen: GeneraIngresoStack,
      navigationOptions: {
        drawerLabel: () => { }
      }
    },
    Cupones: {
      screen: CuponesStack,
      navigationOptions: {
        drawerLabel: () => { }
      }
    }
  },
  {
    contentComponent: Drawer,
    drawerBackgroundColor: '#F7F7F7',
    drawerWidth: width * 0.95,
    contentOptions: {
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
    },
    initialRouteName: 'Home',
  }
);

// Main App Navigation
export const AppStack = createSwitchNavigator({
  Onboarding: {
    screen: Onboarding,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Login: {
    screen: LoginScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  Register: {
    screen: RegisterScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  RegisterTayder: {
    screen: RegisterTayderScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  DocumentosIndex: {
    screen: DocumentosIndexScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosStep1: {
    screen: DocumentosStep1Screen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosStep2: {
    screen: DocumentosStep2Screen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosStep3: {
    screen: DocumentosStep3Screen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosStep4: {
    screen: DocumentosStep4Screen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosSuccess: {
    screen: DocumentosSuccessScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DocumentosValidacion: {
    screen: DocumentosValidationScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  Welcome: {
    screen: WelcomeScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  PropertyLocation: {
    screen: PropertyLocationScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  PropertyInfo: {
    screen: PropertyInfoScreen,
    navigationOptions: {
      header: null,
      gesturesEnabled: true
    }
  },
  DrawerClient: {
    screen: DrawerClient,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  },
  DrawerTayder: {
    screen: Drawer2,
    navigationOptions: {
      header: null,
      gesturesEnabled: false
    }
  }
},
  {
    headerMode: 'none',
    initialRouteName: "Onboarding",
  }
);

const AppContainer = createAppContainer(AppStack);
export default AppContainer;
