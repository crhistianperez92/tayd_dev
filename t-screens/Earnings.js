import React from "react";
import { StyleSheet, Dimensions, Image, StatusBar, View } from "react-native";
import { Block, theme, Text } from "galio-framework";
import { ScrollView } from "react-native-gesture-handler";

import { TabBarTayder, Switch } from "../components";
import { Images, nowTheme } from '../constants/';
import Actions from '../lib/actions';
import ServicesService from '../services/service';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class EarningsTayder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            tayderName: '',
            isOnline: true,
            statusText: 'En Línea',
            countServices: 0,
            totalServices: 0
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user, tayderName: result.user.info.name });
            }
        });

        await this._getEarnings()

        this.focusListener = await navigation.addListener('focus', () => {
            this._getEarnings();
        });
    }

    componentWillUnmount() {
        this.focusListener()
    }

    async _getEarnings() {
        await ServicesService.getUserEarnings(this.state.userData.id)
            .then(response => this.setState({ countServices: response.count, totalServices: parseFloat(response.subtotal) }))
            .catch(error => console.error(error));
    }

    _changeStatus = (switchValue) => {
        let message = switchValue ? 'En Línea' : 'Desconectado';
        this.setState({ isOnline: !this.state.isOnline, statusText: message });
    }

    renderBlocks() {
        let { countServices, totalServices } = this.state;
        return (
            <View style={styles.blocksContainer}>
                <Block flex>
                    <Block row style={{ paddingTop: 25 }}>
                        <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginHorizontal: 25 }} />
                        <Block flex>
                            <Text style={styles.nameTitle}>{this.state.tayderName}</Text>
                            <Block row style={{ paddingTop: 10, justifyContent: "space-between" }}>
                                <Text style={[styles.statusText, this.state.isOnline ? styles.statusOnline : styles.statusOffline]}>{this.state.statusText}</Text>
                                <Switch
                                    value={this.state.isOnline}
                                    style={{ marginRight: 20, marginTop: -10 }}
                                    onValueChange={this._changeStatus}
                                />
                            </Block>
                        </Block>
                    </Block>

                    <ScrollView>
                        <Block style={{ paddingTop: 25, paddingHorizontal: 20 }}>
                            <Text style={[styles.title2, { color: nowTheme.COLORS.WHITE }]}>Haz</Text>
                            <Text style={[styles.title2, { color: nowTheme.COLORS.WHITE }]}>realizado</Text>
                            <Text style={[styles.title2, { color: nowTheme.COLORS.BASE }]}>{countServices} servicios</Text>
                            <Text style={[styles.title2, { color: nowTheme.COLORS.WHITE }]}>hasta hoy</Text>
                        </Block>

                        <Block middle style={{ paddingVertical: 25 }}>
                            <Block style={styles.cardContainer}>
                                <Text style={styles.title}>${totalServices.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,')}</Text>
                                <Text style={styles.subtitle}>Ingreso acumulado</Text>
                            </Block>
                        </Block>

                        <Block style={{ paddingTop: 25, paddingHorizontal: 20 }}>
                            <Text style={styles.subtitle2}>Revisa tu historial de servicios para más detalles</Text>
                            <Text style={styles.subtitle3}>Los cortes se realizan cada lunes</Text>
                        </Block>
                    </ScrollView>
                </Block>
            </View>
        );
    };

    render() {
        return (
            <Block flex center style={styles.home}>
                <StatusBar barStyle="light-content" />

                {this.renderBlocks()}

                <TabBarTayder {...this.props} activeScreen="ingresos" />
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        width: width,
        backgroundColor: nowTheme.COLORS.BLACK,
    },
    nameTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 24,
        color: nowTheme.COLORS.WHITE,
        lineHeight: 29,
    },
    statusText: {
        fontFamily: 'trueno',
        fontSize: 14,
        lineHeight: 15,
        color: '#36c550',
    },
    statusOnline: {
        color: '#36c550',
    },
    statusOffline: {
        color: '#C4C4C4',
    },
    blocksContainer: {
        width: width - theme.SIZES.BASE * 2,
        flex: 1,
        paddingVertical: theme.SIZES.BASE,
        paddingHorizontal: 2,
    },
    button: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },

    cardContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10,

        backgroundColor: nowTheme.COLORS.WHITE,
        borderRadius: 25,
        width: '90%',
    },
    title: {
        fontFamily: 'trueno-extrabold',
        fontSize: smallScreen ? 50 : 55,
        textAlign: 'center',
        color: nowTheme.COLORS.BASE
    },
    subtitle: {
        fontFamily: 'trueno-light',
        fontSize: 20,
        lineHeight: 33,
        textAlign: 'center',
        color: nowTheme.COLORS.BASE,
    },

    title2: {
        fontFamily: 'trueno-extrabold',
        fontSize: smallScreen ? 45 : 50,
        lineHeight: smallScreen ? 44 : 49,
    },
    subtitle2: {
        fontFamily: 'trueno-light',
        fontSize: smallScreen ? 32 : 34,
        lineHeight: 35,
        marginBottom: 20,
        color: nowTheme.COLORS.WHITE,
    },
    subtitle3: {
        fontFamily: 'trueno-light',
        fontSize: smallScreen ? 16 : 19,
        lineHeight: 33,
        color: nowTheme.COLORS.WHITE,
    },
});
