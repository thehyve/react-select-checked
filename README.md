React-Select-Checked
====================

A React select based on [JedWatson/React-Select](http://jedwatson.github.io/react-select/) with checkmarks on selected options.

<img src="https://user-images.githubusercontent.com/2835281/32287328-bf65fdcc-bf30-11e7-980a-b297e1b8aa57.png" width="400">

## Installation

```javascript
npm install react-select-checked --save
```

At this point you can import react-select-checked in your application as follows:
```javascript
import CheckedSelect from 'react-select-checked';
```

## Usage

React-Select-Checked generates a hidden text field containing the selected value, so you can submit it as part of a standard form. You can also listen for changes with the `onChange` event property.

Options should be provided as an `Array` of `Object`s, each with a `value` and `label` property for rendering and searching. You can use a `disabled` property to indicate whether the option is disabled or not.

The `value` property of each option should be set to either a string or a number.

When the value is changed, `onChange(selectedValueOrValues)` will fire, allowing you to re-render with an updated `value=` prop.

```javascript
var CheckedSelect = require('react-select-checked');

var options = [
    {label: 'Chocolate', value: 'chocolate', disabled: true},
    {label: 'Vanilla', value: 'vanilla'},
    {label: 'Strawberry', value: 'strawberry'},
    {label: 'Caramel', value: 'caramel'},
];

var currentSelection = [{label: 'Caramel', value: 'caramel'}];

function logChange(val) {
  console.log('Selected value: ', val);
  setState({currentSelection: val});
}

<CheckedSelect
  name="form-field-name"
  value={currentSelection}
  options={options}
  onChange={logChange}
/>
```

### Async options

If you want to load options asynchronously, set `async` attribute to `true` and  instead of providing an `options` Array, 
provide a `loadOptions` Function.
The function takes two arguments `String input, Function callback` and will be called when the input text is changed.

When your async process finishes getting the options, pass them to `callback(err, data) in a Object { options: [] }`.

```javascript
function logChange(val) {
  console.log('Selected value: ', val);
  setState({value: val});
}

function getOptions (input, callback) {
    setTimeout(function() {
        callback(null, {
            options: [
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two' }
            ],
            // CAREFUL! Only set this to true when there are no more options,
            // or more specific queries will not be sent to the server.
            complete: true
        });
    }, 1000);
}

<CheckedSelect
    async
    loadOptions={getOptions}
    onChange={logChange}
    placeholder="Select your favourite(s)"
    value={value}
/>
```

### Async options with Promises

loadOptions supports Promises, which can be used in very much the same way as callbacks.

```javascript
function logChange(val) {
  console.log('Selected value: ', val);
  setState({value: val});
}

function getGitHubUsers(input) {
    return fetch(
        'https://api.github.com/search/repositories?q=stars:%3E1+language:javascript&sort=stars&order=desc&type=Repositories'
    ).then(
        response => {
           return response.json();
        }).then(json => {
            let githubUsers = json.items.map(user => {
                return {
                    label: user.full_name,
                    value: user.name
                };
            });
            return { options: githubUsers };
        });
}

<CheckedSelect
    async
    loadOptions={getGitHubUsers}
    onChange={logChange}
    placeholder="Select your favourite(s)"
    value={value}
/>
```
## Further options

| Property | Type | Default | Description |
|:---|:---|:---|:---|
| addAllTitle | string | 'Add all' | text to display in the `Add all` button |
| async | bool | false | if this property is specified then a `loadOptions` method should also be used. |
| clearAllTitle | string | 'Clear' | text to display in the `Clear` button |
| disabled | bool | false | whether the CheckedSelect is disabled or not |
| ignoreAccents | bool | true | whether to strip accents when filtering |
| ignoreCase | bool | true | whether to perform case-insensitive filtering |
| loadOptions | func | undefined | unction that returns a promise or calls a callback with the options: `function(input, [callback])` |
| name | string | undefined | field name, for hidden `<input />` tag |
| onChange | func | undefined | onChange handler: `function(newOption) {}` |
| options | array | undefined | array of options |
| placeholder | string\|node | 'Please select ..' | field placeholder, displayed when there's no value |
