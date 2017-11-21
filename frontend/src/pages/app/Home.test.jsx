import React from 'react';
import renderer from 'react-test-renderer';
import Home from "./Home";
import {Provider} from "mobx-react";

describe('Home', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider model={{}}><Home /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
