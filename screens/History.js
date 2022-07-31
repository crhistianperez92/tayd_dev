import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, View } from "react-native";
import { Block, theme, Text, } from "galio-framework";

import { TabBar, ServiceHistoryComponent, Icon } from "../components";
import { nowTheme } from '../constants/';
import { iPhoneX } from "../constants/utils";

import Actions from "../lib/actions";
import ServicesService from "../services/service";

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class History extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showInfo: false,
            services: [],
            userData: null,
            weekDay: ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"],
            months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
        };
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user });
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
        await ServicesService.listHistory(this.state.userData.id)
            .then(response => {
                this.setState({ services: response })
            })
            .catch(error => {
                console.error(error);
                Alert.alert("No se encontraron servicios vinculados a este usuario.");
            })
    }

    render() {
        return (
            <Block flex center style={styles.home}>
                <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
                    <Block flex>
                        <Block flex row style={{ paddingTop: iPhoneX() ? 30 : 10 }}>
                            <Icon
                                name={'align-left-22x'}
                                family="NowExtra"
                                size={16}
                                onPress={() => this.props.navigation.openDrawer()}
                                color={nowTheme.COLORS.ICON}
                                style={{ fontWeight: '700', marginRight: 15, paddingTop: 5 }}
                            />
                            <Block flex>
                                <Text style={styles.nameTitle}>Historial</Text>
                                <Text>Revisa el historial de servicios TAYD</Text>
                            </Block>
                        </Block>

                        {
                            this.state.services.length == 0 && (
                                <Block flex style={styles.emptyContainer}>
                                    <Text style={styles.redText}>Aún no cuentas con historial</Text>
                                </Block>
                            )
                        }

                        <View style={{ height: smallScreen ? height * 0.8 : height * 0.73 }}>
                            <ScrollView>
                                {this.state.services.map((item) => <ServiceHistoryComponent key={item.id} item={item} {...this.props} />)}
                            </ScrollView>
                        </View>

                    </Block>
                </ScrollView>

                <TabBar {...this.props} activeScreen="history" />
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        width: width,
        backgroundColor: nowTheme.COLORS.BACKGROUND,
    },
    nameTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 24,
        color: nowTheme.COLORS.SECONDARY,
        lineHeight: 29,
    },
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
        lineHeight: 15,
        color: nowTheme.COLORS.SECONDARY,
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
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 0.2,
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

    divider: {
        borderBottomColor: '#E3E3E3',
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15,
    },
});

export default History;
