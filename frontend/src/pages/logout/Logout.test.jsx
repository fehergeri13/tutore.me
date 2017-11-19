import React from 'react';
import renderer from 'react-test-renderer';
import Login from "./Login";
import {Provider} from 'mobx-react';

describe('Login', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider model={{}}><Login /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
