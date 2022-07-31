import React from 'react';
import { StyleSheet, Modal, View, Image, Dimensions, ScrollView, TouchableOpacity } from 'react-native';
import { Block, Text, theme, Button } from "galio-framework";
import { nowTheme, Images } from '../constants'
import PropertyService from '../services/property';

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class PropertyModalComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showModal   : this.props.showPropertyModal,
            user_id     : this.props.userId,
            isLoading   : false,
            activeValue : this.props.defaultValue,
            properties  : [],
        }
    }

    componentDidMount() {
        this._getProperties();
    }

    static getDerivedStateFromProps(nextProps, prevState) {
        const { showPropertyModal, defaultValue } = nextProps;

        if(showPropertyModal !== prevState.showPropertyModal) {
            return { showModal: showPropertyModal}
        }
        return null;
    }

    async _getProperties() {
        await PropertyService.getUserProperties(this.state.user_id)
            .then(response => {
                this.setState({properties : response})
            })
            .catch(error => {
                Alert.alert("No se encontraron domicilios vinculados a este usuario.");
            })
    }

    _handleAction = () => {
        this.props.onClose(this.state.activeValue);
    }

    render() {
        let {showModal, isLoading, properties, activeValue} = this.state;
        return (
            <Modal
                animationType="fade"
                transparent
                visible={showModal}
                presentationStyle="overFullScreen">
                <View style={{ flex: 1, height: height, backgroundColor: 'rgba(0,0,0,.3)', alignItems: 'center' }}>
                    <View style={styles.alertContainer}>
                        <Block middle>
                            <Text style={styles.modalTitle}>Cambiar Domicilio</Text>
                            <View style={{height: height * 0.4, paddingHorizontal: 15}}>
                                <ScrollView>
                                    {
                                        properties.map((item) => {
                                            return (
                                                <Block middle style={[styles.cardContainer, activeValue == item.id ? styles.activeCard : styles.noActiveCard]} key={item.id}>
                                                    <TouchableOpacity onPress={() => this.setState({activeValue : item.id})}>
                                                        <Block row style={[{ width: width - theme.SIZES.BASE * 4, paddingVertical: 10, paddingHorizontal: 15, alignItems: 'center' }]}>
                                                            <View style={{ paddingHorizontal: 25 }}>
                                                                {item.property_type_id == 1 && (<Image source={activeValue == item.id ? Images.Icons.Casa_B : Images.Icons.Casa_G} style={styles.imageProperty} />) }
                                                                {item.property_type_id == 2 && (<Image source={activeValue == item.id ? Images.Icons.Departamento_B : Images.Icons.Departamento_G} style={styles.imageProperty} />)}
                                                                {item.property_type_id == 3 && (<Image source={activeValue == item.id ? Images.Icons.Oficina_B : Images.Icons.Oficina_G} style={styles.imageProperty} />)}
                                                            </View>

                                                            <View style={{ width: 150, marginTop: -15 }}>
                                                                <Text style={[styles.propertyName, activeValue == item.id ? styles.propertyNameActive : styles.propertyNameNoActive]}>{item.name}</Text>
                                                            </View>
                                                        </Block>
                                                    </TouchableOpacity>
                                                </Block>
                                            )
                                        })
                                    }
                                </ScrollView>
                            </View>

                            <Block middle style={{ marginTop: 20 }}>
                                <Button
                                    round
                                    loading={isLoading}
                                    disabled={isLoading}
                                    color={nowTheme.COLORS.BASE}
                                    style={[styles.button, {marginBottom: 25}]}
                                    onPress={() => this._handleAction()}>
                                    <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                        LISTO
                                    </Text>
                                </Button>
                            </Block>
                        </Block>
                    </View>
                </View>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    alertContainer: {
        width: width * 0.9,
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginTop: smallScreen ? 120 : 150,

        alignContent: 'center',
        overflow: 'hidden'
    },
    cardContainer: {
        borderRadius: 25,
        shadowColor: nowTheme.COLORS.BLACK,
        shadowOffset: {
            width: 0,
            height: 3
        },
        elevation: 1,
        overflow: 'hidden',

        marginVertical: 10,
        marginHorizontal: 25,
    },
    activeCard: {
        backgroundColor: nowTheme.COLORS.BASE,
    },
    noActiveCard: {
        backgroundColor: nowTheme.COLORS.WHITE,
        borderColor: 'rgb(222, 222, 224)',
        borderWidth: 2,
    },
    modalTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 35,
        lineHeight: 35,
        color: nowTheme.COLORS.GREY5,
        textAlign: 'center',

        marginVertical: 25,
        paddingHorizontal: 60,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        bottom: theme.SIZES.BASE,
    },
    propertyName: {
        fontFamily: 'trueno',
        fontSize: 16,
        lineHeight: 18,
        textAlign: 'left',
    },
    propertyNameActive: {
        color: nowTheme.COLORS.WHITE
    },
    propertyNameNoActive: {
        color: 'rgb(222, 222, 224)'
    },
    imageProperty: {
        width: 65,
        height: 65
    },
    button: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },
});