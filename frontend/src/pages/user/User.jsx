import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import "./user.less"
import PostItem from "../../components/post/PostItem";

@inject('model')
@observer
export default class User extends React.Component {

    @observable.ref user = undefined;
    @observable.shallow userPosts = [];

    async componentDidMount() {
        const userId = this.props.model.auth.userId;
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

    render() {
        if (this.user === undefined) {
            return null;
        }

        return <div className="user-page">
            <div className="profile">
                <h2>Profilom</h2>
                <div className="data">
                    <div className="firstName">Vezetéknév: <span>{this.user.firstName}</span></div>
                    <div className="lastName">Keresztnév: <span>{this.user.lastName}</span></div>
                    <div className="email">Email: <span>{this.user.email}</span></div>
                </div>

                <div className="feedbacks">
                    <h2>Rólam írták</h2>

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
                <h2>Hirdetéseim</h2>
                {this.renderPosts()}
            </div>
        </div>;
    }
}
