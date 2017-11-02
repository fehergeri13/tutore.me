/* eslint-env jest */

import { mount } from 'enzyme'
import React from 'react'
import renderer from 'react-test-renderer'

import App from './index.js'

describe('With Enzyme', () => {
  it('App shows "Index Page"', () => {
    const app = mount(<App />)

    expect(app.find('h1').text()).toEqual('Index Page')
  })
})

describe('With Snapshot Testing', () => {
  it('App shows "Index Page!"', () => {
    const component = renderer.create(<App />)
    const tree = component.toJSON()
    expect(tree).toMatchSnapshot()
  })
})