import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route} from 'react-router-dom';
import {Provider} from 'mobx-react';
import moment from 'moment';
import createBrowserHistory from 'history/createBrowserHistory';
import {RouterStore, syncHistoryWithStore} from 'mobx-react-router';

import Model from "./stores/Model";

import HomePage from './pages/HomePage';
import CreatorPage from "./pages/CreatorPage";
import Header from "./components/Header";
import Footer from "./components/Footer";

moment.locale('hu');

const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const model = new Model(routingStore);
const history = syncHistoryWithStore(browserHistory, routingStore);

import "./index.less";

ReactDOM.render(
    <Provider model={model}>
        <Router history={history}>
            <div className="app vflex">
                <Header/>
                <div className="flexgrow1 vscroll">
                    <HomePage/>
                    <Footer/>
                    <CreatorPage/>
                </div>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);