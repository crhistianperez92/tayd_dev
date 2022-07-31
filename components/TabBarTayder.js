import React from 'react';
import {
    StyleSheet,
    View,
    TouchableOpacity,
    Image,
    Dimensions,
    Modal,
    Platform,
    ImageBackground,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, Text, theme, Button } from "galio-framework";
import Pusher from 'pusher-js/react-native';

import env from '../lib/enviroment';
import { Images, nowTheme } from '../constants';
import Actions from '../lib/actions';
import ServicesService from '../services/service';

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;
const isIphone = Platform.OS == 'ios' ? true : false;

Pusher.logToConsole = false;

export default class TabBarTayder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen      : this.props.activeScreen,
            token       : AsyncStorage.getItem('access_token'),
            showAlert   : false,
            userData    : null,
            data        : null,
            isLoading   : false,
            weekDay     : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months      : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            scheduleDT  : "",
        }
    }

    componentDidMount() {
        var pusher = new Pusher(env.PUSHER_KEY, {
            authEndpoint: `${env.serverAPI}channels/auth`,
            /* auth: {
                headers: {
                    'Accept': 'application/json',
                    'Authorization': 'Bearer ' + this.state.token
                }
            }, */
            cluster: env.PUSHER_CLUSTER
        });
          
        var channel = pusher.subscribe('private-notifications');
        channel.bind('service-accepted', (data) => {
            this._refreshData(data);
        });

        Actions.extractUserData().then((result) => {
            if(result != null) {
                this.setState({userData : result.user});
            }
       });
    }

    _refreshData(data) {
        this.setState({showAlert: true, data: data, scheduleDT: this.formatDateTime(data) });
    }

    async _acceptService() {
        this.setState({isLoading: true });

        let objService = {
            service_id  : this.state.data.id,
            user_id     : this.state.userData.id
        };

        await ServicesService.acceptService(objService)
            .then(response => {
                this.setState({showAlert: false, data: null, isLoading: false});
                this.props.navigation.navigate("ServiceInfoTayder", {
                    service : response[0]
                });
            })
            .catch(error => {
                this.setState({showAlert: false, isLoading: false});
                Alert.alert("Servicio", "Ocurrió un problema al aceptar el servicio.")
             });
    }

    formatDateTime = (item) => {
        let arrItem = item.dt_request.split(" ");
        let arrDate = arrItem[0].split("-");
        let arrTime = arrItem[1].split(":");

        let datetime    = new Date(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]), Number(arrTime[0]), Number(arrTime[1]));
        let week        = this.state.weekDay[datetime.getDay()];
        let month       = this.state.months[datetime.getMonth()];
        let type        = "a.m.";
        let minutes     = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
        let hour        = datetime.getHours();

        if(hour >= 12) {
            if(hour > 12) hour    -= 12;
            type    = "p.m.";
        }

        return `${week} ${datetime.getDate()} de ${month} del ${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
    }

    render() {
        return (
            <View style={[styles.tabBar, styles.tabBarColor]}>
                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("HomeTayder")}>
                    <Image source={this.state.screen == 'home' ? Images.Icons.Inicio : Images.Icons.Inicio_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'home' ? styles.titleActive : styles.titleInactive]}>Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("EarningsTayder")}>
                    <Image source={this.state.screen == 'ingresos' ? Images.Icons.Agenda : Images.Icons.Agenda_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'ingresos' ? styles.titleActive : styles.titleInactive]}>Ingresos</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("HistoryTayder")}>
                    <Image source={this.state.screen == 'history' ? Images.Icons.Historial : Images.Icons.Historial_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'history' ? styles.titleActive : styles.titleInactive]}>Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("SoporteTayder")}>
                    <Image source={this.state.screen == 'soporte' ? Images.Icons.Ayuda : Images.Icons.Ayuda_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'soporte' ? styles.titleActive : styles.titleInactive]}>Ayuda</Text>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent
                    visible={this.state.showAlert}
                    presentationStyle="overFullScreen">
                    <View style={{ flex: 1, height: height, backgroundColor: 'rgba(0,0,0,.3)', alignItems: 'center' }}>
                        <View style={styles.alertContainer}>
                            <ImageBackground source={Images.LightsBackground} style={{width: width * 0.85}}>
                                <Block middle style={{paddingHorizontal: 15 }}>
                                    <Image source={Images.TaydLogoLarge} style={{ width: 120, height: 25, marginTop: 30 }} />

                                    <Image source={Images.Icons.Agenda} style={{ width: 120, height: 120, marginVertical: 30 }} />

                                    <Text style={[styles.serviceTitle]}>¡Solicitud de Trabajo recibida!</Text>
                                    <Text style={[styles.serviceSubtitle]}>Un usuario cercano a tí, desea agendar una cita de limpieza para</Text>
                                    <Text style={[styles.serviceSubtitleBold]}>{this.state.scheduleDT}</Text>

                                    <Block middle style={{ marginTop: 50 }}>
                                        <Button
                                            round
                                            color={nowTheme.COLORS.PLACEHOLDER}
                                            style={styles.button}
                                            onPress={() => this.setState({showAlert: false})}>
                                            <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                                RECHAZAR
                                            </Text>
                                        </Button>

                                        <Button
                                            round
                                            loading={this.state.isLoading}
                                            disabled={this.state.isLoading}
                                            color={nowTheme.COLORS.BASE}
                                            style={[styles.button, {marginTop: 15, marginBottom: 25}]}
                                            onPress={() => this._acceptService()}>
                                            <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                                ACEPTAR
                                            </Text>
                                        </Button>
                                    </Block>
                                </Block>
                            </ImageBackground>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        width: width,
        height: 50,
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: isIphone && height >= 812 ? 20 : 0,
    },
    tabBarColor: {
        backgroundColor: '#232323',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabTitle: {
        fontSize: 11,
    },
    titleInactive: {
        color: '#999999',
    },
    titleActive: {
        color: nowTheme.COLORS.BASE,
    },

    alertContainer: {
        width: width * 0.85,
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginTop: smallScreen ? 70 : 100,

        alignContent: 'center',
        overflow: 'hidden'
    },
    serviceTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.GREY5,
        fontSize: 31,
        lineHeight: 32,
        textAlign: 'center',
        paddingVertical: 20,
    },
    serviceSubtitle: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.GREY5,
        textAlign: 'center',
    },
    serviceSubtitleBold: {
        fontFamily: 'trueno-semibold',
        color: nowTheme.COLORS.GREY5,
        fontSize: 16,
        textAlign: 'center',
    },
    button: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },
    
});