import React from 'react';
import renderer from 'react-test-renderer';
import Messages from "./Messages";
import {Provider} from "mobx-react";

describe('Messages', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider model={{}}><Messages /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
