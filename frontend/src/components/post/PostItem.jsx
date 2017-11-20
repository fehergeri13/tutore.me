import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./post_item.less";

@inject('model')
@observer
export default class PostItem extends React.Component {

    /* static schema = {
        "id": "",
        "name": "",
        "body": "",
        "type": "",
        "subject": "",
        "userId": "",
        "username": "",
        "createdAt": "",
        "expiresAt": "",
    }; */

    @autobind
    handleEditClick(e) {
        this.props.model.routingStore.push('/edit/'+this.props.post.id)
    }

    @autobind
    handleSendMessage(e) {
        e.preventDefault();

        this.props.model.openMessageModal(this.props.post);
    }

    renderControls() {
        if (!this.props.isControl) {
            return null;
        }

        return <div className="controls">
            <button onClick={this.handleEditClick}>Szerkesztés</button>
            <button>Törlés</button>
            <button>Meghosszabbítás</button>
        </div>
    }

    render() {
        return <div className="post-item">
            <div className="post">
                <h2><a href="#">{this.props.post.name}</a></h2>
                <p>{this.props.post.body}</p>
                <div className="time">Feladás időpontja: {this.props.post.createdAt}</div>
                <div className="owner">
                    Hirdető neve:
                    {this.props.post.username}
                    <button
                        type="button"
                        className="send-message"
                        onClick={this.handleSendMessage}
                    >Írj neki üzenetet</button>
                </div>
            </div>
            {this.renderControls()}
        </div>;
    }
}
