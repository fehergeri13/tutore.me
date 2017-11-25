import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS, computed} from 'mobx';
import autobind from 'autobind';
import {range} from 'lodash';

import "./user.less"
import PostItem from "../../components/post/PostItem";
import Rate from "../../components/rate/Rate";

@inject('model')
@observer
export default class User extends React.Component {

    @observable.ref user = undefined;
    @observable.shallow userPosts = [];
    @observable.shallow userRatings = [];


    @computed get userId() {
        return this.props.id !== undefined ? this.props.id : this.props.model.auth.userId;
    }

    @computed get isSelf() {
        return this.props.id === undefined || this.props.id === this.props.model.auth.userId;
    }

    async componentDidMount() {

        if(!this.props.model.auth.isLoggedIn) {
            this.props.model.routingStore.push('/login');
            return;
        }

        await this.fetchUser();
        await this.fetchPosts();
        await this.fetchRatings();
    }

    @autobind
    async fetchUser() {
        this.user = await this.props.model.rest.getUser(this.userId);
    }

    @autobind
    async fetchPosts() {
        const response = await this.props.model.rest.getPosts();
        const filteredPosts = response.posts.filter(post => post.userId === this.userId);
        this.userPosts.replace(filteredPosts);
    }

    @autobind
    async fetchRatings() {
        const ratings = await this.props.model.rest.getRatings(this.userId);
        this.userRatings.replace(ratings);
    }

    @computed get myRating() {
        return this.userRatings.find(rating => rating.userId === this.props.model.auth.userId);
    }

    renderPosts() {
        if (this.userPosts.length === 0) {
            return <h2>Nincs hirdetés</h2>
        }

        return <ul>
            {this.userPosts.map(post => <li
                key={post.id}
            >
                <PostItem
                    post={post}
                    isControl={this.isSelf}
                    fetch={this.fetchPosts}
                />
            </li>)}
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

        return <Rate myRating={this.myRating} targetUserId={this.props.id}/>;
    }

    renderFeedbacks() {
        if(this.userRatings.length === 0) {
            return <div className="feedbacks">
                <h2>{this.isSelf ? 'Rólam írták' : 'Róla írták'}</h2>
                <p>Még nincs értékelés.</p>
            </div>
        }

        return <div className="feedbacks">
            <h2>{this.isSelf ? 'Rólam írták' : 'Róla írták'}</h2>


            <ul>
                {this.userRatings.map((rating, index) => <li key={index}>
                    <div className="stars">
                        {range(rating.stars).map(num => '★')}
                        {range(5-rating.stars).map(num => '☆')}
                    </div>
                    <p>{rating.body}</p>
                </li>)}
            </ul>
        </div>
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

                {this.renderFeedbacks()}
            </div>

            <div className="userfeed">
                <h2>{this.isSelf ? 'Hirdetéseim' : 'Hirdetései'}</h2>
                {this.renderPosts()}
            </div>
        </div>;
    }
}
