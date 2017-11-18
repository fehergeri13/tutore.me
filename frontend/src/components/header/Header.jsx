import React from 'react';
import {inject, observer} from 'mobx-react';


import "./header.less"
import {Link} from "react-router-dom";
import UserPanel from "./UserPanel";

@inject('model')
@observer
export default class App extends React.Component {



    renderLoggedIn() {
        return <ul className="user">
            <li><Link to="/messages">Üzenetek</Link></li>
            <li><Link to="/user">Profilom</Link></li>
            <li><Link to="/logout">Kilépés</Link></li>
        </ul>
    }

    renderLoggedOut() {
        return <ul className="user">
            <li><Link to="/login">Bejelentkezés</Link></li>
        </ul>
    }

    renderUserPanel() {
        if (this.props.model.auth.isLoggedIn) {
            return this.renderLoggedIn();
        } else {
            return this.renderLoggedOut();
        }
    }


    render() {
        return <div className="header">
            <h1>tutore.me</h1>

            <input id="habmurger-toggle" type="checkbox"/>
            <label htmlFor="habmurger-toggle" className="hamburger">
                <i className="material-icons menu">menu</i>
                <i className="material-icons close">close</i>
            </label>

            <div className="links">
                <ul className="nav">
                    <li><Link to="/">Hirdetések</Link></li>
                    <li><Link to="/create">Új hirdetés</Link></li>
                </ul>

                <UserPanel/>
            </div>
        </div>;
    }
}
