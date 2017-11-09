import React from 'react';
import ReactDOM from 'react-dom';
import {
    BrowserRouter as Router,
    Route,
    Link
} from 'react-router-dom'

import "./index.less"
import Home from './pages/app/Home';
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Messages from "./pages/messages/Messages";
import Create from "./pages/create/Create";
import Header from "./components/header/Header";

ReactDOM.render(
    <Router>
        <div className="app">
            <Header/>

            <div className="content">
                <Route exact path="/" component={Home}/>
                <Route path="/create" component={Create}/>
                <Route path="/messages" component={Messages}/>
                <Route path="/login" component={Login}/>
                <Route path="/user" component={User}/>
            </div>

            <div className="footer">
                footer
            </div>
        </div>
    </Router>, document.getElementById('root'));