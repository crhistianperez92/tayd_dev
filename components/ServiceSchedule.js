import React from "react";
import { StyleSheet, Dimensions, Image, View, Modal, TouchableOpacity, Alert } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { Images, nowTheme } from '../constants';
import ServicesService from '../services/service';

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo    : false,
            showModal   : false,
            isLoading   : false,
            isCanceled  : false,
            item        : this.props.item,
            weekDay     : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months      : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        };
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { item } = nextProps;

        if (item !== prevState.item) {
            return { service: item}
        }
        return null;
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

        return `${week}, ${datetime.getDate()} de ${month} de ${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
    }

    _showService = (item) => {
        if(item.service_status_id == 3 || item.service_status_id == 2) {
            this.props.navigation.navigate("AgendaProgreso", {
                tayder: item.provider_user_name ,
                status: item.service_status_name
            });
        }
    }

    cancelService = (item) => {
        if(item.service_status_id != 5) {
            this.setState({isLoading: true});

            let objCancel = {
                service_id      : item.id,
                service_status  : item.service_status_id,
                from_tayder      : false,
            };

            ServicesService.cancelService(objCancel)
                .then(response => this.setState({isCanceled: true, isLoading: false}))
                .catch(error => Alert.alert("Servicio", error.data.error));
        }
    }

    _closeModal = () => {
        this.setState({ showModal: false, isCanceled: false });
        this.props.onClose();
    }

    render() {
        let {item, showModal, isCanceled, isLoading, showInfo} = this.state;

        return (
            <Block key={item.id} flex style={{marginTop: 20}}>
                <Block middle style={styles.cardContainer}>
                    <TouchableOpacity onPress={() => this.setState({ showInfo: !showInfo })}>
                        <Block row style={{ width: width - theme.SIZES.BASE * 3, paddingVertical: 20, paddingHorizontal: 10 }}>
                            <Block style={{ justifyContent: 'flex-start', alignContent: 'center' }}>
                                <Image source={Images.Icons.Calendario} style={{ width: 65, height: 65 }} />
                            </Block>

                            <View style={{ width: 250, paddingHorizontal: 15 }}>
                                <Text style={[styles.scheduleTitle]}>
                                    Próxima cita...
                                </Text>
                                <Block middle style={[styles.section, showInfo && styles.divider]}>
                                    <Text style={[styles.scheduleSubtitle]} color={nowTheme.COLORS.SECONDARY}>{ this.formatDateTime(item) }</Text>
                                </Block>

                                {
                                    showInfo && (
                                        <View>
                                            <Block style={styles.divider}>
                                                <Text style={[styles.scheduleSubtitleBold]} color={nowTheme.COLORS.SECONDARY}>
                                                    Recuerda  estar al pendiente de la llegada de nuestro TAYDER a tu ubicación
                                                    y no olvides revisar y calificar al final de las actividades de limpieza de nuestro servicio

                                                    Recuerda que solicitaste nuestros insumos, así que no te preocupes en absoluto y solo disfruta
                                                    cómodamente de TAYD.
                                                </Text>
                                            </Block>

                                            <Text style={styles.scheduleSubtitleBold}>Estatus:</Text>

                                            <TouchableOpacity onPress={() => this._showService(item)}>
                                                <Text style={styles.scheduleSubtitleBoldRed}>{item.service_status_name.toUpperCase()}</Text>
                                            </TouchableOpacity>
                                        </View>
                                    )
                                }
                            </View>
                        </Block>

                        {
                            showInfo && (
                                <Block center style={{alignItems: 'flex-end'}}>
                                    {
                                        (item.service_status_id == 2 && item.service_status_id == 3) && (
                                            <Button color={nowTheme.COLORS.BASE} round style={styles.buttonContact} onPress={() =>  this.props.navigation.navigate("Chat", {service_id : item.id})}>
                                                <Text style={{ fontFamily: 'trueno-semibold', lineHeight: 24 }} size={20} color={nowTheme.COLORS.WHITE}>CONTACTAR</Text>
                                            </Button>
                                        )
                                    }

                                    <Block middle style={[styles.section, {marginVertical: 15}]}>
                                        <Button color={'rgb(240,240,240)'} round style={styles.buttonCancel} onPress={() => this.setState({showModal: true})}>
                                            <Text style={{ fontFamily: 'trueno-semibold', lineHeight: 16 }} size={13} color={nowTheme.COLORS.BASE}>CANCELAR</Text>
                                        </Button>
                                    </Block>
                                </Block>
                            )
                        }
                    </TouchableOpacity>
                </Block>

                <Modal
                    animationType="slide"
                    transparent
                    visible={showModal}
                    presentationStyle="overFullScreen">
                    <View style={{flex: 1}}>
                        <View style={styles.modalContainer}>
                            {
                                !isCanceled ? (
                                    <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30,}}>
                                        <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 25}}>
                                            <TouchableOpacity onPress={() => this.setState({showModal: false})} style={{alignSelf: 'flex-end'}}>
                                                <Image source={Images.Icons.Close01} />
                                            </TouchableOpacity>
                                            <Image source={Images.TaydLogoLarge} style={{height: 25, width: 120}} />
                                            <Text style={styles.modalTitle}>¿Deseas cancelar el servicio</Text>
                                            <Text style={styles.modalDescription}>Se realizará un cargo por cancelación.</Text>
                                        </View>
                                        <Block middle style={{alignItems: 'center' }}>
                                            <Button
                                                round
                                                color={nowTheme.COLORS.BASE}
                                                style={styles.modalButton}
                                                loading={isLoading}
                                                loadingColor={nowTheme.COLORS.WHITE}
                                                disabled={isLoading}
                                                onPress={() => this.cancelService(item)}>
                                                <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>CANCELAR CITA</Text>
                                            </Button>
                                        </Block>
                                    </View>
                                ) : (
                                    <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30,}}>
                                        <View style={{justifyContent: 'center', alignItems: 'center', paddingBottom: 25}}>
                                            <Image source={require('../assets/icons/success.png')} style={{height: 79, width: 79}} />
                                            <Text style={[styles.modalTitle, {marginBottom: 15}]}>Cita cancelada</Text>
                                            <Text style={styles.modalDescription}>Nos vemos en futuras citas</Text>
                                        </View>
                                        <Block middle style={{alignItems: 'center' }}>
                                            <Button
                                                round
                                                color={nowTheme.COLORS.BASE}
                                                style={styles.modalButton}
                                                onPress={() => this._closeModal()}>
                                                <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>LISTO</Text>
                                            </Button>
                                        </Block>
                                    </View>
                                )
                            }
                        </View>
                    </View>
                </Modal>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
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
    scheduleTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 24,
        textAlign: 'left',
    },
    scheduleSubtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    scheduleSubtitleBold: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 14,
        textAlign: 'left',
    },
    scheduleSubtitleBoldRed: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.BASE,
        fontSize: 18,
        textAlign: 'left',
        width: width * 0.5,
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
    button: {
        width: width * 0.7,
        height: theme.SIZES.BASE * 2.5,
        marginTop: 10,
        marginBottom: 10,

        shadowRadius: 0,
        shadowOpacity: 0,

        borderColor: nowTheme.COLORS.BASE,
        borderWidth: 1,
    },
    buttonContact: {
        width: width * 0.8,
        height: theme.SIZES.BASE * 2.5,

        shadowRadius: 0,
        shadowOpacity: 0,
    },
    buttonCancel: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 1.8,

        shadowRadius: 0,
        shadowOpacity: 0,
        marginRight: 30
    },

    modalContainer: {
        flex: 1,
        height: height,
        backgroundColor: 'rgba(0,0,0,.2)',
        justifyContent: 'flex-end',
        flexDirection: 'column'
    },
    modalTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 30,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'center',
    },
    modalDescription: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.SECONDARY,
    },
    modalButton: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },
});

export default ServiceComponent;
