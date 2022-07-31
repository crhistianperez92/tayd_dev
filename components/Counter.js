import React from "react";
import { View, TouchableOpacity, StyleSheet, } from 'react-native';
import PropTypes from 'prop-types';
import { nowTheme } from '../constants/';
import { Text } from 'galio-framework'

export default class Counter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      value: this.props.value || 0,
      label: this.props.label || 'component',
    };
  }

  _onPress(type) {
    let _total = 0;
    switch (type) {
      case "subtract":
        if (this.state.value > 0) {
          _total = this.state.value - 1;
        }

        break;

      case "add":
        _total = this.state.value + 1
        break;
    }

    this.setState({ value: _total });
    this.props.updateValue(_total, this.state.label);
  }

  render() {
    const { value } = this.state;
    return (
      <View style={[styles.container, this.state.value > 0 ? styles.enabledContainer : styles.disabledContainer]}>
        <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => this._onPress("subtract")}>
          <View style={styles.itemContainer}>
            <View>
              <Text style={[styles.label, this.state.value > 0 ? styles.labelEnabled : styles.labelDisabled]}> - </Text>
            </View>
          </View>
        </TouchableOpacity>

        <View style={styles.itemContainer}>
          <View>
            <Text style={[styles.label, this.state.value > 0 ? styles.labelEnabled : styles.labelDisabled]}>{value}</Text>
          </View>
        </View>

        <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => this._onPress("add")}>
          <View style={styles.itemContainer}>
            <View>
              <Text style={[styles.label, this.state.value > 0 ? styles.labelEnabled : styles.labelDisabled]}> + </Text>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

Counter.propTypes = {
  value: PropTypes.number,
  key: PropTypes.string,
};

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignContent: 'center',
    flexDirection: 'row',
    borderWidth: 2,
    borderRadius: 25,
    width: 100,
  },
  enabledContainer: {
    borderColor: nowTheme.COLORS.BASE
  },
  disabledContainer: {
    borderColor: nowTheme.COLORS.PLACEHOLDER
  },

  itemContainer: {
    alignItems: 'center',
    padding: 5,
    flex: 1,
  },
  label: {
    fontFamily: 'trueno',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 17
  },
  labelEnabled: {
    color: nowTheme.COLORS.BASE,
  },
  labelDisabled: {
    color: nowTheme.COLORS.PLACEHOLDER,
  }
});
