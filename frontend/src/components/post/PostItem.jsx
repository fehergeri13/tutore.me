import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./post_item.less";
import moment from 'moment';

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

    renderSendMessage() {
        if(this.props.model.auth.userId === this.props.post.userId) {
            return null;
        }

        return <button
            type="button"
            className="send-message"
            onClick={this.handleSendMessage}
        >Írj neki üzenetet</button>;
    }

    render() {
        const expireDate = moment(this.props.post.expiresAt);

        return <div className="post-item">
            <div className="post">
                <h2><a href="#">{this.props.post.name}</a></h2>
                <p>{this.props.post.body}</p>
                <div className="time">Lejárat időpontja: {expireDate.format('YYYY. MM. DD. dddd HH:mm')}</div>
                <div className="owner">
                    Hirdető neve:
                    {' '}
                    {this.props.post.username}
                    {' '}
                    {this.renderSendMessage()}
                </div>
            </div>
            {this.renderControls()}
        </div>;
    }
}
