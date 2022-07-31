import React from "react";
import { StyleSheet, Dimensions, ScrollView, } from "react-native";
import { Block, theme, Text } from "galio-framework";

import { CardFullImage, TabBar, Icon } from "../components";
import { Images, nowTheme } from '../constants/';
import Actions from '../lib/actions';
import { iPhoneX } from "../constants/utils";

const { width } = Dimensions.get("screen");

class Home extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);
    this.state = {
      userData: null,
    };
  }

  async componentDidMount() {
    this._isMounted = true;
    await Actions.extractUserData().then((result) => {
      if (result != null && this._isMounted) {
        this.setState({ userData: result.user });
      }
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  renderBlocks = () => {
    let { userData } = this.state;

    return (
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.blocksContainer}>
        <Block flex>
          <Block flex row style={{ paddingTop: iPhoneX() ? 30 : 10 }}>
            <Icon
              name={'align-left-22x'}
              family="NowExtra"
              size={16}
              onPress={() => this.props.navigation.openDrawer()}
              color={nowTheme.COLORS.ICON}
              style={{ fontWeight: '700', marginRight: 15, paddingTop: 5 }}
            />
            <Block flex>
              <Text style={styles.nameTitle}>Bienvenido {userData?.info?.name}</Text>
              <Text>¿En qué podemos ayudarte?</Text>
            </Block>
          </Block>

          <CardFullImage position={1} image={Images.Inicio001} imageStyle={{ height: 300, width: '100%' }} />

          <CardFullImage position={2} image={Images.Inicio002} imageStyle={{ height: 300, width: '100%' }} />
        </Block>
      </ScrollView>
    );
  };

  render() {
    return (
      <Block flex center style={styles.home}>
        {this.renderBlocks()}

        <TabBar {...this.props} activeScreen="home" />
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

  }
});

export default Home;
