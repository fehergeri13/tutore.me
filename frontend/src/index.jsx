import React from 'react';
import ReactDOM from 'react-dom';

import "./index.less"
import App from './pages/app/App';
import Login from "./pages/login/Login";
import User from "./pages/user/User";
import Messages from "./pages/messages/Messages";

ReactDOM.render(<Messages/>, document.getElementById('root'));