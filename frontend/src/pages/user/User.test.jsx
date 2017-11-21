import React from 'react';
import renderer from 'react-test-renderer';
import User from "./User";
import {Provider} from "mobx-react";

describe('User', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider model={{}}><User /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
