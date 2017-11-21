import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./post_item.less";
import moment from 'moment';
import {Link} from "react-router-dom";

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
    async handleDeleteClick() {
        await this.props.model.rest.deletePost(this.props.post.id);
    }

    @autobind
    async handleRenewClick() {
        await this.props.model.rest.renewPost(this.props.post.id);
    }

    renderControls() {
        if (!this.props.isControl) {
            return null;
        }

        return <div className="controls">
            <button onClick={this.handleEditClick}>Szerkesztés</button>
            <button onClick={this.handleDeleteClick}>Törlés</button>
            <button onClick={this.handleRenewClick}>Meghosszabbítás</button>
        </div>
    }

    renderOwner() {
        if(this.props.model.auth.userId === this.props.post.userId) {
            return null;
        }

        return <div className="owner">
            Hirdető:
            {' '}
            <Link to={`/user/${this.props.post.userId}`}>{this.props.post.username}</Link>
        </div>
    }

    render() {
        const expireDate = moment(this.props.post.expiresAt);

        return <div className="post-item">
            <div className="post">
                <h2><a href="#">{this.props.post.name}</a></h2>
                <p>{this.props.post.body}</p>
                <div className="time">Lejárat időpontja: {expireDate.format('YYYY. MM. DD. dddd HH:mm')}</div>
                {this.renderOwner()}
            </div>
            {this.renderControls()}
        </div>;
    }
}
