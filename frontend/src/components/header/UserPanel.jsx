import React from 'react';
import {inject, observer} from 'mobx-react';
import {Link} from "react-router-dom";

@inject('model')
@observer
export default class UserPanel extends React.Component {
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

    render() {
        if (this.props.model.auth.isLoggedIn) {
            return this.renderLoggedIn();
        } else {
            return this.renderLoggedOut();
        }
    }
}