/* eslint-env mocha */
import { CheckedSelect } from '../lib/index.js';
import React from 'react';
import { assert } from 'chai';
import { mount, render } from 'enzyme';
import sinon from 'sinon';

function withSyncAndAsync(specFunction) {
    describe('with async={ false }', () => {
        specFunction(options => ({
            async: false,
            options: options,
        }));
    });
    describe('with async={ true }', () => {
        specFunction(options => ({
            async: true,
            loadOptions: () => Promise.resolve(
                { options, complete: true }
            )
        }));
    });
};

describe('CheckedSelect', () => {
    const getMinimalOptionsProp = () => [{ label: 'one', value: 1 }, { label: 'two', value: 2 }];
    withSyncAndAsync(makeAsyncDependentProps => {
        it('leaves selection unchanged if backspace is pressed in an empty search box', () => {
            // given
            const options = getMinimalOptionsProp();
            const selection = [{ value: 2 }];
            const changeHandler = sinon.spy();
            const wrapper = mount(<CheckedSelect
                { ...makeAsyncDependentProps(options) }
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

    withSyncAndAsync(makeAsyncDependentProps => {
        it('displays the placeholder text once if nothing is selected', () => {
            // given
            const options = getMinimalOptionsProp();
            const placeholderText = 'Some number';
            //when
            const wrapper = render(<CheckedSelect
                { ...makeAsyncDependentProps(options) }
                onChange={ sinon.stub() }
                value={ [] }
                placeholder={ placeholderText }
            />);
            // then
            assert.equal(wrapper.text(), placeholderText);
        });
    });

    withSyncAndAsync(makeAsyncDependentProps => {
        it('displays the placeholder text once if values are selected', () => {
            // given
            const options = getMinimalOptionsProp();
            const placeholderText = 'Some number';
            // when
            const wrapper = render(<CheckedSelect
                { ...makeAsyncDependentProps(options) }
                onChange={ sinon.stub() }
                value={ [{ value: 1 }, { value: 2 }] }
                placeholder={ placeholderText }
            />);
            // then
            assert.equal(wrapper.text(), placeholderText);
        });
    });

    withSyncAndAsync(makeAsyncDependentProps => {
        it('does not display the placeholder text while typing a search string for additional values', done => {
            const options = getMinimalOptionsProp();
            const placeholderText = 'Some number';
            const wrapper = mount(<CheckedSelect
                { ...makeAsyncDependentProps(options) }
                onChange={ sinon.stub() }
                value={ [{ value: 1 }] }
                placeholder={ placeholderText }
            />);
            // when
            const searchBox = wrapper.find('input');
            searchBox.simulate('change', { target: { value: 'tw' } });
            // then, after allowing any async options to be returned
            setImmediate(() => {
                assert.notInclude(wrapper.text(), placeholderText);
                done();
            });
        });
    });
});
