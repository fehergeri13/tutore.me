import React from 'react';


import "./header.less"

export default class App extends React.Component {
    render() {
        return <div className="header">
            <h1>tutore.me</h1>

            <div className="nav">
                <a href="#">Hirdetések</a>
                <a href="#">Új hirdetés</a>
            </div>

            <div className="user">
                <a href="#">Üzenetek</a>
                <a href="#">Profilom</a>
                <a href="#">Kilépés</a>
            </div>
        </div>;
    }
}
