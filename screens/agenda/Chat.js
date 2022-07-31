import React from "react";
import { StyleSheet, Dimensions, Text, View, Alert, ScrollView, KeyboardAvoidingView, TouchableWithoutFeedback, Platform, Keyboard } from "react-native";
import { Block, Button, theme } from "galio-framework";
import Pusher from 'pusher-js/react-native';

import { Input } from '../../components';
import nowTheme from "../../constants/Theme";
import Actions from "../../lib/actions";
import env from '../../lib/enviroment';
import ChatService from '../../services/chat';

const { height, width } = Dimensions.get("screen");

const DismissKeyboard = ({ children }) => (
  <KeyboardAvoidingView behavior={Platform.OS == "ios" ? "padding" : "padding"} style={{ flex: 1 }}>
    {children}
  </KeyboardAvoidingView>
);

class AgendaChatScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      userName: '',
      service_id: this.props.route.params.service_id,
      messages: [],
      message: '',
      isLoading: false,
      months: ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"],
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user, userName: `${result.user.info.name}` });
        this._getMessages();
      }
    });

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState({ service_id: this.props.route.params.service_id });
      this._getMessages();
    });

    var pusher = new Pusher(env.PUSHER_KEY, {
      cluster: env.PUSHER_CLUSTER
    });

    var channel = pusher.subscribe('chat' + this.state.service_id);
    channel.bind('new-message', (data) => {
      if (data.message.fromTayder) {
        let messages = this.state.messages;
        messages.push(data.message);
        this.setState({ messages })
      }
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  async _getMessages() {
    await ChatService.getMessages(this.state.service_id)
      .then(response => {
        this.setState({ messages: response })
      })
      .catch(error => {
        console.error(error);
        Alert.alert("No fue posible cargar los mensajes anteriores.");
      })
  }

  formatDateTime = (item) => {
    let arrItem = item.created_at.split(" ");
    let arrDate = arrItem[0].split("-");
    let arrTime = arrItem[1].split(":");

    let datetime = new Date(Number(arrDate[0]), Number(arrDate[1]) - 1, Number(arrDate[2]), Number(arrTime[0]), Number(arrTime[1]));
    let month = this.state.months[datetime.getMonth()];
    let type = "a.m.";
    let minutes = datetime.getMinutes() < 10 ? `0${datetime.getMinutes()}` : datetime.getMinutes();
    let hour = datetime.getHours();

    if (hour >= 12) {
      if (hour > 12) hour -= 12;
      type = "p.m.";
    }

    return `Enviado el ${datetime.getDate()} de ${month} de ${datetime.getFullYear()}, ${hour}:${minutes} ${type}`;
  }

  _sendMessage = () => {
    if (this.state.message.trim() != '') {
      this.setState({ isLoading: true });

      let objMessage = {
        service_id: this.state.service_id,
        message: this.state.message,
        fromTayder: false,
      };

      ChatService.newMessage(objMessage)
        .then(response => {
          let messages = this.state.messages;
          messages.push(response.message);
          this.setState({ isLoading: false, messages, message: '' });
        })
        .catch(error => console.error("Ocurrió un error al enviar el mensaje."))
    }
  }

  render() {
    let { messages, isLoading, userName } = this.state;
    return (
      <DismissKeyboard>
        <Block flex style={styles.container}>
          <View style={{ height: height * 0.68 }}>
            <ScrollView
              ref={ref => scrollView = ref}
              onContentSizeChange={() => scrollView.scrollToEnd({ animated: true })}
            >
              {
                messages.length > 0 ?
                  messages.map(item => {
                    return !item.fromTayder ? (
                      <Block key={item.id} style={{ alignSelf: 'flex-end' }}>
                        <Block style={[styles.cardContainer]}>
                          <Text style={[styles.subtitleRed, { textAlign: 'right' }]}>{userName}</Text>
                          <Text style={[styles.subtitle, { textAlign: 'right' }]}>{item.message}</Text>
                        </Block>

                        <Text style={[styles.dateTimeInfo, { textAlign: 'right' }]}>{this.formatDateTime(item)}</Text>
                      </Block>
                    ) : (
                      <Block key={item.id} style={{ alignSelf: 'flex-start' }}>
                        <Block style={[styles.cardContainer]}>
                          <Text style={[styles.subtitleRed, { textAlign: 'left' }]}>{item.provider_name}</Text>
                          <Text style={[styles.subtitle, { textAlign: 'left' }]}>{item.message}</Text>
                        </Block>

                        <Text style={[styles.dateTimeInfo, { textAlign: 'left' }]}>{this.formatDateTime(item)}</Text>
                      </Block>
                    )
                  })
                  : (
                    <Block middle>
                      <Text>Sin mensajes</Text>
                    </Block>
                  )
              }
            </ScrollView>
          </View>

          <Block middle flex style={{ justifyContent: 'flex-end', flexDirection: 'row' }}>
            <Input
              placeholder="Respuesta"
              value={this.state.message}
              onChangeText={(text) => this.setState({ message: text })}
              style={styles.inputs}
            />

            <Button
              color={nowTheme.COLORS.BASE}
              round
              disabled={isLoading}
              loading={isLoading}
              loadingColor={nowTheme.COLORS.WHITE}
              style={styles.button}
              onPress={() => this._sendMessage()}
            >
              <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE }} size={14} color={nowTheme.COLORS.WHITE}>ENVIAR</Text>
            </Button>
          </Block>
        </Block>
      </DismissKeyboard>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: theme.SIZES.BASE * 1,
    bottom: theme.SIZES.BASE,
    backgroundColor: '#F7F7F7'
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

    paddingHorizontal: 20,
    paddingVertical: 10,
    width: width * 0.7
  },
  title: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.SECONDARY,
    fontSize: 24,
    textAlign: 'left',
  },
  subtitle: {
    fontFamily: 'trueno',
    fontSize: 14,
    color: nowTheme.COLORS.SECONDARY,
    textAlign: 'left',
  },
  subtitleRed: {
    fontFamily: 'trueno-semibold',
    fontSize: 12,
    color: nowTheme.COLORS.BASE,
    textAlign: 'left',
    lineHeight: 18,
  },
  dateTimeInfo: {
    fontFamily: 'trueno-semibold',
    fontSize: 9,
    lineHeight: 18,
    color: nowTheme.COLORS.SECONDARY,

    marginBottom: 20,
  },

  inputs: {
    borderWidth: 1,
    borderColor: '#E3E3E3',
    borderRadius: 21.5,
    fontFamily: 'trueno',
    fontSize: 17,
    letterSpacing: 20,

    width: width * 0.6,
    marginRight: 10
  },
  button: {
    width: width * 0.3,
    height: theme.SIZES.BASE * 2.5,

    shadowRadius: 0,
    shadowOpacity: 0,
  },
});

export default AgendaChatScreen;
