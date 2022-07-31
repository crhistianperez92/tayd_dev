import React from "react";
import { StyleSheet, Dimensions, Image, View } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { Images, nowTheme } from '../constants/';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceHistoryComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo    : false,
            service     : this.props.item,
            weekDay     : ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months      : ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        };
    }

    async componentDidMount() {

    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { item } = nextProps;

        if (item !== prevState.item) {
            return { service: item}
        }
        return null;
    }

    serviceTypeImage(id) {
        switch(id) {
            case 1: return (<Image source={Images.Icons.Inmueble} style={{ width: 65, height: 65 }} />)
            case 2: return (<Image source={Images.Icons.Vehiculo} style={{ width: 65, height: 65 }} />)
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

    _getPropertyDistribution(item) {
        let strDistribution = "";

        item.distribution.map(item => {
            strDistribution += `${item.quantity} ${item.name} \n`;
        });

        return strDistribution;
    }

    _getVehicleServiceDetails(item) {
        let strService = "";

        item.details.map(item => {
            strService += `${item.name} \n`;
        });

        return strService;
    }

    _handleNextAction = () => {
        this.props.navigation.navigate("RateService", {
            service : this.state.service
        })
    }

    render() {
        let {service, showInfo} = this.state;
        return (
            <Block flex style={{marginTop: 20}}>
                <Block middle style={styles.cardContainer}>
                <TouchableOpacity onPress={() => this.setState({ showInfo: !showInfo })}>
                        <Block row style={{ width: width - theme.SIZES.BASE * 3, paddingVertical: 20, paddingHorizontal: 10}}>
                            <Block style={{justifyContent: 'flex-start', alignContent: 'center'}}>
                                {this.serviceTypeImage(service.service_type_id)}
                            </Block>

                            <View style={{ width: 250, paddingHorizontal: 15}}>
                                <Text style={[styles.historyTitle]}>{ service.service_type_id == 1 ? service.property_type_name : service.vehicle_type}</Text>
                                <Text style={[styles.historySubtitle, styles.divider]} color={nowTheme.COLORS.SECONDARY}>
                                    {service.service_type_id == 1 ? service.property_name : service.vehicle_brand}
                                </Text>
                                <Block middle style={[styles.section, {width: '93%'}, showInfo && styles.divider]}>
                                    <Text style={[styles.historySubtitleBold]} color={nowTheme.COLORS.SECONDARY}>
                                        { this.formatDateTime(service) }
                                    </Text>
                                </Block>
                                
                                {
                                    showInfo && (
                                        <View>
                                            <Block style={styles.divider}>
                                                <Text style={[styles.historySubtitle]} color={nowTheme.COLORS.SECONDARY}>
                                                    { service.service_type_id == 1 ? this._getPropertyDistribution(service) : this._getVehicleServiceDetails(service) }
                                                </Text>
                                            </Block>
                                            <Text style={[styles.historySubtitle, styles.divider]} color={nowTheme.COLORS.SECONDARY}>
                                                {`${service.stripe_source_brand}\n${service.stripe_source_number}\n${service.stripe_source_name}`}
                                            </Text>
                                            <Block style={styles.divider}>
                                                <View style={styles.section}>
                                                    <Text style={styles.historySubtitle}>Subtotal</Text>
                                                    <Text style={styles.historySubtitle}>${parseFloat(service.total - service.discount).toFixed(2)}</Text>
                                                </View>
                                                <View style={[styles.section]}>
                                                    <Text style={styles.historySubtitle}>Cupón</Text>
                                                    <Text style={styles.historySubtitle}>${service.discount}</Text>
                                                </View>
                                                <View style={[styles.section]}>
                                                    <Text style={styles.historySubtitleBold}>Total</Text>
                                                    <Text style={styles.historySubtitleBold}>${parseFloat(service.total).toFixed(2)}</Text>
                                                </View>
                                            </Block>

                                            <Text style={styles.historySubtitleBold}>TAYDER:</Text>
                                            <Text style={styles.historySubtitle}>{service.provider_user_name}</Text>

                                            <Block middle style={[styles.section, {alignItems: 'flex-end'}]}>
                                                <Button
                                                    round
                                                    color={service.rating > 0 ? nowTheme.COLORS.PLACEHOLDER : nowTheme.COLORS.BASE}
                                                    disabled={service.rating > 0}
                                                    style={styles.button}
                                                    onPress={() => this._handleNextAction()}>
                                                    <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                                                        Quejas o sugerencias
                                                    </Text>
                                                </Button>
                                            </Block>
                                        </View>
                                    )
                                }
                            </View>
                        </Block>
                    </TouchableOpacity>
                </Block>
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
    historyTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 24,
        textAlign: 'left',
    },
    historySubtitle: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    historySubtitleBold: {
        fontFamily: 'trueno-semibold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 14,
        textAlign: 'left',
    },
    section: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },

    divider: {
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15,
    },
    button: {
        width: width * 0.5,
        height: theme.SIZES.BASE * 2,
        marginTop: 10,
        marginBottom: 10,
        shadowRadius: 0,
        shadowOpacity: 0
    }
});

export default ServiceHistoryComponent;
