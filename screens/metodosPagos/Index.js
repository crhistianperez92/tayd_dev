import React from "react";
import {
    Image,
    StyleSheet,
    ScrollView,
    Dimensions,
    Text, View, TouchableOpacity
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import Actions from '../../lib/actions';
import PaymentMethodService from '../../services/paymentMethod';

const { height, width } = Dimensions.get("screen");

import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";

class MetodoPagoIndexScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
            sources: [],
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user });
                this._getSources();
            }
        });

        this.focusListener = await navigation.addListener('focus', () => {
            this._getSources();
        });
        this.blurListener = await navigation.addListener('blur', () => {
            navigation.dispatch(CommonActions.setParams({ isNewCard: false }));
        });
    }

    componentWillUnmount() {
        this.focusListener()
        this.blurListener()
    }

    async _getSources() {
        const { route } = this.props
        await PaymentMethodService.list(this.state.userData.id)
            .then(response => {
                this.setState({ sources: response })
                route?.params?.isNewCard && this.setPredetermined(response[response.length - 1])
            })
            .catch(error => {
                console.error(error);
                Alert.alert("No se encontraron tarjetas bancarias vinculadas a este usuario.");
            })
    }

    async setPredetermined(itemSource) {
        if (!itemSource.is_predetermined) {
            await PaymentMethodService.setPredeterminedSource(itemSource.id)
                .then(response => {
                    this._getSources();
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert("No se logró predeterminar esta tarjeta bancaria.");
                })
        }
    }

    render() {
        const { navigation } = this.props;

        return (
            <Block flex style={styles.container}>
                <Block flex space="between" style={styles.padded}>
                    <View style={{ height: height * 0.68 }}>
                        <ScrollView>
                            {
                                this.state.sources.map((item) => {
                                    return (
                                        <Block middle style={styles.cardContainer} key={item.id}>
                                            <TouchableOpacity onPress={() => this.setPredetermined(item)}>
                                                <View style={{ width: width - theme.SIZES.BASE * 4, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10, paddingRight: 10 }}>
                                                    {item.is_predetermined == true && (<Image source={require('../../assets/icons/success.png')} style={{ width: 25, height: 25 }} />)}
                                                </View>

                                                <Block row style={{ width: width - theme.SIZES.BASE * 4, paddingBottom: 10, paddingHorizontal: 15, alignItems: 'center' }}>
                                                    <View style={{ paddingHorizontal: 25 }}>
                                                        <Image source={Images.Icons.TarjetaBancaria} style={{ width: 60, height: 35 }} />
                                                    </View>

                                                    <View style={{ marginTop: 0, paddingRight: 20 }}>
                                                        <Text style={[styles.subtitle]} color={nowTheme.COLORS.SECONDARY}>
                                                            {`${item.brand}`}
                                                        </Text>
                                                        <Text style={[styles.subtitleRegular]} color={nowTheme.COLORS.SECONDARY}>
                                                            {`${item.number}`}
                                                        </Text>
                                                        <Text style={[styles.subtitle]} color={nowTheme.COLORS.SECONDARY}>
                                                            {`${item.name}`}
                                                        </Text>
                                                    </View>
                                                </Block>
                                            </TouchableOpacity>
                                        </Block>
                                    )
                                })
                            }
                        </ScrollView>
                    </View>

                    <Block middle flex style={{ justifyContent: 'flex-end' }}>
                        <Button
                            round
                            color={nowTheme.COLORS.WHITE}
                            style={styles.button}
                            onPress={() => navigation.navigate('MetodoPagoAddCard')}>
                            <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.BASE, }} size={14}>
                                AGREGAR MÉTODO  +
                            </Text>
                        </Button>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 50,
        backgroundColor: '#F7F7F7'
    },
    cardContainer: {
        backgroundColor: nowTheme.COLORS.WHITE,
        height: 90,
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

        marginBottom: 20,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        bottom: theme.SIZES.BASE,
    },
    title: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.SECONDARY,
        fontSize: 24,
        textAlign: 'left',
    },
    subtitle: {
        fontFamily: 'trueno-light',
        fontSize: 13,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
        lineHeight: 14
    },
    subtitleRegular: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
        lineHeight: 17
    },
    button: {
        width: width * 0.5,
        height: theme.SIZES.BASE * 2.5,
        marginTop: 10,
        marginBottom: 10,

        shadowRadius: 0,
        shadowOpacity: 0,

        borderColor: nowTheme.COLORS.BASE,
        borderWidth: 1,
    },
});

export default MetodoPagoIndexScreen;
