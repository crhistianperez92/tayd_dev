import React from "react";
import {
    Image,
    StyleSheet,
    StatusBar,
    Dimensions,
    Text, View, ScrollView, Alert
} from "react-native";
import { Block, Button, theme } from "galio-framework";

const { height, width } = Dimensions.get("screen");

import nowTheme from "../../constants/Theme";
import Images from "../../constants/Images";

class GeneraIngresoIndexScreen extends React.Component {
    render() {
        const { navigation } = this.props;

        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
                <Block flex>
                    <Block center style={{paddingTop: 30}}>
                        <Image source={Images.LogoTayder} style={{ width: width * 0.8, height: 320}} />
                    </Block>

                    <Block flex style={styles.padded}>
                        <Block middle style={{ paddingHorizontal: 40, paddingVertical: 20 }}>
                            <Text style={[styles.title, { paddingBottom: 15 }]}>
                                Conviertete en un TAYDER
                            </Text>

                            <Text style={[styles.subtitle, { paddingBottom: 15 }]}>
                                El futuro de la limpieza necesita de un equipo entusiasta y con ganas de dejar historia en México
                            </Text>

                            <Text style={styles.subtitle}>
                                Si deseas generar ingresos extras limpiando, regístrate y forma parte de este increíble proyecto.
                            </Text>
                        </Block>

                        <Block middle flex space="around">
                            <Button
                                round
                                color={nowTheme.COLORS.BASE}
                                style={styles.button}
                                onPress={() => Alert.alert("Tayder", "Registrate como tayder para iniciar el proceso de validación.")}>
                                <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                                    ÚNETE
                                </Text>
                            </Button>
                        </Block>
                    </Block>
                </Block>

            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: theme.COLORS.BLACK,
        flex: 1,
    },
    padded: {
        paddingHorizontal: theme.SIZES.BASE * 2,
        paddingTop: 30,
        bottom: theme.SIZES.BASE,
    },
    title: {
        fontFamily: 'trueno-extrabold',
        color: nowTheme.COLORS.WHITE,
        fontSize: 32,
        textAlign: 'center',
    },
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
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

export default GeneraIngresoIndexScreen;
