import React from "react";
import {
    ImageBackground,
    StyleSheet,
    StatusBar,
    Dimensions,
    Text,
    View,
    Image
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import nowTheme from "../constants/Theme";
import Images from "../constants/Images";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class WelcomeScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            
        }
    }
    render() {
        const { navigation } = this.props;

        return (
            <Block flex style={styles.container}>
                <StatusBar barStyle="light-content" />
                <Block flex center>
                    <ImageBackground source={Images.RegisterTayderBackground} style={{ height, width, zIndex: 1 }} />
                </Block>

                <Block flex space="between" style={styles.padded}>
                    <Block style={styles.cardContainer}>
                        <View style={{ paddingHorizontal: 40, paddingTop: 40, paddingBottom: 10}}>
                            <Text style={styles.successTitle}>¡Bienvenido al equipo!</Text>
                        </View>

                        <View style={{paddingHorizontal: 40, paddingBottom: 20}}>
                            <Text style={styles.textNormal}>
                                A continuación haremos un breve recorrido por el panel de los TAYDERS.
                            </Text>
                        </View>

                        <View style={{ paddingHorizontal: 40 }}>
                            <Text style={styles.textNormal}>
                                Te invitamos a usar tus herramientas de manera responsable para juntos generar ingresos.
                            </Text>
                        </View>

                        <Block middle style={{ marginTop: 40 }}>
                            <Button
                                round
                                color={nowTheme.COLORS.BASE}
                                style={styles.button}
                                onPress={() => navigation.navigate("HomeTayder")}>
                                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                    EMPEZAR
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
        top: smallScreen ? 250 : 360,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: theme.SIZES.BASE * 0.8,
        position: 'absolute',
        bottom: theme.SIZES.BASE,
        zIndex: 2,
        width: width,
    },
    successTitle: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.WHITE,
        fontSize: smallScreen ? 38 : 45,
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

export default WelcomeScreen;
