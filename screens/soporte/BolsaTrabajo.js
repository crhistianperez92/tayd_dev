import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, StatusBar, View } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { CardFullImage, TabBar, Icon } from "../../components";
import { Images, nowTheme } from '../../constants/';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

export default class BolsaTrabajoScreen extends React.Component {

    render() {
        return (
            <Block flex style={styles.container}>
                <Block flex center>
                    <ImageBackground source={Images.AgendaInicio} style={{ height, width, zIndex: 1 }} />
                </Block>

                <Block flex space="between" style={styles.padded}>
                    <Block middle row style={styles.cardContainer}>
                        <Block middle style={{paddingHorizontal: 40, paddingVertical: 20}}>
                            <Text style={[styles.title, {paddingBottom: 15}]}>
                                El futuro de la limpieza
                            </Text>

                            <Text style={[styles.subtitle, {paddingBottom: 15}]}>
                                En TAYD ordenamos y limpiamos tu domicilio de manera profesional y segura.
                            </Text>

                            <Text style={[styles.subtitle, {paddingBottom: 20}]}>
                                Nuestros TAYDERS son el mejor equipo capacitado que harán todo.
                            </Text>

                            <Text style={[styles.title, {paddingBottom: 15}]}>
                                ¿Te ayudamos?
                            </Text>

                            <Text style={styles.subtitle}>
                                Agendar una cita con nosotros es fácil, solo sigue los siguientes pasos y comienza a disfrutar de nuestros servicios.
                            </Text>
                        </Block>
                    </Block>

                    <Block middle flex space="around" style={{ zIndex: 2 }}>
                        <Button
                            round
                            color={nowTheme.COLORS.BASE}
                            style={styles.button}
                            onPress={() => navigation.navigate('AgendaFecha')}>
                            <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                AGENDAR
                            </Text>
                        </Button>
                    </Block>
                </Block>
            </Block>
        )
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
        paddingVertical: 10,
    },
    
    section: {
        flexDirection: 'row',
        width: width * 0.9,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 15,
    },
    itemTitle: {
        fontFamily: 'trueno-semibold',
        fontSize: 16,
        lineHeight: 15,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
        paddingLeft: 15,
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
});