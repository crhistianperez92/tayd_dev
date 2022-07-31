import React from 'react';
import { withNavigation } from '@react-navigation/compat';
import PropTypes from 'prop-types';
import { StyleSheet, Image, TouchableWithoutFeedback, View } from 'react-native';
import { Block, Text, theme } from 'galio-framework';

import { nowTheme } from '../constants';

class Card extends React.Component {
  render() {
    const {
      navigation,
      horizontal,
      full,
      style,
      image,
      imageStyle,
      title,
      titleStyle,
      subtitle,
      description
    } = this.props;

    const imageStyles = [full ? styles.fullImage : styles.horizontalImage, imageStyle];
    const titleStyles = [styles.cardTitle, titleStyle];
    const cardContainer = [styles.card, styles.shadow, style];
    const imgContainer = [styles.imageContainer, horizontal ? styles.horizontalStyles : styles.verticalStyles, styles.shadow];

    return (
      <Block row={horizontal} card flex style={cardContainer}>
        <TouchableWithoutFeedback onPress={() => { }}>
          <View>
            <Block flex style={imgContainer}>
              <Image resizeMode="cover" source={image} style={imageStyles} />
            </Block>
            <Block flex space="between" style={styles.cardDescription}>
              <Block flex>
                <Text style={titleStyles} color={nowTheme.COLORS.SECONDARY}>
                  {title}
                </Text>

                {subtitle ? (
                  <Block flex>
                    <Text style={styles.subtitle} color={nowTheme.COLORS.SECONDARY}>
                      {subtitle}
                    </Text>
                  </Block>
                ) : (
                  <Block />
                )}
              </Block>
            </Block>
          </View>
        </TouchableWithoutFeedback>
      </Block>
    );
  }
}

Card.propTypes = {
  item: PropTypes.object,
  horizontal: PropTypes.bool,
  full: PropTypes.bool,
  ctaColor: PropTypes.string,
  imageStyle: PropTypes.any,
  ctaRight: PropTypes.bool,
  titleStyle: PropTypes.any,
  textBodyStyle: PropTypes.any
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.COLORS.WHITE,
    marginVertical: theme.SIZES.BASE,
    borderWidth: 0,
    minHeight: 114,
    marginBottom: 4,
    borderRadius: 50
  },
  cardTitle: {
    fontFamily: 'trueno-extrabold',
    fontSize: 15,
    color: nowTheme.COLORS.SECONDARY,

    justifyContent: 'center',
    alignSelf: 'center',
    paddingHorizontal: 10,
    paddingTop: 7,
  },
  cardDescription: {
    padding: theme.SIZES.BASE / 2
  },
  imageContainer: {
    borderRadius: 50,
    elevation: 1,
    overflow: 'hidden'
  },
  image: {
    // borderRadius: 3,
  },
  horizontalImage: {
    height: 122,
    width: 'auto'
  },
  horizontalStyles: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0
  },
  verticalStyles: {
    borderBottomRightRadius: 0,
    borderBottomLeftRadius: 0
  },
  fullImage: {
    height: 220,
    width: '100%'
  },
  shadow: {
    shadowColor: '#8898AA',
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 6,
    shadowOpacity: 0.1,
    elevation: 2
  },
  articleButton: {
    fontFamily: 'montserrat-bold',
    paddingHorizontal: 9,
    paddingVertical: 7
  },

  subtitle: {
    fontFamily: 'trueno',
    fontSize: 9,
    color: nowTheme.COLORS.SECONDARY,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignSelf: 'center',
  },
});

export default withNavigation(Card);
