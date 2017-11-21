import React from 'react';
import ReactDOM from 'react-dom';

import moment from 'moment';

moment.locale('hu');

import {Router, Route, Link} from 'react-router-dom';
import Home from './pages/app/Home';
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Messages from "./pages/messages/Messages";
import Editor from "./pages/editor/Editor";
import Header from "./components/header/Header";
import Model from "./stores/Model";
import { Provider } from 'mobx-react';

import createBrowserHistory from 'history/createBrowserHistory';
import { RouterStore, syncHistoryWithStore } from 'mobx-react-router';
import Logout from "./pages/logout/Logout";
import Message from "./components/message/Message";


const browserHistory = createBrowserHistory();
const routingStore = new RouterStore();

const model = new Model(routingStore);
const history = syncHistoryWithStore(browserHistory, routingStore);

import "./index.less";

ReactDOM.render(
    <Provider model={model}>
        <Router history={history}>
            <div className="app">
                <Header/>

                <div className="content">
                    <Route exact path="/" component={Home}/>
                    <Route path="/create" render={() => <Editor/>}/>
                    <Route path="/edit/:id" render={(props) => <Editor id={props.match.params.id}/>}/>
                    <Route path="/messages" component={Messages}/>
                    <Route path="/login" component={Login}/>
                    <Route path="/logout" component={Logout}/>
                    <Route path="/user" component={User}/>
                </div>

                <div className="footer">
                    footer
                </div>

                <Message/>
            </div>
        </Router>
    </Provider>,
    document.getElementById('root')
);