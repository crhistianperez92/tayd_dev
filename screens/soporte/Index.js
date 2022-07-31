import React from "react";
import { StyleSheet, Dimensions, ScrollView, StatusBar } from "react-native";
import { Block, theme, Text } from "galio-framework";

import { CardFullImage, TabBar, Icon } from "../../components";
import { Images, nowTheme } from '../../constants/';
import { iPhoneX } from "../../constants/utils";
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");

class SoporteIndexScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }
    renderBlocks = () => {
        return (
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
                <Block flex>
                    <Block flex row style={{paddingTop: iPhoneX() ? 30 : 10}}>
                        <Icon
                            name={'align-left-22x'}
                            family="NowExtra"
                            size={16}
                            onPress={() => this.props.navigation.openDrawer()}
                            color={nowTheme.COLORS.ICON}
                            style={{fontWeight: '700', marginRight: 15, paddingTop: 5}}
                        />
                        <Block flex>
                            <Text style={styles.nameTitle}>¿Necesitas ayuda?</Text>
                            <Text style={styles.subtitle}>Esperamos solucionar tus dudas</Text>
                        </Block>
                    </Block>

                    <Block style={{ marginTop: 10 }}>
                        <TouchableOpacity onPress={() => this.setState({ showMore: true })}>
                            <CardFullImage image={Images.TaydAyuda} imageStyle={{ height: height * 0.40, width: '100%' }} />
                        </TouchableOpacity>
                        
                        <Block flex style={{ paddingTop: 15 }}>
                            <Block middle style={styles.cardContainer}>
                                <TouchableOpacity style={styles.section} onPress={() => this.props.navigation.navigate('SoporteCita')}>
                                    <Text style={styles.itemTitle}>¿Cómo agendo una cita?</Text>
                                    <Icon
                                        size={22}
                                        color={nowTheme.COLORS.SECONDARY}
                                        name="chevron-right"
                                        family="FontAwesome"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity>
                                    <Block style={styles.section}>
                                        <Text style={styles.itemTitle}>Informar un problema</Text>
                                        <Icon
                                            size={22}
                                            color={nowTheme.COLORS.SECONDARY}
                                            name="chevron-right"
                                            family="FontAwesome"
                                        />
                                    </Block>
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.section}>
                                    <Text style={styles.itemTitle}>Mensajes de soporte</Text>
                                    <Icon
                                        size={22}
                                        color={nowTheme.COLORS.SECONDARY}
                                        name="chevron-right"
                                        family="FontAwesome"
                                    />
                                </TouchableOpacity>

                                <TouchableOpacity style={styles.section} onPress={() => this.props.navigation.navigate('BolsaTrabajo')}>
                                    <Text style={styles.itemTitle}>Bolsa de trabajo</Text>
                                    <Icon
                                        size={22}
                                        color={nowTheme.COLORS.SECONDARY}
                                        name="chevron-right"
                                        family="FontAwesome"
                                    />
                                </TouchableOpacity>
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

export default SoporteIndexScreen;
