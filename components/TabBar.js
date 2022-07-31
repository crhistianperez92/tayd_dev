import React from 'react';
import {
    StyleSheet,
    View,
    Text,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    Modal
} from 'react-native';
import { Images, nowTheme } from '../constants';
import Pusher from 'pusher-js/react-native';
import env from '../lib/enviroment';
import Actions from '../lib/actions';

const { width, height } = Dimensions.get("screen");
const isIphone = Platform.OS == 'ios' ? true : false;

Pusher.logToConsole = false;

export default class TabBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            screen: this.props.activeScreen,
            showAlert: false,
            alertMessage: "Tienes 1 cita en curso",
            userData: null,
        }
    }

    async componentDidMount() {
        await Actions.extractUserData().then((result) => {
            if(result != null) {
              this.setState({userData: result.user});
            }
        });

        var pusher = new Pusher(env.PUSHER_KEY, {
            cluster: env.PUSHER_CLUSTER
        });
          
        var channel = await pusher.subscribe('notifications' + this.state.userData.id);
        channel.bind('service-status', (data) => {
            this.setState({showAlert: true, alertMessage: data.message})
        });
    }

    _closeAlert = () => {
        this.setState({showAlert: false, alertMessage: ""})
    }

    render() {
        return (
            <View style={[styles.tabBar, styles.tabBarLight]}>
                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("Home")}>
                    <Image source={this.state.screen == 'home' ? Images.Icons.Inicio : Images.Icons.Inicio_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'home' ? styles.titleActive : styles.titleInactive]}>Inicio</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("History")}>
                    <Image source={this.state.screen == 'history' ? Images.Icons.Historial : Images.Icons.Historial_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'history' ? styles.titleActive : styles.titleInactive]}>Historial</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("Schedule")}>
                    <Image source={this.state.screen == 'agenda' ? Images.Icons.Agenda : Images.Icons.Agenda_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'agenda' ? styles.titleActive : styles.titleInactive]}>Agenda</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.tabItem} onPress={() => this.props.navigation.navigate("Soporte")}>
                    <Image source={this.state.screen == 'soporte' ? Images.Icons.Ayuda : Images.Icons.Ayuda_G} style={{ width: 22, height: 22 }} />
                    <Text style={[styles.tabTitle, this.state.screen == 'soporte' ? styles.titleActive : styles.titleInactive]}>Ayuda</Text>
                </TouchableOpacity>

                <Modal
                    animationType="fade"
                    transparent
                    visible={this.state.showAlert}
                    presentationStyle="overFullScreen">
                    <View style={{ flex: 1, height: height, backgroundColor: 'rgba(0,0,0,.3)', justifyContent: 'flex-start', alignItems: 'center' }}>
                        <View style={styles.alertContainer}>
                            <Text style={styles.alertMessage}>{this.state.alertMessage}</Text>
                            <TouchableOpacity onPress={() => this._closeAlert()} style={{marginTop: -1}}>
                                <Image source={Images.Icons.Close01} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    tabBar: {
        width: width,
        height: 50,
        borderTopWidth: 0.5,
        borderColor: '#EEEEEE',
        flexDirection: 'row',
        justifyContent: 'space-around',
        marginBottom: isIphone && height >= 812 ? 20 : 0,
    },
    tabBarLight: {
        backgroundColor: '#EFEFEF',
    },
    tabItem: {
        alignItems: 'center',
        justifyContent: 'center'
    },
    tabTitle: {
        fontSize: 11,
    },
    titleInactive: {
        color: '#999999',
    },
    titleActive: {
        color: nowTheme.COLORS.BASE,
    },

    alertContainer: {
        width: width * 0.85,
        backgroundColor: '#FFF',
        borderRadius: 25,
        marginTop: 80,
        paddingVertical: 6,
        paddingHorizontal: 10,

        flexDirection: 'row',
        justifyContent: 'space-between',
        alignContent: 'center'
    },
    alertMessage: {
        fontFamily: 'trueno',
        fontSize: 16,
        width: width * 0.7,
        color: nowTheme.COLORS.BASE,
        paddingHorizontal: 10,
        textAlign: 'center'
    },
});