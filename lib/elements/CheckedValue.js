/**
 * Copyright (c) 2017 The Hyve B.V.
 * This code is licensed under the GNU General Public License,
 * version 3, or (at your option) any later version.
 */

import React from 'react';
import PropTypes from 'prop-types';

class CheckedValue extends React.Component {
    render() {
        // render the first value as the placeholder would have appeared,
        // display nothing for subsequent values
        return (this.props.children[0] === 0
            ? <div className="Select-placeholder">{this.props.placeholder}</div>
            : null
        );
    }
}

CheckedValue.propTypes = {
    children: PropTypes.array.isRequired,      // starts with the index of this value, from valueRenderer
    placeholder: PropTypes.string.isRequired   // field placeholder passed to ReactSelect
};

export default CheckedValue;
