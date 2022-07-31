import React from "react";
import { StyleSheet, Dimensions, ScrollView, Image, View, TextInput, Alert } from "react-native";
import { Block, theme, Text, Button } from "galio-framework";

import { TabBar, Rating } from "../components";
import { Images, nowTheme } from '../constants/';
import ServicesService from '../services/service';
import Actions from "../lib/actions";

const { width, height } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

class RateServiceScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      service: this.props.route.params.service,
      isLoading: false,
      rateValue: 0,
      comments: '',
    }
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user });
      }
    });

    this.focusListener = await navigation.addListener('focus', () => {
      this.setState({
        service: this.props.route.params.service,
      })
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  ratingCompleted = (rating) => {
    this.setState({ rateValue: rating });
  }

  _handleNextAction() {
    if (this.state.rateValue > 0 && this.state.comments.trim() != '') {
      this.setState({ isLoading: true });
      let objRate = {
        service_id: this.state.service.id,
        rating: this.state.rateValue,
        comments: this.state.comments
      }
      ServicesService.rateService(objRate)
        .then(response => {
          Alert.alert("Servicio", "Gracias por tus comentarios.");
          this.setState({ rateValue: 0, comments: '', isLoading: false });
          this.props.navigation.navigate("History");
        })
        .catch(error => {
          Alert.alert("servicio", error.data.error);
        })
    } else {
      Alert.alert("Servicio", "Es necesario seleccionar una calificación y dejar tu comentario.");
    }
  }

  render() {
    let { userData, isLoading } = this.state;

    return (
      <Block flex center style={styles.home}>
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
          <Block flex>
            <Block flex row style={{ paddingTop: 10 }}>
              <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginRight: 25 }} />
              <Block flex>
                <Text style={styles.nameTitle}>Agenda de {userData != null && userData.info ? userData.info.name : ''}</Text>
                <Text style={styles.subtitle}>Organiza tus citas en TAYD</Text>
              </Block>
            </Block>

            <View style={{ height: height * 0.7 }}>
              <ScrollView>
                <Block flex style={{ marginTop: 20 }}>
                  <Block middle style={styles.cardContainer}>
                    <Text style={[styles.serviceTitle]}>¿Cómo fue tu experiencia?</Text>

                    <Text style={[styles.serviceSubtitle, { marginTop: 15, paddingHorizontal: 20 }]}>
                      A continuación podrás calificar nuestra calidad de trabajo, fue un placer ayudarte.
                    </Text>

                    <Block style={{ marginVertical: 25 }}>
                      <Rating
                        count={5}
                        showRating={false}
                        defaultRating={0}
                        onFinishRating={this.ratingCompleted}
                      />
                    </Block>

                    <Text style={[styles.serviceTitle, { marginTop: 0 }]}>Déjanos tus comentarios</Text>

                    <Block width={width * 0.8} style={{ marginTop: 10 }}>
                      <TextInput
                        style={styles.inputs}
                        placeholderTextColor={nowTheme.COLORS.PLACEHOLDER}
                        multiline={true}
                        numberOfLines={5}
                        blurOnSubmit={false}
                        onChangeText={(text) => this.setState({ comments: text })}
                      />
                    </Block>

                    <Button
                      round
                      disabled={isLoading}
                      loading={isLoading}
                      loadingColor={nowTheme.COLORS.WHITE}
                      color={nowTheme.COLORS.BASE}
                      style={styles.button}
                      onPress={() => this._handleNextAction()}>
                      <Text style={{ fontFamily: 'trueno-semibold' }} size={14} color={nowTheme.COLORS.WHITE}>
                        ENVIAR
                      </Text>
                    </Button>
                  </Block>
                </Block>
              </ScrollView>
            </View>
          </Block>
        </ScrollView>

        <TabBar {...this.props} activeScreen="agenda" />
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
    paddingHorizontal: 15,
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
  serviceTitle: {
    fontFamily: 'trueno-extrabold',
    color: nowTheme.COLORS.GREY5,
    fontSize: 32,
    textAlign: 'center',
    marginTop: 20,
  },
  serviceSubtitle: {
    fontFamily: 'trueno',
    fontSize: 16,
    color: nowTheme.COLORS.GREY5,
    textAlign: 'center',
  },

  inputs: {
    borderWidth: 1,
    borderColor: '#eeeef0',
    borderRadius: 10,

    height: 90,
    backgroundColor: nowTheme.COLORS.WHITE,
    color: nowTheme.COLORS.GREY5,
  },

  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    marginTop: 10,
    marginBottom: 10,
    shadowRadius: 0,
    shadowOpacity: 0
  }
});

export default RateServiceScreen;
