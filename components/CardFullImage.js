import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback, Alert } from 'react-native';
import { Block, theme } from 'galio-framework';

class CardFullImage extends React.Component {

  _navigate = (value, navigation) => {
    switch (value) {
      case 1: navigation.navigate('Agenda'); break;
      case 2: navigation.navigate('VehiculoFecha'); break;
    }
  }

  render() {
    const {
      navigation,
      horizontal,
      full,
      style,
      image,
      imageStyle,
      position
    } = this.props;

    const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer, styles.verticalStyles];

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback onPress={() => this._navigate(position, navigation)} style={{ zIndex: -1 }}>
          <Block>
            <Block flex style={imgContainer}>
              <Image resizeMode="cover" source={image} style={imageStyles} />
            </Block>
          </Block>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

CardFullImage.propTypes = {
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  text: PropTypes.string,
  imageStyle: PropTypes.any,
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE - 10,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 4,
    borderRadius: 22
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 22,
    elevation: 1,
    overflow: 'hidden',
  },
  verticalStyles: {
    borderBottomRightRadius: 22,
    borderBottomLeftRadius: 22
  },
  fullImage: {
    width: '100%',
  },
  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  },
});

export default withNavigation(CardFullImage);
