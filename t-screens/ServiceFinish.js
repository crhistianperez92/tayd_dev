import React from "react";
import {
    ImageBackground,
    StyleSheet,
    StatusBar,
    Dimensions,
    Text,
    View,
    Image,
} from "react-native";
import { Block, Button, theme } from "galio-framework";
import nowTheme from "../constants/Theme";
import Images from "../constants/Images";

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class ServiceFinishTayder extends React.Component {
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
                    <ImageBackground source={Images.BlackLightsBackground} style={{ height, width, zIndex: 1 }} />
                </Block>

                <Block flex space="between" style={styles.padded}>
                    <Block style={styles.cardContainer}>
                        <View>
                            <Image source={require('../assets/icons/success.png')} style={{height: 110, width: 110}} />
                        </View>

                        <View style={{paddingHorizontal: 40, marginVertical: 25}}>
                            <Text style={styles.successTitle}>¡Muchas gracias!</Text>
                        </View>

                        <View style={{paddingHorizontal: 40, paddingBottom: 10}}>
                            <Text style={styles.textNormal}>En breve reflejaremos tu ingreso acumulado por este servicio.</Text>
                        </View>

                        <View style={{paddingHorizontal: 40, paddingBottom: 30}}>
                            <Text style={styles.textNormal}>
                                Es posible que comentarios y calificación del cliente también aparezcan
                                en tu historial para una retroalimentación del servicio.
                            </Text>
                        </View>

                        <Block middle style={{ paddingTop: 30 }}>
                            <Button
                                round
                                color={nowTheme.COLORS.BASE}
                                style={styles.button}
                                onPress={() => navigation.navigate("HomeTayder")}>
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
        height: height < 812 ? height * 0.7 : height * 0.7,
        justifyContent: 'center',
        alignItems: 'center',
    },
    padded: {
        top: smallScreen ? 200 : 200,
        justifyContent: 'center',
        alignSelf: 'center',
        paddingHorizontal: theme.SIZES.BASE * 1.3,
        position: 'absolute',
        bottom: theme.SIZES.BASE,
        zIndex: 2,
        width: width,
    },

    textNormal: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        lineHeight: 17,
        color: nowTheme.COLORS.WHITE,
        textAlign: 'center',
    },
    successTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 45,
        lineHeight: 43,
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

export default ServiceFinishTayder;
