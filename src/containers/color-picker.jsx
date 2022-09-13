import bindAll from 'lodash.bindall';
import {connect} from 'react-redux';
import paper from '@scratch/paper';
import ColorProptype from '../lib/color-proptype';
import PropTypes from 'prop-types';
import React from 'react';

import {changeStrokeColorIndex} from '../reducers/stroke-style';
import {changeFillColorIndex} from '../reducers/fill-style';
import {clearSelectedItems} from '../reducers/selected-items';
import GradientTypes from '../lib/gradient-types';

import ColorPickerComponent from '../components/color-picker/color-picker.jsx';
import {colorsEqual} from '../helper/style-path';
import Modes from '../lib/modes';
import {getHsv} from '../lib/colors';

class ColorPicker extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'handleChangeGradientTypeHorizontal',
            'handleChangeGradientTypeRadial',
            'handleChangeGradientTypeSolid',
            'handleChangeGradientTypeVertical',
            'handleHueChange',
            'handleSaturationChange',
            'handleBrightnessChange',
            'handleAlphaChange',
            'handleHexChange'
        ]);

        const color = props.colorIndex === 0 ? props.color : props.color2;
        const hsv = getHsv(color);
        this.state = {
            hue: hsv[0],
            saturation: hsv[1],
            brightness: hsv[2],
            alpha: hsv[3],
            hex: (color !== null && color !== 'scratch-paint/style-path/mixed') ? color.toCSS(true) : '#000000'
        };
    }
    UNSAFE_componentWillReceiveProps (newProps) {
        const color = newProps.colorIndex === 0 ? this.props.color : this.props.color2;
        const newColor = newProps.colorIndex === 0 ? newProps.color : newProps.color2;
        if (!colorsEqual(color, newColor)) {
            const hsv = getHsv(newColor);
            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2],
                alpha: hsv[3],
                hex: this.state.hex
            });
        }
    }
    handleHueChange (hue) {
        this.setState({hue: hue}, () => {
            this.handleColorChange();
        });
    }
    handleSaturationChange (saturation) {
        this.setState({saturation: saturation}, () => {
            this.handleColorChange();
        });
    }
    handleBrightnessChange (brightness) {
        this.setState({brightness: brightness}, () => {
            this.handleColorChange();
        });
    }
    handleAlphaChange (alpha) {
        this.setState({alpha: alpha / 100}, () => {
            if (this.state.alpha === 0) {
                this.props.onChangeColor(null);
            } else {
                this.handleColorChange();
            }
        });
    }
    handleColorChange () {
        let color = new paper.Color({
            hue: this.state.hue * (360 / 100),
            saturation: this.state.saturation / 100,
            brightness: this.state.brightness / 100,
            alpha: this.state.alpha
        });
        this.props.onChangeColor(color)
        this.setState({
            hex: (color !== null && color !== 'scratch-paint/style-path/mixed') ? color.toCSS(true) : '#000000'
        })
    }
    handleHexChange (hex) {
        if (hex !== this.state.hex) {
            const color = new paper.Color(hex);
            const hsv = getHsv(color);
            this.setState({
                hue: hsv[0],
                saturation: hsv[1],
                brightness: hsv[2],
                alpha: this.state.alpha,
                hex: (color !== null && color !== 'scratch-paint/style-path/mixed') ? color.toCSS(true) : '#000000'
            }, () => {
                this.handleColorChange();
            })
        } else if (hex === '') {
            this.setState({
                hex: hex
            });
        }
    }
    handleChangeGradientTypeHorizontal () {
        this.props.onChangeGradientType(GradientTypes.HORIZONTAL);
    }
    handleChangeGradientTypeRadial () {
        this.props.onChangeGradientType(GradientTypes.RADIAL);
    }
    handleChangeGradientTypeSolid () {
        this.props.onChangeGradientType(GradientTypes.SOLID);
    }
    handleChangeGradientTypeVertical () {
        this.props.onChangeGradientType(GradientTypes.VERTICAL);
    }
    render () {
        return (
            <ColorPickerComponent
                brightness={this.state.brightness}
                hue={this.state.hue}
                saturation={this.state.saturation}
                alpha={this.state.alpha * 100}
                hex={this.state.hex}
                color={this.props.color}
                color2={this.props.color2}
                colorIndex={this.props.colorIndex}
                gradientType={this.props.gradientType}
                isStrokeColor={this.props.isStrokeColor}
                mode={this.props.mode}
                rtl={this.props.rtl}
                shouldShowGradientTools={this.props.shouldShowGradientTools}
                onAlphaChange={this.handleAlphaChange}
                onHexChange={this.handleHexChange}
                onBrightnessChange={this.handleBrightnessChange}
                onChangeColor={this.props.onChangeColor}
                onChangeGradientTypeHorizontal={this.handleChangeGradientTypeHorizontal}
                onChangeGradientTypeRadial={this.handleChangeGradientTypeRadial}
                onChangeGradientTypeSolid={this.handleChangeGradientTypeSolid}
                onChangeGradientTypeVertical={this.handleChangeGradientTypeVertical}
                onHueChange={this.handleHueChange}
                onSaturationChange={this.handleSaturationChange}
                onSelectColor={this.props.onSelectColor}
                onSelectColor2={this.props.onSelectColor2}
                onSwap={this.props.onSwap}
            />
        );
    }
}

ColorPicker.propTypes = {
    color: ColorProptype,
    color2: ColorProptype,
    colorIndex: PropTypes.number.isRequired,
    gradientType: PropTypes.oneOf(Object.keys(GradientTypes)).isRequired,
    isStrokeColor: PropTypes.bool.isRequired,
    mode: PropTypes.oneOf(Object.keys(Modes)),
    onChangeColor: PropTypes.func.isRequired,
    onChangeGradientType: PropTypes.func,
    onSelectColor: PropTypes.func.isRequired,
    onSelectColor2: PropTypes.func.isRequired,
    onSwap: PropTypes.func,
    rtl: PropTypes.bool.isRequired,
    shouldShowGradientTools: PropTypes.bool.isRequired
};

const mapStateToProps = (state, ownProps) => ({
    color: ownProps.isStrokeColor ?
        state.scratchPaint.color.strokeColor.primary :
        state.scratchPaint.color.fillColor.primary,
    color2: ownProps.isStrokeColor ?
        state.scratchPaint.color.strokeColor.secondary :
        state.scratchPaint.color.fillColor.secondary,
    colorIndex: ownProps.isStrokeColor ?
        state.scratchPaint.color.strokeColor.activeIndex :
        state.scratchPaint.color.fillColor.activeIndex,
    mode: state.scratchPaint.mode,
    rtl: state.scratchPaint.layout.rtl
});

const mapDispatchToProps = (dispatch, ownProps) => ({
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    onSelectColor: () => {
        if (ownProps.isStrokeColor) {
            dispatch(changeStrokeColorIndex(0));
        } else {
            dispatch(changeFillColorIndex(0));
        }
    },
    onSelectColor2: () => {
        if (ownProps.isStrokeColor) {
            dispatch(changeStrokeColorIndex(1));
        } else {
            dispatch(changeFillColorIndex(1));
        }
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ColorPicker);
