import React from 'react';
import {inject, observer} from 'mobx-react';
import "./post.less"

@inject('model')
@observer
export default class Post extends React.Component {

    static schema = {
        "id": "",
        "name": "",
        "body": "",
        "type": "",
        "subject": "",
        "userId": "",
        "username": "",
        "createdAt": "",
        "expiresAt": "",
    };

    renderControls() {
        return <div className="actions">
            <button>Szerkesztés</button>
            <button>Törlés</button>
            <button>Meghosszabbítás</button>
        </div>
    }

    render() {
        return <li>
            <div className="ad">
                <h2><a href="#">{this.props.name}</a></h2>
                <p>{this.props.body}</p>
                <div className="time">{this.props.createdAt}</div>
            </div>
            {this.renderControls()}
        </li>;
    }
}
