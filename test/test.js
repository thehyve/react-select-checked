/* eslint-env mocha */
import { CheckedSelect } from '../lib/index.js';
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

describe('CheckedSelect', () => {
    it.skip('does something', () => {
        // given
        const options = [{ label: 'one', value: 1 }];
        const selection = [{ value: 1 }];
        const changeHandler = sinon.spy();
        // when
        const wrapper = mount(<CheckedSelect
            options={ options }
            value={ selection }
            onChange={ changeHandler }
        />);
        // then
        assert.isTrue(changeHandler.notCalled);
    });
});
