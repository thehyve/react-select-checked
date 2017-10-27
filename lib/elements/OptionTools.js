/**
 * Copyright (c) 2017 The Hyve B.V.
 * This code is licensed under the GNU General Public License,
 * version 3, or (at your option) any later version.
 */


import React from 'react';
import PropTypes from 'prop-types'
import createClass from 'create-react-class';

const OptionTools = createClass({
    propTypes: {
        onAddAll: PropTypes.func,
        onClearAll: PropTypes.func,
    },

    addAll(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onAddAll();
    },

    clearAll(event) {
        event.preventDefault();
        event.stopPropagation();
        this.props.onClearAll();
    },

    render () {
        let optionToolsStyles = {
            fontColor: 'inherit',
            textAlign:'center',
            padding: '1em',
            borderBottom: '1px solid #ccc'
        };
        let toolButtonStyle = {
            borderRadius: '0.3em',
            fontColor: 'inherit',
            backgroundColor: 'white',
            border: '1px solid #ccc',
            padding: '0.5em',
            textAlign: 'center',
            textDecoration: 'none',
            fontSize: 'smaller',
            cursor: 'pointer',
            marginLeft: '0.3em',
        };
        return (
            <div style={optionToolsStyles}>
                <button onClick={this.addAll} style={toolButtonStyle}> Select all</button>
                <button onClick={this.clearAll} style={toolButtonStyle}>Clear</button>
            </div>
        );
    }
});

module.exports = OptionTools;
