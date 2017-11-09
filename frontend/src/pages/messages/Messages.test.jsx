import React from 'react';
import renderer from 'react-test-renderer';
import User from "./Messages";

describe('User', () => {
    it('renders correctly', () => {
        const tree = renderer.create(
            <User />
        ).toJSON();
        expect(tree).toMatchSnapshot();
    });
});
