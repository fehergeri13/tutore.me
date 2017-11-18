import React from 'react';
import renderer from 'react-test-renderer';
import Header from "./Header";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from 'mobx-react'
import Model from "../../stores/Model";

describe('Header', () => {
    it('renders correctly', () => {

        const model = new Model();

        const tree = renderer.create(
            <Provider model={model}><Router><Header /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
