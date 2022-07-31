import React from 'react';
import { StyleSheet, Dimensions, Image, View, Alert } from "react-native";
import { Block, Text, theme, Button } from 'galio-framework';
import { TouchableOpacity, ScrollView } from "react-native-gesture-handler";
import moment from 'moment';

import { Images, nowTheme } from '../constants/';
import ServicesService from '../services/service';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class ServiceCardSliderTayder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            weekDay         : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months          : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            items           : this.props.items,
        };
    }

    componentDidUpdate(nextProps) {
        const { items } = this.props
        if (nextProps.items !== items) {
            this.setState({items: items})
        }
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
            if(hour > 12) hour -= 12;
            type    = "p.m.";
        }

        if(arrItem[0] == moment().format('YYYY-MM-DD')) {
            return `Cita agendada para hoy a ${hour == 1 ? 'la' : 'las'} ${hour}:${minutes} ${type}`;
        }

        let dateTomorrow = moment().add(1, "days").format('YYYY-MM-DD')
        if(arrItem[0] == dateTomorrow) {
            return `Cita agendada para mañana a ${hour == 1 ? 'la' : 'las'} ${hour}:${minutes} ${type}`;
        } else {
            return `Cita agendada para el ${datetime.getDate()} de ${month} a ${hour == 1 ? 'la' : 'las'} ${hour}:${minutes} ${type}`;
        }
    }

    _handleDetailsNavigation = (item) => {
        if(item.service_status_id == 2) {
            this.props.navigation.navigate("ServiceInfoTayder", {
                service : item
            });
        } else if(item.service_status_id == 3) {
            this.props.navigation.navigate("ServiceProgressTayder", {
                service: item
            });
        }
    }

    startService = (item) => {
        let objService = {
            service_id : item.id
        };

        Alert.alert("Servicio", "¿Deseas iniciar este servicio?", [
            {
                text: 'Cancelar',
                onPress: () => this.setState({openCamera: false}),
                style: 'cancel'
            },
            {
                text: 'Iniciar', onPress: () => {
                    ServicesService.startService(objService)
                        .then(response => {
                            this.props.navigation.navigate("ServiceProgressTayder", {
                                service : item
                            });
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
        let {items} = this.state;
        return (
            <Block style={styles.componentContainer}>
                <ScrollView horizontal={true}>
                    {
                        items.length > 0 ?
                            items.map(item => {
                                return (
                                    <Block key={item.id} style={styles.cardContainer}>
                                        <Block style={{paddingHorizontal: 30}}>
                                            <Image source={Images.Icons.Agenda} style={styles.image} />
                
                                            <Text style={styles.serviceTitle}>{this.formatDateTime(item)}</Text>
                                            <Text style={styles.serviceSubtitle}>{item.service_type_id == 1 ? item.property_name : item.address}</Text>
                                            <Text style={styles.serviceSubtitleRed}>{item.has_consumables ? 'Insumos solicitados' : ''}</Text>
                                        </Block>

                                        <Block middle style={{ marginTop: 15 }}>
                                            <Button
                                                round
                                                color={nowTheme.COLORS.PLACEHOLDER}
                                                style={styles.button}
                                                onPress={() => this._handleDetailsNavigation(item)}>
                                                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                                    DETALLES
                                                </Text>
                                            </Button>

                                            {
                                                item.service_status_id == 2 && (
                                                    <Button
                                                        round
                                                        color={nowTheme.COLORS.BASE}
                                                        style={[styles.button, {marginVertical: 15}]}
                                                        onPress={() => this.startService(item)}>
                                                        <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                                            EMPEZAR
                                                        </Text>
                                                    </Button>
                                                )
                                            }
                                        </Block>
                                    </Block>
                                )
                            })
                        : (
                            <Block style={styles.cardContainer}>
                                <Image source={Images.Icons.Agenda} style={{paddingTop: 60, marginBottom: 40, width: 140, height: 140}} />

                                <Text style={styles.titleNoItems}>Aún no cuentas con citas agendadas</Text>
                                <Text style={styles.subtitleNoItems}>No olvides estar en línea para poder recibir solicitudes</Text>
                            </Block>
                        )
                    }
                </ScrollView>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    componentContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginHorizontal: 15,
    
        backgroundColor: nowTheme.COLORS.WHITE,
        borderRadius: 25,
        width: width * 0.85,
        height: smallScreen ? 480 : 570,
    },
    image: {
        alignSelf: 'flex-start',
        marginTop: smallScreen ? 20 : 50,
        marginBottom: smallScreen ? 20 : 25,
        width: smallScreen ? 90 : 140,
        height: smallScreen ? 90 : 140
    },
    serviceTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.GREY5,
        fontSize: smallScreen ? 26 : 29,
        lineHeight: smallScreen ? 27 : 30,
        textAlign: 'left',
        paddingVertical: smallScreen ? 10 : 20,
    },
    serviceSubtitle: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.GREY5,
        textAlign: 'left',
    },
    serviceSubtitleRed: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.BASE,
        textAlign: 'left',
        alignSelf: 'flex-start',
        paddingVertical: 15,
    },
    titleNoItems: {
        fontFamily: 'trueno',
        fontSize: 35,
        lineHeight: 33,
        textAlign: 'center',
        color: nowTheme.COLORS.BASE
    },
    subtitleNoItems: {
        fontFamily: 'trueno-light',
        fontSize: 14,
        lineHeight: 16,
        textAlign: 'center',
        color: nowTheme.COLORS.SECONDARY,

        paddingTop: 20,
    },

    button: {
        width: width * 0.6,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },
});