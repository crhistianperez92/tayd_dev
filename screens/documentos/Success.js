import React from "react";
import {
    ImageBackground,
    StyleSheet,
    StatusBar,
    Dimensions,
    Text,
    View,
    Image,
    Modal
} from "react-native";
import { Block, Button, theme } from "galio-framework";

import Actions from '../../lib/actions';
import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";

const { height, width } = Dimensions.get("screen");

class DocumentosSuccessScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError    : false,
        }
    }

    _logout() {
        Actions.removeUserData().then((response) => {
          if(response) {
              this.props.navigation.navigate('Onboarding')
          }
        });
    }

    render() {
        return (
            <Block flex style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Block flex center>
                    <ImageBackground source={Images.BlackLightsBackground} style={{ height, width, zIndex: 1 }} />
                </Block>

                <Block flex space="between" style={styles.padded}>
                    <Block style={styles.cardContainer}>
                        <View>
                            <Image source={require('../../assets/icons/success.png')} style={{height: 100, width: 100}} />
                        </View>

                        <View style={{ paddingHorizontal: 40, paddingTop: 40, paddingBottom: 10}}>
                            <Text style={styles.successTitle}>Enviado</Text>
                        </View>

                        <View style={{paddingHorizontal: 40}}>
                            <Text style={styles.textNormal}>
                                En breve nuestro equipo revisará tu solicitud para ponerse en contacto contigo.
                                Te invitamos a estar pendiente de tu correo electrónico.
                            </Text>
                        </View>

                        <Block middle style={{ marginTop: 180 }}>
                            <Button
                                round
                                color={nowTheme.COLORS.BASE}
                                style={styles.button}
                                onPress={() => this._logout()}>
                                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                    FINALIZAR
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.BLACK
    },
    cardContainer: {
        height: height < 812 ? height * 0.9 : height * 0.9,
        justifyContent: 'center',
        alignItems: 'center',
    },
    padded: {
        top: 150,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: theme.SIZES.BASE * 1.3,
        position: 'absolute',
        bottom: theme.SIZES.BASE,
        zIndex: 2,
        width: width,
    },
    successTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.WHITE,
        fontSize: 45,
        textAlign: 'center',
    },

    textNormal: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        color: nowTheme.COLORS.WHITE,
        textAlign: 'center',
    },

    button: {
        width: width * 0.4,
        height: theme.SIZES.BASE * 2.5,
        shadowRadius: 0,
        shadowOpacity: 0
    },
});

export default DocumentosSuccessScreen;
