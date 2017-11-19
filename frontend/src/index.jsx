import React from 'react';
import ReactDOM from 'react-dom';
import {Router, Route, Link} from 'react-router-dom';

import "./index.less";
import Home from './pages/app/Home';
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Messages from "./pages/messages/Messages";
import Create from "./pages/create/Create";
import Header from "./components/header/Header";
import Model from "./stores/Model";
import { Provider } from 'mobx-react';

import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import Logout from "./pages/logout/Logout";


const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const model = new Model(routingStore);
const history = syncHistoryWithStore(browserHistory, routingStore);

ReactDOM.render(
    <Provider model={model}>
        <Router history={history}>
            <div className="app">
                <Header/>

                <div className="content">
                    <Route exact path="/" component={Home}/>
                    <Route path="/create" component={Create}/>
                    <Route path="/messages" component={Messages}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/user" component={User}/>
                </div>

                <div className="footer">
                    footer
                </div>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);