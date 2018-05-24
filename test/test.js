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
            it.skip('does something', () => {
                // given
                const options = [{ label: 'one', value: 1 }];
                const selection = [{ value: 1 }];
                const changeHandler = sinon.spy();
                // when
                const wrapper = mount(<CheckedSelect
                    async={ asyncValue }
                    options={ makeOpts(options) }
                    loadOptions={ makeLoadOpts(options) }
                    value={ selection }
                    onChange={ changeHandler }
                />);
                // then
                assert.isTrue(changeHandler.notCalled);
            });
        });
    });
});
