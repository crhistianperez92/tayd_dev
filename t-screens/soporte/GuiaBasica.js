import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, StatusBar, View } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { CardFullImage, TabBarTayder } from "../../components";
import { Images, nowTheme } from '../../constants/';
import { TouchableOpacity } from "react-native-gesture-handler";

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class SoporteTayderGuiaBasicaScreen extends React.Component {
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
                        <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginRight: 25 }} />
                        <Block flex>
                            <Text style={styles.nameTitle}>¿Necesitas ayuda?</Text>
                            <Text style={styles.subtitle}>Esperamos solucionar tus dudas</Text>
                        </Block>
                    </Block>

                    <Block style={{ marginTop: 10 }}>
                        <Block flex middle style={styles.cardContainer}>
                            <Block style={styles.section}>
                                <Text style={[styles.nameTitle, {paddingLeft: 20}]}> </Text>

                                <TouchableOpacity onPress={() => this.props.navigation.navigate('SoporteTayder')} style={{marginTop: 15}}>
                                    <Image source={Images.Icons.Close01} />
                                </TouchableOpacity>
                            </Block>

                            <Image source={Images.TaydAyudaPasos} style={styles.imageStyle}/>
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

                <TabBarTayder {...this.props} activeScreen="soporte" />
            </Block>
        );
    }
}

const styles = StyleSheet.create({
    home: {
        width: width,
        backgroundColor: nowTheme.COLORS.BLACK,
    },
    nameTitle: {
        fontFamily: 'trueno-extrabold',
        fontSize: 24,
        color: nowTheme.COLORS.WHITE,
        lineHeight: 29,
    },
    subtitle: {
        fontFamily: 'trueno',
        fontSize: 14,
        lineHeight: 15,
        color: nowTheme.COLORS.WHITE,
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
    },

    section: {
        flexDirection: 'row',
        width: width,
        paddingHorizontal: 30,
        justifyContent: 'space-between',
    },
    imageStyle: {
        width: smallScreen ? width : width * 0.84,
        height: smallScreen ? height : height * 0.8,
    }
});

export default SoporteTayderGuiaBasicaScreen;
