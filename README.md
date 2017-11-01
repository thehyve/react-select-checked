React-Select-Checked
====================

A React select based on [JedWatson/React-Select](http://jedwatson.github.io/react-select/) with checkmarks on selected options.


## Installation

```javascript
npm install react-select-checked --save
```

At this point you can import react-select-checked in your application as follows:
```javascript
import Select from 'react-select-checked';
```

## Usage

React-Select-Checked generates a hidden text field containing the selected value, so you can submit it as part of a standard form. You can also listen for changes with the `onChange` event property.

Options should be provided as an `Array` of `Object`s, each with a `value` and `label` property for rendering and searching. You can use a `disabled` property to indicate whether the option is disabled or not.

The `value` property of each option should be set to either a string or a number.

When the value is changed, `onChange(selectedValueOrValues)` will fire.

```javascript
var Select = require('react-select-checked');

var options = [
  { value: 'one', label: 'One' },
  { value: 'two', label: 'Two' }
];

function logChange(val) {
  console.log('Selected: ', val);
}

<CheckedSelect
  name="form-field-name"
  value="one"
  options={options}
  onChange={logChange}
/>
```

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| addAllTitle | string | 'Add all' | text to display when `allowCreate` is true |
| clearAllTitle | string | 'Clear' | text to display when `allowCreate` is true |
| disabled | bool | 'Add "{label}"?' | text to display when `allowCreate` is true |
| ignoreAccents | bool | true | whether to strip accents when filtering |
| ignoreCase | bool | true | whether to perform case-insensitive filtering |
| label | string | '' | text to display when `allowCreate` is true |
| onChange | func | undefined | onChange handler: `function(newOption) {}` |
| options | array | undefined | array of options |
| placeholder | string\|node | 'Please select ..' | field placeholder, displayed when there's no value |
