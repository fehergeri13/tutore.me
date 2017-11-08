import React from 'react';


import "./header.less"

export default class App extends React.Component {
    render() {
        return <div className="header">
            <h1>tutore.me</h1>

            <div className="nav">
                <ul className="links">
                    <li><a href="#">Hirdetések</a></li>
                    <li><a href="#">Új hirdetés</a></li>
                </ul>
            </div>

            <div className="user">
                <ul className="links">
                    <li><a href="#">Üzenetek</a></li>
                    <li><a href="#">Profilom</a></li>
                    <li><a href="#">Kilépés</a></li>
                </ul>
            </div>
        </div>;
    }
}
