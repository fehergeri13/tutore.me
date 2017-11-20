import React from 'react';
import renderer from 'react-test-renderer';
import Post from "./Post";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from 'mobx-react'
import Model from "../../stores/Model";

describe('Post', () => {
    it('renders correctly', () => {

        const model = new Model();

        const tree = renderer.create(
            <Provider model={model}><Router><Post /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
