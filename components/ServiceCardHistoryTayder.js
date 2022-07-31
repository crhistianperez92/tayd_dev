import React from 'react';
import { StyleSheet, Dimensions, Image, View } from "react-native";
import { Block, Text, theme } from 'galio-framework';
import { TouchableOpacity } from "react-native-gesture-handler";

import { Images, nowTheme } from '../constants/';
import Rating from './Rating';
import Actions from '../lib/actions';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class ServiceCardHistoryTayder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,

            weekDay         : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months          : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            item            : this.props.item,
        };
    }

    _getServiceTime(item) {
        if(item.service_status_id == 5) {
            return '0 horas con 0 minutos';
        } else {
            let start   = item.dt_start.replace(/-/g, '/');
            let finish  = item.dt_finish.replace(/-/g, '/');
    
            return Actions.timeDiffCalc(new Date(finish), new Date(start));
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
            if(hour > 12) hour    -= 12;
            type    = "p.m.";
        }

        return `${week}, ${datetime.getDate()} de ${month} de ${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
    }

    render() {
        const {item, showInfo} = this.state;
        return (
            <Block flex style={{marginTop: 20}}>
                <Block middle style={styles.cardContainer}>
                    <Block row style={{ width: width - theme.SIZES.BASE * 3, paddingVertical: 20, paddingHorizontal: 10 }}>
                        <Block style={{ justifyContent: 'flex-start', alignContent: 'center' }}>
                            <Image source={require('../assets/icons/T-Calendar.png')} style={{ width: 65, height: 65 }} />
                        </Block>

                        <View style={{ width: 270, paddingHorizontal: 15 }}>
                            <Block style={{alignSelf: 'flex-start'}}>
                                <Rating
                                    count={5}
                                    showRating={false}
                                    size={20}
                                    isDisabled={true}
                                    defaultRating={item.rating}
                                />
                            </Block>
                            <Text style={[styles.historyTitle]}>Servicio {item.service_status_id == 5 ? 'cancelado' : 'concluido'}</Text>
                            <Text style={[styles.historySubtitleLight]} color={nowTheme.COLORS.SECONDARY}>
                                { this.formatDateTime(item) }
                            </Text>
                            <Block middle style={[styles.section, this.state.showInfo && styles.divider, {marginTop: 15}]}>
                                <Text style={[styles.historySubtitleRedBold]}>
                                    ${parseFloat(item.service_cost).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')} <Text style={[styles.historySubtitleRedBold, {fontSize: 16}]}>Ganancia</Text>
                                </Text>

                                {
                                    !showInfo && (
                                        <TouchableOpacity onPress={() => this.setState({ showInfo: true })}>
                                            <Image source={Images.Icons.FlechaAbajo} style={{ width: 25, height: 25 }} />
                                        </TouchableOpacity>
                                    )
                                }
                            </Block>

                            {
                                showInfo && (
                                    <View>
                                        <Block style={styles.divider}>
                                            <Text style={styles.historySubtitleBold}>Comentarios:</Text>
                                            <Text style={styles.historySubtitle}>{item.comments != null ? item.comments : ''}</Text>
                                        </Block>

                                        <Text style={[styles.historyConsumables, styles.divider]}>
                                            {item.has_consumables ? 'Se llevaron insumos.' : 'No se llevaron insumos.'}
                                        </Text>

                                        <Block middle style={[styles.section, { alignItems: 'flex-end' }]}>
                                            <View>
                                                <Text style={styles.historySubtitleBold}>Tiempo de limpieza:</Text>
                                                <Text style={styles.historySubtitle}>{this._getServiceTime(item)}.</Text>
                                            </View>
                                            <TouchableOpacity style={{ marginLeft: 20, marginBottom: 10 }} onPress={() => this.setState({ showInfo: false })}>
                                                <Image source={Images.Icons.FlechaArriba} style={{ width: 25, height: 25 }} />
                                            </TouchableOpacity>
                                        </Block>
                                    </View>
                                )
                            }
                        </View>
                    </Block>
                </Block>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
        lineHeight: 15,
        color: nowTheme.COLORS.SECONDARY,
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
    },
    historyTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: smallScreen ? 21 : 24,
        textAlign: 'left',
    },
    historySubtitle: {
        fontFamily: 'trueno',
        fontSize: 16,
        lineHeight: 19,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    historySubtitleLight: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        lineHeight: 17,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    historyConsumables: {
        fontFamily: 'trueno-semibold',
        fontSize: 18,
        color: nowTheme.COLORS.BASE,
        textAlign: 'left',
    },
    historySubtitleBold: {
        fontFamily: 'trueno-semibold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 18,
        lineHeight: 22,
        textAlign: 'left',
    },
    historySubtitleRedBold: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.BASE,
        fontSize: 22,
        lineHeight: 22,
        textAlign: 'left',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    divider: {
        borderBottomColor: nowTheme.COLORS.SECONDARY,
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15,
    },
});