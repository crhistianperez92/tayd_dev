import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, StatusBar, View } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { CardFullImage, TabBar, Icon } from "../../components";
import { Images, nowTheme } from '../../constants/';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

class SoporteCitaScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    renderBlocks = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
                <Block flex>
                    <StatusBar barStyle="light-content" />
                    <Block flex row style={{ paddingTop: 30 }}>
                        <Image source={Images.ProfilePicture} style={{ borderRadius: 50, height: 60, width: 60, marginRight: 25 }} />
                        <Block flex>
                            <Text style={styles.nameTitle}>¿Necesitas ayuda?</Text>
                            <Text style={styles.subtitle}>Esperamos solucionar tus dudas</Text>
                        </Block>
                    </Block>

                    <Block style={{ marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ showMore: true })}>
                            <CardFullImage image={Images.TaydAyudaCita} imageStyle={{ height: height * 0.40, width: '100%' }} />
                        </TouchableOpacity>

                        <Block flex style={{ paddingTop: 15 }}>
                            <Block middle style={styles.cardContainer}>
                                <Block style={styles.section}>
                                    <Text style={[styles.nameTitle, {paddingLeft: 20}]}>Agendar cita</Text>

                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Soporte')}>
                                        <Image source={Images.Icons.Close01} />
                                    </TouchableOpacity>
                                </Block>

                                <Block style={[styles.item, styles.divider]}>
                                    <Text style={styles.itemTitle}>Opción 1</Text>
                                    <Text style={styles.itemSubtitle}>En la pantalla de inicio pulsa en el banner de "Limpieza a un toque" y sigue las instrucciones.</Text>
                                </Block>

                                <Block style={[styles.item, {paddingBottom: 15}]}>
                                    <Text style={styles.itemTitle}>Opción 2</Text>
                                    <Text style={styles.itemSubtitle}>En la pestaña "Agenda" pulsa en el banner "Agendar una cita" y sigue las instrucciones.</Text>
                                </Block>
                            </Block>
                        </Block>
                    </Block>
                </Block>
            </ScrollView>
        );
    };

    render() {
        return (
            <Block flex center style={styles.home}>
                {this.renderBlocks()}

                <TabBar {...this.props} activeScreen="soporte" />
            </Block>
        );
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
        width: width * 0.88,
        justifyContent: 'space-between',
        paddingHorizontal: 15,
        paddingVertical: 10,
        paddingLeft: 10,
    },
    item: {
        width: width * 0.77,
        paddingHorizontal: 15,
        paddingLeft: 10,
    },
    itemTitle: {
        fontFamily: 'trueno-semibold',
        fontSize: 16,
        lineHeight: 17,
        color: nowTheme.COLORS.SECONDARY,
        textAlign: 'left',
    },
    itemSubtitle: {
        fontFamily: 'trueno-light',
        fontSize: 16,
        lineHeight: 17,
        color: nowTheme.COLORS.SECONDARY,
    },
    divider: {
        borderBottomColor: nowTheme.COLORS.DIVIDER,
        borderBottomWidth: 1,
        paddingBottom: 15,
        marginBottom: 15,
    },
});

export default SoporteCitaScreen;
