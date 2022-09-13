import PropTypes from 'prop-types';
import React from 'react';
import {connect} from 'react-redux';
import bindAll from 'lodash.bindall';
import Modes from '../lib/modes';

import {changeMode} from '../reducers/modes';
import {clearHoveredItem, setHoveredItem} from '../reducers/hover';
import {clearSelectedItems, setSelectedItems} from '../reducers/selected-items';

import {getSelectedLeafItems} from '../helper/selection';
import {clearSelection} from '../helper/selection';
import {setCursor} from '../reducers/cursor';

import RoundedRectTool from '../helper/tools/rounded-rect-tool';
import RoundedRectModeComponent from '../components/rounded-rect-mode/rounded-rect-mode.jsx';

class RoundedRectMode extends React.Component {
    constructor (props) {
        super(props);
        bindAll(this, [
            'activateTool',
            'deactivateTool'
        ]);
    }
    componentDidMount () {
        if (this.props.isRoundedRectModeActive) {
            this.activateTool(this.props);
        }
    }
    UNSAFE_componentWillReceiveProps (nextProps) {
        if (this.tool && nextProps.hoveredItemId !== this.props.hoveredItemId) {
            this.tool.setPrevHoveredItemId(nextProps.hoveredItemId);
        }

        if (nextProps.isRoundedRectModeActive && !this.props.isRoundedRectModeActive) {
            this.activateTool();
        } else if (!nextProps.isRoundedRectModeActive && this.props.isRoundedRectModeActive) {
            this.deactivateTool();
        }
    }
    shouldComponentUpdate (nextProps) {
        return nextProps.isRoundedRectModeActive !== this.props.isRoundedRectModeActive;
    }
    componentWillUnmount () {
        if (this.tool) {
            this.deactivateTool();
        }
    }
    activateTool () {
        clearSelection(this.props.clearSelectedItems);

        this.tool = new RoundedRectTool(
            this.props.setSelectedItems,
            this.props.clearSelectedItems,
            this.props.setCursor,
            this.props.onUpdateImage
        );
        this.tool.setColorState(this.props.colorState);
        this.tool.activate();
    }
    deactivateTool () {
        this.tool.deactivateTool();
        this.tool.remove();
        this.tool = null;
    }
    render () {
        return (
            <RoundedRectModeComponent
                isSelected={this.props.isRoundedRectModeActive}
                onMouseDown={this.props.handleMouseDown}
            />
        );
    }
}

RoundedRectMode.propTypes = {
    clearHoveredItem: PropTypes.func.isRequired,
    clearSelectedItems: PropTypes.func.isRequired,
    handleMouseDown: PropTypes.func.isRequired,
    hoveredItemId: PropTypes.number,
    isRoundedRectModeActive: PropTypes.bool.isRequired,
    onUpdateImage: PropTypes.func.isRequired,
    setCursor: PropTypes.func.isRequired,
    setHoveredItem: PropTypes.func.isRequired,
    setSelectedItems: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
    colorState: state.scratchPaint.color,
    isRoundedRectModeActive: state.scratchPaint.mode === Modes.ROUNDED_RECT,
    hoveredItemId: state.scratchPaint.hoveredItemId
});
const mapDispatchToProps = dispatch => ({
    setHoveredItem: hoveredItemId => {
        dispatch(setHoveredItem(hoveredItemId));
    },
    clearHoveredItem: () => {
        dispatch(clearHoveredItem());
    },
    clearSelectedItems: () => {
        dispatch(clearSelectedItems());
    },
    setSelectedItems: () => {
        dispatch(setSelectedItems(getSelectedLeafItems(), false /* bitmapMode */));
    },
    handleMouseDown: () => {
        dispatch(changeMode(Modes.ROUNDED_RECT));
    },
    deactivateTool () {
    },
    setCursor: cursorString => {
        dispatch(setCursor(cursorString));
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(RoundedRectMode);
