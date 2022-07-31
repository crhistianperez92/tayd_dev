import React from "react";
import { StyleSheet, Dimensions, ImageBackground, Image, StatusBar, View } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { Images, nowTheme } from '../../constants/';
import Actions from '../../lib/actions';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class DocumentosValidationScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            userData: null,
        };
    }

    _logout() {
        Actions.removeUserData().then((response) => {
          if(response) {
              this.props.navigation.navigate('Login')
          }
        });
    }

    render() {
        return (
            <Block flex style={styles.home}>
                <StatusBar barStyle="light-content" />

                <Block center style={styles.cardContainer}>
                    <ImageBackground source={Images.LightsBackground} style={{width: width * 0.85, height: height * 0.7}}>
                        <Block middle style={{paddingHorizontal: 15 }}>
                            <Image source={Images.Icons.Validacion} style={{marginTop: 30, width: 220, height: 180 }} />

                            <Text style={[styles.title]}>Validando Documentos</Text>
                            <Text style={[styles.subtitle]}>
                                Nuestro equipo se encuentra validando los documentos que nos enviaste, revisa tu correo
                                para informarte de tu cita programada en nuestras oficinas.
                            </Text>
                        </Block>
                    </ImageBackground>
                </Block>

                <Block center style={{marginVertical: 25}}>
                    <Button
                        round
                        color={nowTheme.COLORS.BASE}
                        style={styles.button}
                        onPress={() => this._logout()}
                    >
                        <Text style={{fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, lineHeight: 16 }} size={14}>
                            ENTENDIDO
                        </Text>
                    </Button>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        backgroundColor: nowTheme.COLORS.BLACK,
    },
    button: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },

    cardContainer: {
        width: width * 0.85,
        height: height * 0.7,
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginTop: 70,

        alignContent: 'center',
        overflow: 'hidden'
    },
    title: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.GREY5,
        fontSize: 31,
        lineHeight: 32,
        textAlign: 'center',
        paddingVertical: 20,
    },
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 16,
        color: nowTheme.COLORS.GREY5,
        textAlign: 'center',
        paddingHorizontal: 25
    },
});
