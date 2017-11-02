import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

Enzyme.configure({ adapter: new Adapter() });

global.requestAnimationFrame = callback => {
    setTimeout(callback, 0)
}

Date.now = jest.fn(() => 1482363367071);