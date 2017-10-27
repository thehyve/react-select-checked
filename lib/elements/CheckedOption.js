/**
 * Copyright (c) 2017 The Hyve B.V.
 * This code is licensed under the GNU General Public License,
 * version 3, or (at your option) any later version.
 */

import React from 'react';
import PropTypes from 'prop-types'
import createClass from 'create-react-class';
import classNames from 'classnames';

const CheckedOption = createClass({
    propTypes: {
        children: PropTypes.node,
        className: PropTypes.string,
        ignoreAccents: PropTypes.bool,
        ignoreCase: PropTypes.bool,
        isDisabled: PropTypes.bool,
        isFocused: PropTypes.bool,
        isSelected: PropTypes.bool,
        matchPos: PropTypes.string,
        matchProp: PropTypes.string,
        onFocus: PropTypes.func,
        onSelect: PropTypes.func,
        option: PropTypes.object.isRequired,
        valueKey: PropTypes.string,
    },
    blockEvent(event) {
        event.preventDefault();
        event.stopPropagation();
        if ((event.target.tagName !== 'A') || !('href' in event.target)) {
            return;
        }
        if (event.target.target) {
            window.open(event.target.href, event.target.target);
        } else {
            window.location.href = event.target.href;
        }
    },
    handleMouseDown(event) {
        console.log('handleMouseDown', this.props.option)
        event.preventDefault();
        event.stopPropagation();
        this.props.onSelect(this.props.option, event);
    },
    handleMouseEnter(event) {
        this.props.onFocus(this.props.option, event);
    },
    handleMouseMove(event) {
        if (this.props.isFocused) return;
        this.props.onFocus(this.props.option, event);
    },
    renderMarker() {
        // let marker = this.props.option.isSelected ? 'fa fa-check-square-o' : 'fa fa-square-o';  // FIXME USE SVG ICON
        let marker = this.props.option.isSelected ? '(x)' : '( )'; // FIXME TEMP SOLUTION
        return (
            <span><i aria-hidden="true">{marker}</i>&nbsp;</span>
            // <span><i className={marker} aria-hidden="true">&nbsp;</i>&nbsp;</span> // FIXME
        );
    },
    render() {
        let {option, instancePrefix, optionIndex} = this.props;
        let className = classNames(this.props.className, option.className);

        return option.disabled ? (
            <div className={className}
                 onMouseDown={this.blockEvent}
                 onClick={this.blockEvent}>
                {this.renderMarker()}
                {this.props.option.label}
            </div>
        ) : (
            <div className={className}
                 style={option.style}
                 role="option"
                 onMouseDown={this.handleMouseDown}
                 onMouseEnter={this.handleMouseEnter}
                 onMouseMove={this.handleMouseMove}
                 id={instancePrefix + '-option-' + optionIndex}
                 title={this.props.option.title}>
                {this.renderMarker()}
                {this.props.option.label}
            </div>
        );
    }
});

module.exports = CheckedOption;
