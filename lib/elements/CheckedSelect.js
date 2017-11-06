/**
 * Copyright (c) 2017 The Hyve B.V.
 * This code is licensed under the GNU General Public License,
 * version 3, or (at your option) any later version.
 */

import React from 'react';
import PropTypes from 'prop-types'
import createClass from 'create-react-class';
import Select from "react-select";
import classNames from 'classnames';
import CheckedOption from './CheckedOption';
import CheckedValue from './CheckedValue';
import OptionTools from './OptionTools';
import stripDiacritics from './stripDiacritics';

import 'react-select/dist/react-select.css';

const CheckedSelect = createClass({
    displayName: 'CheckedSelect',

    // constructor
    getInitialState () {
        let isOptionsChanged = this.props.isOptionsChanged;
        let options = this.props.options;
        let val =  this.filterValueByOptions(this.props.value, this.props.options);
        return {
            isOptionsChanged: isOptionsChanged,
            options: options,
            value: val,
        };
    },

    componentWillReceiveProps(nextProps) {
        if (nextProps.isOptionsChanged) {
            this.setState({ isOptionsChanged: nextProps.isOptionsChanged})
        }
    },

    componentWillUpdate(nextProps, nextState) {
        if (this.props.onOptionsChange && nextState.isOptionsChanged) {
            console.log('componentWillUpdate', [nextProps, nextState]);
            // normalize isOptionsChanged
            this.setState({ isOptionsChanged: false});
            // trigger callback
            this.props.onOptionsChange(this.props.options, nextProps.options);
        }
    },

    filterValueByOptions(val, options) {
        // TODO: what if the option of an assigned value is disabled or not existing in the options? Should we still
        // keep it or remove it?
        return val;
    },

    markSelectedOptions (options, filterValue, currentValue) {

        if (this.props.value.length) {
            currentValue = this.props.value;
        }

        if (this.props.ignoreAccents) {
            filterValue = stripDiacritics(filterValue);
        }

        if (this.props.ignoreCase) {
            filterValue = filterValue.toLowerCase();
        }

        if (currentValue) currentValue = currentValue.map(i => i[this.props.valueKey]);

        this._visibleOptions = options.filter(option => {

            // mark as selected when options are selected
            if (currentValue && currentValue.indexOf(option[this.props.valueKey]) > -1) {
                option.isSelected = !option.disabled; // only select enabled options
            }

            if (!filterValue) return true;
            let valueTest = String(option[this.props.valueKey]);
            let labelTest = String(option[this.props.labelKey]);
            if (this.props.ignoreAccents) {
                if (this.props.matchProp !== 'label') valueTest = stripDiacritics(valueTest);
                if (this.props.matchProp !== 'value') labelTest = stripDiacritics(labelTest);
            }
            if (this.props.ignoreCase) {
                if (this.props.matchProp !== 'label') valueTest = valueTest.toLowerCase();
                if (this.props.matchProp !== 'value') labelTest = labelTest.toLowerCase();
            }
            return this.props.matchPos === 'start' ? (
                (this.props.matchProp !== 'label' && valueTest.substr(0, filterValue.length) === filterValue) ||
                (this.props.matchProp !== 'value' && labelTest.substr(0, filterValue.length) === filterValue)
            ) : (
                (this.props.matchProp !== 'label' && valueTest.indexOf(filterValue) >= 0) ||
                (this.props.matchProp !== 'value' && labelTest.indexOf(filterValue) >= 0)
            );
        });
        return this._visibleOptions;
    },

    toggleSelection (selectedValue) {
        // get last item selected
        let currentValue = this.state.value;

        // check if current state value already contain new item
        let foundDuplicate = currentValue.find(elem => {
            return elem.value === selectedValue[0].value;
        });

        // remove item if it exists
        if (foundDuplicate) {
            currentValue = currentValue.filter( val => {
                return foundDuplicate.value !== val.value;
            });

            // remove isSelected marker on the option
            this.props.options.map( option => {
                if (foundDuplicate.value === option.value) {
                    option.isSelected = false;
                }
                return option;
            });
        } else {
            currentValue = currentValue.concat(selectedValue);
        }

        if (this.props.onChange) {
            this.props.onChange(currentValue);
        }
        this.setState({ value: currentValue });
    },

    renderClearButton () {
        return null;
    },

    clearIsSelectedFlags() {
        let visibleOptions = this._visibleOptions;
        // deselect only visible options
        this.props.options.map( option => {
            if (visibleOptions.indexOf(option) > -1) {
                option.isSelected = false;
            }
            return option;
        });
    },

    clearVisibleOptions() {
        let visibleOptions = this._visibleOptions;
        let values = this.state.value;
        // remove only visible values
        visibleOptions.map( visibleOption => {
            const index = values.indexOf(visibleOption);
            if (index !== -1) {
                values.splice(index, 1);
            }
        });
        return values
    },

    getResetValue () {
        if (this.props.resetValue !== undefined) {
            return this.props.resetValue;
        } else if (this.props.multi) {
            return [];
        } else {
            return null;
        }
    },

    setValue (value) {
        if (this.props.onChange) {
            if (this.props.simpleValue && value) {
                value = this.props.multi ?
                    value.map(i => i[this.props.valueKey]).join(this.props.delimiter) : value[this.props.valueKey];
            }
            this.props.onChange(value);
        }
    },

    handleAddAll () {
        // only add enabled options
        let newValue = this._visibleOptions.filter( visibleOption => {
            return visibleOption.disabled !== true;
        });
        this.setValue(newValue);
        this.setState({ value: newValue });
    },

    handleClearAll () {
        this.clearIsSelectedFlags();
        let newValue = this.clearVisibleOptions();
        this.setValue(newValue);
        this.setState({ value: newValue });
    },

    renderMenu (params) {
        return params.options.map((option, i) => {
            let isSelected = params.valueArray && params.valueArray.indexOf(option) > -1;
            let isFocused = option === params.focusedOption;
            let optionClass = classNames(params.optionClassName, {
                'Select-option': true,
                'is-selected': isSelected,
                'is-focused': isFocused,
                'is-disabled': option.disabled,
            });
            if (i === 0 ) {
                return (
                    <div key={`option-${i}-${option[params.valueKey]}`}>
                        <OptionTools
                            onAddAll={this.handleAddAll}
                            onClearAll={this.handleClearAll}
                            addAllTitle={this.props.addAllTitle}
                            clearAllTitle={this.props.clearAllTitle}
                        />
                        <CheckedOption
                            className={optionClass}
                            option={option}
                            onFocus={params.onFocus}
                            onSelect={params.onSelect}
                            children={params.children}
                        />
                    </div>
                );
            }
            return (
                <div key={`option-${i}-${option[params.valueKey]}`}>
                    <CheckedOption
                        className={optionClass}
                        option={option}
                        onFocus={params.onFocus}
                        onSelect={params.onSelect}
                        children={params.children}
                    />
                </div>
            );
        });
    },

    render() {
        const { value } = this.state.value;
        const { options } = this.state.options;
        console.log('   about to render')
        return (
            <div className="section">
                <h3 className="section-heading">{this.props.label}</h3>
                <Select
                    onChange={this.toggleSelection}
                    clearRenderer={this.renderClearButton}
                    closeOnSelect={false}
                    disabled={this.props.disabled}
                    multi
                    menuRenderer={this.renderMenu}
                    optionComponent={CheckedOption}
                    options={this.props.options}
                    valueComponent={CheckedValue}
                    filterOptions={this.markSelectedOptions}
                    placeholder={this.props.placeholder}
                    value={value}
                />
            </div>
        );
    }
});

CheckedSelect.propTypes = {
    addAllTitle: PropTypes.string,
    clearAllTitle: PropTypes.string,
    disabled: PropTypes.bool,
    ignoreAccents: PropTypes.bool,
    ignoreCase: PropTypes.bool,
    isOptionsChanged: PropTypes.bool,
    label: PropTypes.string,
    matchPos: PropTypes.string,
    matchProp: PropTypes.string,
    onChange: PropTypes.func,
    options: PropTypes.array,
    onOptionsChange: PropTypes.func,
    placeholder: PropTypes.string,
    value: PropTypes.any,
    valueKey: PropTypes.string,
};

CheckedSelect.defaultProps = {
    addAllTitle: 'Add all',
    clearAllTitle: 'Clear',
    disabled: false,
    ignoreAccents: true,
    ignoreCase: true,
    label: '',
    matchPos: 'any',
    matchProp: 'any',
    valueKey: 'value',
    options: [],
    placeholder: 'Please select ..',
};


module.exports = CheckedSelect;
