import React from 'react';
import { Image, StyleSheet, KeyboardAvoidingView, Dimensions, Platform, TouchableWithoutFeedback, Keyboard, Alert, ScrollView, View } from 'react-native';
import { Block, Button, Text, theme } from 'galio-framework';
import { Input } from '../../components';
import Env from '../../lib/enviroment';
import Actions from '../../lib/actions';
import PaymentMethodService from '../../services/paymentMethod';
import { Images, nowTheme } from '../../constants/';

const { height, width } = Dimensions.get('screen');
const smallScreen = height < 812 ? true : false;
const stripe = require('stripe-client')(Env.STRIPE_PUBLIC_KEY);

const DismissKeyboard = ({ children }) => (
    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "position" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
    </KeyboardAvoidingView>
);

export default class MetodoPagoAddCardScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userData: null,
            isIphone: Platform.OS === 'ios',
            name: '',
            lastName: '',
            cardNumber: '',
            cardDate: '',
            cardMonth: '',
            cardYear: '',
            cardCVV: '',

        };
    }

    componentDidMount() {
        Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user });
            }
        });
    }

    _validateForm() {
        let response = true;

        if (this.state.name.trim() == "")
            response = false

        if (this.state.lastName.trim() == "")
            response = false

        if (this.state.cardNumber.trim() == "")
            response = false

        if (this.state.cardDate.trim() == "")
            response = false

        if (this.state.cardCVV.trim() == "" && this.state.cardCVV.trim().length <= 2)
            response = false

        return response;
    }

    formatDateExpiration = (value) => {
        let newDate = value.replace(
            /^([1-9]\/|[2-9])$/g, '0$1/' // 3 > 03/
        ).replace(
            /^(0[1-9]|1[0-2])$/g, '$1/' // 11 > 11/
        ).replace(
            /^([0-1])([3-9])$/g, '0$1/$2' // 13 > 01/3
        ).replace(
            /^(0?[1-9]|1[0-2])([0-9]{2})$/g, '$1/$2' // 141 > 01/41
        ).replace(
            /^([0]+)\/|[0]+$/g, '0' // 0/ > 0 and 00 > 0
        ).replace(
            /[^\d\/]|^[\/]*$/g, '' // To allow only digits and `/`
        ).replace(
            /\/\//g, '/' // Prevent entering more than 1 `/`
        );

        let arrDate = newDate.split("/");
        let year = "";
        let month = "";
        if (arrDate.length == 2) {
            month = arrDate[0];
            year = arrDate[1];
        }

        this.setState({ cardDate: newDate, cardMonth: month, cardYear: year });
    }

    async _handleNextAction() {
        // this.setState({ isLoading: true });

        if (this._validateForm()) {
            let information = {
                card: {
                    number: this.state.cardNumber,
                    exp_month: this.state.cardMonth,
                    exp_year: this.state.cardYear,
                    cvc: this.state.cardCVV,
                    name: `${this.state.name} ${this.state.lastName}`
                }
            }

            var card = await stripe.createToken(information);

            if (card != null && !card.error) {
                let objPaymentMethod = {
                    user_id: this.state.userData.id,
                    token: card.id
                };
                await PaymentMethodService.store(objPaymentMethod)
                    .then(response => {
                        this.setState({ isLoading: false });
                        this.props.navigation.navigate("MetodoPago", { screen: 'MetodoPagoIndex', params: { isNewCard: true } });
                    })
                    .catch(e => {
                        Alert.alert("Método de pago", e.data.error);
                        this.setState({ isLoading: false });
                    });
            } else {
                this.setState({ isLoading: false });
                Alert.alert("Método de pago", card.error.message);
            }
        } else {
            this.setState({ isLoading: false });
            Alert.alert("Método de pago", "Los campos no cumplen con la información requerida.")
        }

    }

    render() {
        const { isIphone, name, lastName, cardCVV, cardDate, cardNumber, isLoading } = this.state;
        return (
            <DismissKeyboard>
                <ScrollView>
                    <Block style={{ height: smallScreen ? height * 0.35 : height * 0.38 }}>
                        <Image source={Images.MetodoPagoAddCard} style={styles.image} />
                    </Block>

                    <Block space="between" style={styles.padded}>
                        <View style={{ height: height * 0.6 }}>
                            <Block width={width * 0.8} style={{ paddingTop: 15 }}>
                                <Text style={[styles.subtitle]}>Propietario de la tarjeta</Text>
                                <Input
                                    placeholder="Nombre"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    color={nowTheme.COLORS.BASE}
                                    style={[styles.inputs, name != '' ? styles.inputEnabled : styles.inputDisabled]}
                                    iconContent={null}
                                    onChangeText={(text) => this.setState({ name: text })}
                                />
                            </Block>

                            <Block width={width * 0.8}>
                                <Input
                                    placeholder="Apellidos"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    color={nowTheme.COLORS.BASE}
                                    style={[styles.inputs, lastName != '' ? styles.inputEnabled : styles.inputDisabled]}
                                    iconContent={null}
                                    onChangeText={(text) => this.setState({ lastName: text })}
                                />
                            </Block>

                            <Block width={width * 0.8} style={{ paddingTop: 15 }}>
                                <Text style={[styles.subtitle]}>Número de tarjeta</Text>
                                <Input
                                    placeholder="1111 2222 3333 4444"
                                    placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                    color={nowTheme.COLORS.BASE}
                                    type="number-pad"
                                    style={[styles.inputs, cardNumber != '' ? styles.inputEnabled : styles.inputDisabled]}
                                    iconContent={
                                        <Image style={{ marginRight: 25, width: 35, height: 22 }} source={this.state.cardNumber != '' ? Images.Icons.TarjetaBancaria : Images.Icons.TarjetaBancariaGris} />
                                    }
                                    onChangeText={(text) => this.setState({ cardNumber: text })}
                                />
                            </Block>

                            <Block width={width * 0.8} style={{ paddingTop: 15, flexDirection: 'row' }}>
                                <Block width={width * 0.4} style={{ paddingRight: 15 }}>
                                    <Text style={[styles.subtitle]}>Fecha de vto.</Text>
                                    <Input
                                        value={this.state.cardDate}
                                        placeholder="11/22"
                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                        color={nowTheme.COLORS.BASE}
                                        type="number-pad"
                                        style={[styles.inputs, cardDate != '' ? styles.inputEnabled : styles.inputDisabled]}
                                        iconContent={
                                            <Image style={{ marginRight: 25, width: 35, height: 22 }} source={this.state.cardDate != '' ? Images.Icons.TarjetaBancariaFecha : Images.Icons.TarjetaBancariaFechaGris} />
                                        }
                                        onChangeText={(text) => this.formatDateExpiration(text)}
                                    />
                                </Block>

                                <Block width={width * 0.4} style={{ paddingLeft: 15 }}>
                                    <Text style={[styles.subtitle]}>CVV</Text>
                                    <Input
                                        placeholder="000"
                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                        color={nowTheme.COLORS.BASE}
                                        type="number-pad"
                                        style={[styles.inputs, cardCVV != '' ? styles.inputEnabled : styles.inputDisabled]}
                                        iconContent={
                                            <Image style={{ marginRight: 25, width: 35, height: 22 }} source={this.state.cardCVV != '' ? Images.Icons.TarjetaBancariaCCV : Images.Icons.TarjetaBancariaCCVGris} />
                                        }
                                        onChangeText={(text) => this.setState({ cardCVV: text })}
                                    />
                                </Block>
                            </Block>

                            <Block middle style={{ width: width - theme.SIZES.BASE * 4, justifyContent: 'flex-end' }}>
                                <Button
                                    round
                                    loading={isLoading}
                                    disabled={isLoading}
                                    color={this._validateForm() ? nowTheme.COLORS.BASE : nowTheme.COLORS.WHITE}
                                    style={[styles.createButton, this._validateForm() ? styles.ButtonEnabled : styles.ButtonDisabled]}
                                    onPress={() => this._handleNextAction()}>
                                    <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={this._validateForm() ? nowTheme.COLORS.WHITE : nowTheme.COLORS.SECONDARY}>
                                        GUARDAR
                                    </Text>
                                </Button>
                            </Block>
                        </View>
                    </Block>
                </ScrollView>
            </DismissKeyboard>
        );
    }
}

const styles = StyleSheet.create({
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        paddingTop: 15,
        bottom: Platform.OS === 'android' ? theme.SIZES.BASE * 2 : theme.SIZES.BASE * 3,
        backgroundColor: 'white'
    },

    image: {
        width: width,
        height: smallScreen ? 500 : 670,
    },
    subtitle: {
        fontFamily: 'trueno',
        textAlign: 'left',
        fontSize: 12,
    },

    inputIcons: {
        marginRight: 25,
        width: 25,
        height: 25,
    },
    inputs: {
        borderWidth: 1,
        borderRadius: 21.5,
        justifyContent: 'center',
        alignContent: 'center'
    },
    inputEnabled: {
        borderColor: nowTheme.COLORS.BASE,
    },
    inputDisabled: {
        borderColor: '#C0C0C0',
    },

    createButton: {
        width: width * 0.5,
        marginTop: 30,
        marginBottom: 10,
        shadowRadius: 0,
        shadowOpacity: 0
    },

    ButtonEnabled: {
        borderColor: nowTheme.COLORS.BASE
    },
    ButtonDisabled: {
        borderColor: nowTheme.COLORS.SECONDARY,
        borderWidth: 1,
    }
});