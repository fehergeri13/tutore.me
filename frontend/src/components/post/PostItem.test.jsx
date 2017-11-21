import React from 'react';
import renderer from 'react-test-renderer';
import PostItem from "./PostItem";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from 'mobx-react'
import Model from "../../stores/Model";

describe('PostItem', () => {
    it('renders correctly', () => {

        const model = new Model();

        const tree = renderer.create(
            <Provider model={model}><Router><PostItem post={{}} /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
