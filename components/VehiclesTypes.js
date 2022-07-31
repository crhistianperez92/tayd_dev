import React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { Text } from 'galio-framework'
import VehicleTypeService from '../services/vehicleType';

const icons = [
    require('../assets/icons/compact_r.jpg'),
    require('../assets/icons/suv_r.jpg'),
    require('../assets/icons/minivan_r.jpg'),
    require('../assets/icons/pickup1_r.jpg'),
    require('../assets/icons/pickup2_r.jpg'),
];

const iconsDisabled = [
    require('../assets/icons/compact.jpg'),
    require('../assets/icons/suv.jpg'),
    require('../assets/icons/minivan.jpg'),
    require('../assets/icons/pickup1.jpg'),
    require('../assets/icons/pickup2.jpg'),
];

export default class VehicleType extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            vehicleTypes: [],
            newValue: this.props.value,
        };
    }

    async componentDidMount() {
        await VehicleTypeService.getAll()
            .then(response => {
                this.setState({ vehicleTypes: response.vehiclesTypes });
            })
            .catch(error => {
                console.error(error);
                alert('Ocurrió un error al generar los tipos de vehículos.');
            })
    }

    _onPress(_id, prices) {
        this.setState({ newValue: _id });
        this.props.updateValue(_id, prices);
    }

    render() {
        const { vehicleTypes, newValue } = this.state;
        return (
            <View style={styles.container}>
                {
                    vehicleTypes.map((value) => {
                        return (
                            <TouchableOpacity style={{ backgroundColor: 'transparent' }} key={value.id} onPress={() => this._onPress(value.id, value.prices)}>
                                <View style={styles.checkboxContainer}>
                                    {
                                        (newValue == value.id)
                                            ? (
                                                <Image source={icons[value.id - 1]} style={{ width: 85, height: 50, borderRadius: 15 }} />
                                            )
                                            : (
                                                <Image source={iconsDisabled[value.id - 1]} style={{ width: 85, height: 50, borderRadius: 15 }} />
                                            )
                                    }
                                    <View style={{ marginLeft: 5, paddingTop: 10, flexDirection: 'row' }}>
                                        <Text style={styles.label}>{value.name}</Text>
                                    </View>
                                </View>
                            </TouchableOpacity>
                        )
                    })
                }
            </View>
        );
    }
}

VehicleType.propTypes = {
    newValue: PropTypes.number,
    label: PropTypes.string,
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        alignItems: 'center'
    },
    checkboxContainer: {
        alignItems: 'center',
        padding: 6,
    },
    label: {
        fontFamily: 'trueno',
        textAlign: 'center',
        fontWeight: '400',
        color: '#444444',
        fontSize: 16,
    }
});
