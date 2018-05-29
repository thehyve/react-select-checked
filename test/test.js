/* eslint-env mocha */
import { CheckedSelect } from '../lib/index.js';
import React from 'react';
import { assert } from 'chai';
import { mount, render } from 'enzyme';
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
            const getMinimalOptionsProp = () => [{ label: 'one', value: 1 }, { label: 'two', value: 2 }];
            it('leaves selection unchanged if backspace is pressed in an empty search box', () => {
                // given
                const options = getMinimalOptionsProp();
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

            it('displays the placeholder text once if nothing is selected', () => {
                // given
                const options = getMinimalOptionsProp();
                const placeholderText = 'Some number';
                //when
                const wrapper = render(<CheckedSelect
                    async={ asyncValue }
                    options={ makeOpts(options) }
                    loadOptions={ makeLoadOpts(options) }
                    onChange={ sinon.stub() }
                    value={ [] }
                    placeholder={ placeholderText }
                />);
                // then
                const placeholderRegExp = new RegExp(placeholderText, 'g');
                assert.lengthOf(wrapper.text().match(placeholderRegExp), 1);
            });

            it('displays the placeholder text once if values are selected', () => {
                // given
                const options = getMinimalOptionsProp();
                const placeholderText = 'Some number';
                // when
                const wrapper = render(<CheckedSelect
                    async={ asyncValue }
                    options={ makeOpts(options) }
                    loadOptions={ makeLoadOpts(options) }
                    onChange={ sinon.stub() }
                    value={ [{ value: 1 }, { value: 2 }] }
                    placeholder={ placeholderText }
                />);
                // then
                const placeholderRegExp = new RegExp(placeholderText, 'g');
                assert.lengthOf(wrapper.text().match(placeholderRegExp), 1);
            });
        });
    });
});
