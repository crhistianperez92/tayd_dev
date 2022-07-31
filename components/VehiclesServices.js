import React from "react";
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Block, Text, theme } from 'galio-framework';
import { Images, nowTheme } from '../constants';

export default class VehicleService extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            label           : this.props.label,
            id              : this.props.id,
            key             : this.props.value,
            price           : this.props.price,
            selected        : false,
        };
    }

    componentDidMount() {
        this.setState({selected: false});
    }

    getImage = (key) => {
        let { selected } = this.state;
        switch(key) {
            case "LAVADO_ASPIRADO"      : return selected ?  Images.Icons.Lavado        : Images.Icons.Lavado_G;
            case "ENCERADO"             : return selected ?  Images.Icons.Encerado      : Images.Icons.Encerado_G;
            case "PULIDO"               : return selected ?  Images.Icons.Pulido        : Images.Icons.Pulido_G;
            case "LAVADO_VESTIDURAS"    : return selected ?  Images.Icons.Vestiduras    : Images.Icons.Vestiduras_G;
        }
    }

    updateValue = () => {
        let value = !this.state.selected;
        this.setState({selected: value});

        this.props.getValues(value, {
            id          : this.state.id,
            label       : this.state.label,
            key         : this.state.key,
            price       : this.state.price,
            selected    : value
        });
    }

    render() {
        return (
            <Block style={{ marginTop: theme.SIZES.BASE * 0.8}}>
                <TouchableOpacity style={{ backgroundColor: 'transparent' }} onPress={() => this.updateValue()}>
                    <View style={styles.itemContainer}>
                        <Image style={styles.icons} source={this.getImage(this.state.key)} />
                        <Text style={styles.labels} color={nowTheme.COLORS.PLACEHOLDER}>{this.state.label}</Text>
                    </View>
                </TouchableOpacity>
            </Block>
        )
    }
}

const styles = StyleSheet.create({
    itemContainer: {
        flexDirection: 'row',
        alignContent: 'center',
        justifyContent: 'center',
        alignItems: 'baseline'
    },
    icons: {
        marginRight: 20,
        width: 25,
        height: 25,
    },
    labels: {
        fontFamily: 'trueno-semibold',
        fontSize: 16,
        width: 150,
        marginRight: 20,
    },
})