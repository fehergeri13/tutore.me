import React from 'react';


import "./header.less"
import {Link} from "react-router-dom";

export default class App extends React.Component {
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

                <ul className="user">
                    <li><Link to="/messages">Üzenetek</Link></li>
                    <li><Link to="/user">Profilom</Link></li>
                    <li><Link to="/logout">Kilépés</Link></li>
                </ul>
            </div>
        </div>;
    }
}
