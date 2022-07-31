import React from "react";
import { StyleSheet, Dimensions, Image, StatusBar, View } from "react-native";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Block, theme, Text, Button } from "galio-framework";
import Carousel from 'react-native-snap-carousel';

import { TabBarTayder, Switch, ServiceCardSliderTayder } from "../components";
import { Images, nowTheme } from '../constants/';
import Actions from '../lib/actions';
import UserService from '../services/user';
import ServicesService from '../services/service';

const { height, width } = Dimensions.get("screen");
const smallScreen = height < 812 ? true : false;

export default class HomeTayder extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userData: null,
      tayderName: '',
      isFirstLogin: true,
      isOnline: true,
      isLoading: false,
      statusText: 'En Línea',

      activeIndex: 0,
      hasAcceptButton: true,
      carouselIntroItems: [
        { image: Images.CarouselIndicador01 },
        { image: Images.CarouselIndicador02 },
        { image: Images.CarouselIndicador03 },
        { image: Images.CarouselIndicador04 },
        { image: Images.CarouselIndicador05 },
        { image: Images.CarouselIndicador06 },
        { image: Images.CarouselIndicador07 },
        { image: Images.CarouselIndicador08 },
      ],

      services: [],
    };
  }

  async componentDidMount() {
    const { navigation } = this.props;

    await Actions.extractUserData().then((result) => {
      if (result != null) {
        this.setState({ userData: result.user, isFirstLogin: result.user.first_login_tayder, tayderName: result.user.info.name });
      }
    });

    await this._getScheduledServices();

    this.focusListener = await navigation.addListener('focus', () => {
      this._getScheduledServices();
    });
  }

  componentWillUnmount() {
    this.focusListener()
  }

  async _updateFirstLogin() {
    this.setState({ hasAcceptButton: false, isLoading: true });

    await UserService.firstLoginTayder(this.state.userData.id)
      .then(async (response) => {
        await Actions.removeUserData().then(() => { });
        await AsyncStorage.setItem('user', JSON.stringify(response));
        this.setState({ isLoading: false, userData: response, isFirstLogin: response.first_login_tayder, tayderName: response.info.name });
      })
      .catch(e => console.error(e));
  }

  async _getScheduledServices() {
    await ServicesService.listTayderScheduled(this.state.userData.id)
      .then(response => {
        this.setState((state) => {
          return { services: response }
        });
      })
      .catch(error => console.error(error));
  }

  _changeStatus = (switchValue) => {
    let message = switchValue ? 'En Línea' : 'Desconectado';
    this.setState({ isOnline: !this.state.isOnline, statusText: message });
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ height: 560 }}>
        <Image source={item.image} style={{ height: 550, width: 300, resizeMode: 'stretch', }} />
      </View>
    )
  }

  onSnapToItem = (index) => {
    this.setState({ activeIndex: index });
  }

  renderBlocks() {
    return (
      <View style={styles.blocksContainer}>
        <Block flex>
          <Block row style={{ paddingTop: 25 }}>
            <Image source={Images.ProfilePicture} style={{ borderRadius: 25, height: 60, width: 60, marginHorizontal: 25 }} />
            <Block flex>
              <Text style={styles.nameTitle}>{this.state.tayderName}</Text>
              <Block row style={{ paddingTop: 10, justifyContent: "space-between" }}>
                <Text style={[styles.statusText, this.state.isOnline ? styles.statusOnline : styles.statusOffline]}>{this.state.statusText}</Text>
                <Switch
                  value={this.state.isOnline}
                  style={{ marginRight: 20, marginTop: -10 }}
                  onValueChange={this._changeStatus}
                />
              </Block>
            </Block>
          </Block>

          <Block middle style={{ paddingVertical: 25 }}>
            {
              this.state.hasAcceptButton && this.state.isFirstLogin ? (
                <Carousel
                  layout={"default"}
                  data={this.state.carouselIntroItems}
                  sliderWidth={width}
                  itemWidth={300}
                  renderItem={this._renderItem}
                  enableSnap
                  onSnapToItem={this.onSnapToItem}
                />
              ) : (
                <ServiceCardSliderTayder items={this.state.services} {...this.props} />
              )
            }
          </Block>
        </Block>
      </View>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        <StatusBar barStyle="light-content" />

        {this.renderBlocks()}

        {
          this.state.hasAcceptButton && this.state.isFirstLogin ? (
            <Block style={{ width: '100%', justifyContent: 'center', alignItems: 'center', paddingBottom: 20 }}>
              {
                this.state.activeIndex == 7 && (
                  <Button
                    round
                    loading={this.state.isLoading}
                    disabled={this.state.isLoading}
                    color={nowTheme.COLORS.BASE}
                    style={styles.button}
                    onPress={() => this._updateFirstLogin()}>
                    <Text style={{ fontFamily: 'trueno-semibold', color: nowTheme.COLORS.WHITE, }} size={14}>
                      EMPEZAR
                    </Text>
                  </Button>
                )
              }
            </Block>
          ) : (
            <TabBarTayder {...this.props} activeScreen="home" />
          )
        }
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
  statusText: {
    fontFamily: 'trueno',
    fontSize: 14,
    lineHeight: 15,
    color: '#36c550',
  },
  statusOnline: {
    color: '#36c550',
  },
  statusOffline: {
    color: '#C4C4C4',
  },
  blocksContainer: {
    width: width - theme.SIZES.BASE * 2,
    flex: 1,
    paddingVertical: theme.SIZES.BASE,
    paddingHorizontal: 2,
  },
  button: {
    width: width * 0.4,
    height: theme.SIZES.BASE * 2.5,
    shadowRadius: 0,
    shadowOpacity: 0
  },

  cardContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 10,

    backgroundColor: nowTheme.COLORS.WHITE,
    borderRadius: 25,
    width: '90%',
    height: smallScreen ? 480 : 600,
  },
  title: {
    fontFamily: 'trueno',
    fontSize: 35,
    lineHeight: 33,
    textAlign: 'center',
    color: nowTheme.COLORS.BASE
  },
  subtitle: {
    fontFamily: 'trueno-light',
    fontSize: 14,
    lineHeight: 16,
    textAlign: 'center',
    color: nowTheme.COLORS.SECONDARY,

    paddingTop: 20,
  }
});
