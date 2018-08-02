import React from 'react';
import {
    View,
    TouchableOpacity,
    Text,
    Keyboard,
    Animated,
    StyleSheet,
    LayoutAnimation,
    Dimensions,
    Platform
} from 'react-native';
import PropTypes from 'prop-types';

let { width, height } = Dimensions.get('window');

class DoneBar extends React.Component {
    static propTypes = {
        borderColor: PropTypes.string,
        backgroundColor: PropTypes.color,
        keyboardType: PropTypes.string,
        includeLayoutAnimation: PropTypes.bool,
        text: PropTypes.string,
        onDone: PropTypes.func,
    };

    static defaultProps = {
        keyboardType: 'numeric',
        includeLayoutAnimation: true,
        text: 'Done',
        onDone: () => {},
        borderColor: null,
        backgroundColor: '#D3D5DB',
    };

    state = {
        height: 0,
        width: width,
        bottom: -81
    };

    styles = StyleSheet.create({
        barWrapper: {
            // borderTopWidth: 1,
            backgroundColor: '#D3D5DB',
            // borderColor: '#E5E5E5',
            position: 'absolute',
            alignSelf: 'stretch',
            left: 0,
            right: 0,
        },
        bar: {
            height: 40,
            alignItems: 'flex-end'
        },
        button: {
            flex: 1,
            justifyContent: 'center'
        },
        done: {
            fontSize: 21,
            color: '#218BFE',
            fontWeight: '500',
            margin: 10
        }
    });

    componentWillMount(props) {
        const config = {
            duration: 250,
            update: {
                duration: 250,
                type: LayoutAnimation.Types.keyboard
            }
        };

        if (props.borderColor) {
            this.styles.barWrapper.borderTopWidth = 1;
            this.styles.barWrapper.borderColor = props.borderColor;
        }
        if (props.backgroundColor) {
            this.styles.barWrapper.backgroundColor = props.backgroundColor;
        }

        this.keyboardWillChangeFrameListener = Keyboard.addListener('keyboardWillChangeFrame', ({ endCoordinates }) => {
            let { screenY } = endCoordinates;

            if (screenY === height || this.props.keyboardType !== 'numeric') {
                bottom = -81;
            } else {
                bottom = endCoordinates.height - 40;
            }

            this.props.includeLayoutAnimation ? LayoutAnimation.configureNext(config) : null;
            this.setState({
                bottom,
                width: endCoordinates.width
            });
        });
    }

    render() {
        if (Platform.OS !== 'ios') {
            return null;
        }

        let { bottom, width } = this.state;

        return (
            <View style={[{ bottom, width }, this.styles.barWrapper]}>
                <View
                    style={this.styles.bar}
                >
                    <TouchableOpacity
                        style={this.styles.button}
                        onPress={() => {
                            Keyboard.dismiss();
                            this.props.onDone();
                        }}
                    >
                        <Text style={styles.done}>{this.props.text}</Text>
                    </TouchableOpacity>
                </View>
                <View style={this.styles.bar} />
            </View>
        );
    }

    componentWillUnmount() {
        this.keyboardWillChangeFrameListener.remove();
    }
}

export default DoneBar;
