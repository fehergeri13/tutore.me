import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS} from 'mobx';
import autobind from 'autobind';

import "./user.less"
import PostItem from "../../components/post/PostItem";

@inject('model')
@observer
export default class User extends React.Component {

    @observable isSelf = false;
    @observable.ref user = undefined;
    @observable.shallow userPosts = [];

    async componentDidMount() {

        if(!this.props.model.auth.isLoggedIn) {
            this.props.model.routingStore.push('/login');
            return;
        }

        this.isSelf = this.props.id === undefined || this.props.id === this.props.model.auth.userId;

        const userId = this.props.id !== undefined ? this.props.id : this.props.model.auth.userId;
        this.user = await this.props.model.rest.getUser(userId);
        console.log('this.user', toJS(this.user));

        const response = await this.props.model.rest.getPosts();
        const filteredPosts = response.posts.filter(post => post.userId === userId);
        this.userPosts.replace(filteredPosts);

        console.log('this.userPosts', toJS(this.userPosts));
    }

    renderPosts() {
        if (this.userPosts.length === 0) {
            return <h2>Nincs hirdetés</h2>
        }

        return <ul>
            {this.userPosts.map(post => <li key={post.id}><PostItem post={post} isControl={true}/></li>)}
        </ul>;
    }

    renderMyData() {
        if(!this.isSelf) {
            return null;
        }
        return <div className="data">
            <div className="firstName">Vezetéknév: <span>{this.user.firstName}</span></div>
            <div className="lastName">Keresztnév: <span>{this.user.lastName}</span></div>
            <div className="email">Email: <span>{this.user.email}</span></div>
        </div>
    }

    renderSendMessage() {
        if (this.isSelf) {
            return null;
        }

        return <button
            type="button"
            className="send-message"
            onClick={this.handleSendMessage}
        >Írj neki üzenetet</button>;
    }

    @autobind
    handleSendMessage(e) {
        e.preventDefault();

        if (!this.props.model.auth.isLoggedIn) {
            this.props.model.routingStore.push('/login');
            return;
        }

        this.props.model.openMessageModal(this.props.id, this.user.username);
    }

    renderFeedbackSend() {
        if (this.isSelf) {
            return null;
        }

        return;
    }

    render() {
        if (this.user === undefined) {
            return null;
        }

        return <div className="user-page">
            <div className="profile">
                <h2>{this.isSelf ? 'Profilom' : `${this.user.username} profilja`}</h2>
                {this.renderMyData()}
                {this.renderSendMessage()}
                {this.renderFeedbackSend()}

                <div className="feedbacks">
                    <h2>{this.isSelf ? 'Rólam írták' : 'Róla írták'}</h2>

                    <ul>
                        <li>
                            <p>Nagyon király, 10/10</p>
                            <div className="stars">★★★★★</div>
                        </li>
                        <li>
                            <p>Egész jó!</p>
                            <div className="stars">★★★★☆</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="userfeed">
                <h2>{this.isSelf ? 'Hirdetéseim' : 'Hirdetései'}</h2>
                {this.renderPosts()}
            </div>
        </div>;
    }
}
