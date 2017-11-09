import React from 'react';
import renderer from 'react-test-renderer';
import Header from "./Header";
import {MemoryRouter as Router} from "react-router-dom";

describe('Header', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <Router><Header /></Router>
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
