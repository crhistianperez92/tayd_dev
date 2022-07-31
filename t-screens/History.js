import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, StatusBar, View } from "react-native";
import { Block, theme, Text } from "galio-framework";

import Actions from '../lib/actions';
import { TabBarTayder, Switch, ServiceCardHistoryTayder } from "../components";
import { Images, nowTheme } from '../constants/';
import ServicesService from "../services/service";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class HistoryTayder extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            tayderName: '',
            showInfo: false,
            isOnline: true,
            statusText: 'En Línea',

            weekDay: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
            services: [],
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user, tayderName: result.user.info.name });
                this._getServices();
            }
        });

        this.focusListener = await navigation.addListener('focus', () => {
            this._getServices();
        });
    }

    componentWillUnmount() {
        this.focusListener()
    }

    async _getServices() {
        await ServicesService.listTayderHistory(this.state.userData.id)
            .then(response => {
                this.setState({ services: response })
            })
            .catch(error => {
                console.error(error);
                Alert.alert("No se encontraron servicios vinculados a este usuario.");
            })
    }

    _changeStatus = (switchValue) => {
        let message = switchValue ? 'En Línea' : 'Desconectado';
        this.setState({ isOnline: !this.state.isOnline, statusText: message });
    }

    renderBlocks = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
                <Block flex>
                    <StatusBar barStyle="light-content" />
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

                    {
                        this.state.services.length == 0 && (
                            <Block flex style={styles.emptyContainer}>
                                <Text style={styles.redText}>Aún no cuentas con historial</Text>
                            </Block>
                        )
                    }

                    <View style={{ height: height * 0.72 }}>
                        <ScrollView>
                            {
                                this.state.services.map((item) => {
                                    return (
                                        <ServiceCardHistoryTayder key={item.id} item={item} />
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

                </Block>
            </ScrollView>
        );
    };

    render() {
        return (
            <Block flex center style={styles.home}>
                {this.renderBlocks()}

                <TabBarTayder {...this.props} activeScreen="history" />
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
        paddingVertical: theme.SIZES.BASE,
        paddingHorizontal: 2,
    },

    emptyContainer: {
        backgroundColor: nowTheme.COLORS.WHITE,
        borderRadius: 25,
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 8
        },
        shadowRadius: 8,
        shadowOpacity: 0.8,
        elevation: 3,

        marginTop: 30,
        marginBottom: 30,
    },
    redText: {
        fontFamily: 'trueno',
        fontSize: 14,
        fontWeight: '500',
        lineHeight: 15,
        color: nowTheme.COLORS.BASE,

        paddingVertical: 10,
        textAlign: 'center',
    },
});

export default HistoryTayder;
