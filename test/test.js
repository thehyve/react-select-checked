/* eslint-env mocha */
import { CheckedSelect } from '../lib/index.js';
import React from 'react';
import { assert } from 'chai';
import { mount } from 'enzyme';
import sinon from 'sinon';

describe('CheckedSelect behaviour independent of synchronicity', () => {
    const asyncOptions = [
        {
            asyncValue: false,
            makeOpts: opts => opts,
            makeLoadOpts: opts => undefined
        },
        {
            asyncValue: true,
            makeOpts: opts => undefined,
            makeLoadOpts: opts => (() => Promise.resolve(opts))
         },
    ];
    asyncOptions.forEach(({ asyncValue, makeOpts, makeLoadOpts }) => {
        describe(`with async={ ${ asyncValue } }`, () => {
            it('leaves selection unchanged if backspace is pressed in an empty search box', () => {
                // given
                const options = [
                    { label: 'one', value: 1 },
                    { label: 'two', value: 2 }
                ];
                const selection = [{ value: 2 }];
                const changeHandler = sinon.spy();
                const wrapper = mount(<CheckedSelect
                    async={ asyncValue }
                    options={ makeOpts(options) }
                    loadOptions={ makeLoadOpts(options) }
                    value={ selection }
                    onChange={ changeHandler }
                />);
                // when
                const key = { key: 'Backspace', keyCode: 8, which: 8 };
                const searchBox = wrapper.find('input');
                searchBox.simulate('keydown', key);
                searchBox.simulate('keypress', key);
                searchBox.simulate('keyup', key);
                // then
                assert.isTrue(changeHandler.notCalled);
            });
        });
    });
});
