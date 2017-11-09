import React from 'react';


import "./header.less"
import {Link} from "react-router-dom";

export default class App extends React.Component {
    render() {
        return <div className="header">
            <h1>tutore.me</h1>

            <div className="nav">
                <ul className="links">
                    <li><Link to="/">Hirdetések</Link></li>
                    <li><Link to="/create">Új hirdetés</Link></li>
                </ul>
            </div>

            <div className="user">
                <ul className="links">
                    <li><Link to="/messages">Üzenetek</Link></li>
                    <li><Link to="/user">Profilom</Link></li>
                    <li><Link to="/logout">Kilépés</Link></li>
                </ul>
            </div>
        </div>;
    }
}
