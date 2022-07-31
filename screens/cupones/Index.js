import React from "react";
import {
    Image,
    StyleSheet,
    TouchableOpacity,
    Dimensions, Platform,
    Text, View, Alert, ScrollView, Modal, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import { Input } from '../../components';
import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";
import Actions from "../../lib/actions";
import CouponService from "../../services/coupon";

const { height, width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
    <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>{children}</TouchableWithoutFeedback>
    </KeyboardAvoidingView>
);

class CuponesIndexScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            userData: null,
            coupons: [],
            showModal: false,
            isCreated: false,
            couponResponse: null,
            code: "",
        }
    }

    async componentDidMount() {
        const { navigation } = this.props;

        await Actions.extractUserData().then((result) => {
            if (result != null) {
                this.setState({ userData: result.user });
                this._getCoupons();
            }
        });

        this.focusListener = await navigation.addListener('focus', () => {
            this._getCoupons();
        });
    }

    componentWillUnmount() {
        this.focusListener()
    }

    async _getCoupons() {
        await CouponService.getAll(this.state.userData.id)
            .then(response => {
                this.setState({ coupons: response })
            })
            .catch(error => {
                Alert.alert("Ocurrió un fallo al buscar los cupones.");
            })
    }

    storeCoupon() {
        if (this.state.code != '') {
            this.setState({ isLoading: true });
            CouponService.store({ code: this.state.code }, this.state.userData.id)
                .then(response => {
                    this.setState({ isCreated: true, code: '', couponResponse: response, isLoading: false })
                })
                .catch(error => {
                    this.setState({ showModal: false, code: '', isLoading: false })
                    Alert.alert("Upps!", error.data.error)
                })
        } else {
            alert("No has ingresado un código.")
        }
    }

    /* async setPredetermined(itemProperty) {
        if(!itemProperty.is_predetermined) {
            await PropertyService.setPredeterminedProperty(itemProperty.id)
                .then(response => {
                    this._getProperties();
                })
                .catch(error => {
                    console.error(error);
                    Alert.alert("No se logró predeterminar este domicilio.");
                })
        }
    } */

    render() {
        const { navigation } = this.props;
        const { showModal } = this.state;

        return (
            <DismissKeyboard>
                <Block flex style={styles.container}>
                    <Block flex space="between" style={styles.padded}>
                        {
                            this.state.coupons.length == 0 && (
                                <Block style={styles.emptyContainer}>
                                    <Text style={styles.redText}>Aún no tienes cupones guardados</Text>
                                </Block>
                            )
                        }

                        <View style={{ height: height * 0.68 }}>
                            <ScrollView>
                                {
                                    this.state.coupons.map((item) => {
                                        return (
                                            <Block middle style={styles.cardContainer} key={item.id}>
                                                <TouchableOpacity onPress={() => this.setPredetermined(item)}>
                                                    <View style={{ width: width - theme.SIZES.BASE * 4, flexDirection: 'row', justifyContent: 'flex-end', paddingTop: 10, paddingRight: 10 }}>
                                                        {item.is_predetermined == true && (<Image source={require('../../assets/icons/success.png')} style={{ width: 25, height: 25 }} />)}
                                                    </View>

                                                    <Block row style={[{ width: width - theme.SIZES.BASE * 4, paddingBottom: 10, paddingHorizontal: 15, alignItems: 'center' }, !item.is_predetermined && { paddingTop: 15 }]}>
                                                        <View style={{ paddingHorizontal: 25 }}>
                                                            <Image source={Images.Icons.Cupones} style={styles.iconCard} />
                                                        </View>

                                                        <View style={{ width: 150, marginTop: -15 }}>
                                                            <Text style={[styles.title]}>{item.title}</Text>
                                                            <Text style={[styles.subtitle]} color={nowTheme.COLORS.SECONDARY}>{item.description}</Text>
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
                                onPress={() => this.setState({ showModal: true })}>
                                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.BASE, }} size={14}>
                                    AGREGAR CUPÓN  +
                                </Text>
                            </Button>
                        </Block>
                    </Block>

                    <Modal
                        animationType="slide"
                        transparent
                        visible={showModal}
                        presentationStyle="overFullScreen">
                        <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "height"} style={{ flex: 1 }}>
                            <View style={styles.modalContainer}>
                                {
                                    !this.state.isCreated ? (
                                        <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30, }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
                                                <Image source={Images.Icons.Cupones} style={{ height: 79, width: 79 }} />
                                                <Text style={styles.modalTitle}>Agrega un código promocional</Text>
                                                <Block width={width * 0.8} style={{ marginTop: 10 }}>
                                                    <Input
                                                        placeholder="ABCDE12345"
                                                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                                                        onChangeText={(text) => this.setState({ code: text })}
                                                        style={styles.inputs}
                                                    />
                                                </Block>
                                            </View>
                                            <Block middle style={{ alignItems: 'center' }}>
                                                <Button
                                                    round
                                                    color={nowTheme.COLORS.BASE}
                                                    style={styles.modalButton}
                                                    loading={this.state.isLoading}
                                                    loadingColor={nowTheme.COLORS.WHITE}
                                                    disabled={this.state.isLoading}
                                                    onPress={() => this.storeCoupon()}>
                                                    <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>VERIFICAR</Text>
                                                </Button>
                                            </Block>
                                        </View>
                                    ) : (
                                        <View style={{ backgroundColor: 'white', padding: 15, paddingBottom: 30, }}>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', paddingBottom: 25 }}>
                                                <Image source={require('../../assets/icons/success.png')} style={{ height: 79, width: 79 }} />
                                                <Text style={[styles.modalTitle, { marginBottom: 15 }]}>Agregado con éxito</Text>
                                                <Text style={styles.modalDescription}>
                                                    <Text style={styles.modalDescriptionRed}>{this.state.couponResponse.title} </Text>
                                                    {this.state.couponResponse.description}
                                                </Text>
                                            </View>
                                            <Block middle style={{ alignItems: 'center' }}>
                                                <Button
                                                    round
                                                    color={nowTheme.COLORS.BASE}
                                                    style={styles.modalButton}
                                                    onPress={() => {
                                                        this._getCoupons();
                                                        this.setState({ showModal: false, isCreated: false, couponResponse: null, });
                                                    }}>
                                                    <Text style={{ fontFamily: 'trueno-semibold', color: '#FFF' }} size={14} color={nowTheme.COLORS.WHITE}>LISTO</Text>
                                                </Button>
                                            </Block>
                                        </View>
                                    )
                                }
                            </View>
                        </KeyboardAvoidingView>
                    </Modal>
                </Block>
            </DismissKeyboard>
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
        color: nowTheme.COLORS.BASE,
        fontSize: 24,
        textAlign: 'left',
    },
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
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
    iconCard: {
        width: 65,
        height: 65
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
    modalDescriptionRed: {
        fontFamily: 'trueno-extrabold',
        fontSize: 16,
        color: nowTheme.COLORS.BASE,
    },
    inputs: {
        borderWidth: 1,
        borderColor: '#C0C0C0',
        borderRadius: 21.5
    },
    modalButton: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },

    emptyContainer: {
        backgroundColor: nowTheme.COLORS.WHITE,
        borderRadius: 25,
        height: 35,
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 1
        },
        shadowRadius: 3,
        shadowOpacity: 0.2,
        elevation: 3,

        marginTop: 30,
    },
    redText: {
        fontFamily: 'trueno',
        fontSize: 14,
        lineHeight: 15,
        color: nowTheme.COLORS.BASE,

        paddingVertical: 10,
        textAlign: 'center',
    },
});

export default CuponesIndexScreen;
