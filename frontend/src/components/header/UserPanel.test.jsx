import React from 'react';
import renderer from 'react-test-renderer';
import Header from "./Header";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from 'mobx-react'
import Model from "../../stores/Model";
import UserPanel from "./UserPanel";

describe('Header', () => {
    it('renders correctly', () => {

        const model = new Model();

        const tree = renderer.create(
            <Provider model={model}><Router><UserPanel /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders logged in', () => {

        const model = new Model();

        model.auth.isLoggedIn = true;

        const tree = renderer.create(
            <Provider model={model}><Router><UserPanel /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });

    it('renders logged out', () => {

        const model = new Model();

        model.auth.isLoggedIn = false;

        const tree = renderer.create(
            <Provider model={model}><Router><UserPanel /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
