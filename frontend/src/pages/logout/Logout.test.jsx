import React from 'react';
import renderer from 'react-test-renderer';
import Logout from "./Logout";
import {Provider} from 'mobx-react';

describe('Logout', () => {
    it('renders correctly', () => {
        const mockModel = {
            auth: {
                doLogout() {},
            }
        };
        const tree = renderer.create(
            <Provider model={mockModel}><Logout /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
