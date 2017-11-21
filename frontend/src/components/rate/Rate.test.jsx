import React from 'react';
import renderer from 'react-test-renderer';
import Rate from "./Rate";
import {MemoryRouter as Router} from "react-router-dom";
import {Provider} from 'mobx-react'

describe('Rate', () => {
    it('renders correctly', () => {

        const tree = renderer.create(
            <Provider model={{}}><Router><Rate /></Router></Provider>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
