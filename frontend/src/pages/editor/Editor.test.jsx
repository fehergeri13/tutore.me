import React from 'react';
import renderer from 'react-test-renderer';
import Editor from "./Editor";
import {Provider} from "mobx-react";

describe('Editor', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Provider model={{}}><Editor /></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
