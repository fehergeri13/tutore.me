import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS, computed} from 'mobx';
import autobind from 'autobind';
import {range} from 'lodash';

import "./user.less"
import PostItem from "../../components/post/PostItem";
import Rate from "../../components/rate/Rate";

const Aux = (props) => {
    return props.children;
};

@inject('model')
@observer
export default class User extends React.Component {

    @observable.ref user = undefined;
    @observable.shallow userPosts = [];
    @observable.shallow userRatings = [];

    @observable isModifyData = false;
    @observable isModifyPassword = false;



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

    @observable.shallow modifyPassword = {
        password_current: "",
        password: "",
        password_confirm: "",
    };

    renderPasswordForm() {
        if(!this.isModifyPassword) {
            return null;
        }

        return <form onSubmit={this.handleModifyPasswordSubmit}>
            <label>
                <span>Jelenlegi jelszó</span>
                <input
                    type="password"
                    name="password_current"
                    onChange={this.handleModifyPasswordChange}
                    value={this.modifyPassword.password_current}
                />
            </label>
            <label>
                <span>Új jelszó</span>
                <input
                    type="password"
                    name="password"
                    onChange={this.handleModifyPasswordChange}
                    value={this.modifyPassword.password}
                />
            </label>
            <label>
                <span>Új jelszó megerősítése</span>
                <input
                    type="password"
                    name="password_confirm"
                    onChange={this.handleModifyPasswordChange}
                    value={this.modifyPassword.password_confirm}
                />
            </label>
            <button className="happy" type="submit" disabled={this.modifyPasswordErrors.length > 0}>Módosítás</button>
            <button type="button" onClick={this.handleModifyPasswordCancel}>Mégse</button>

            <div className="errors">{this.modifyPasswordErrors.map((error, index) => <p key={index}>{error}</p>)}</div>
        </form>
    }

    @computed get modifyPasswordErrors() {
        const errors = [];

        if( this.modifyPassword.password_current === "" &&
            this.modifyPassword.password === "" &&
            this.modifyPassword.password_confirm === "") {
            return [];
        }

        if(this.modifyPassword.password_current === "") {
            errors.push("Add meg a jelenlegi jelszavadat is!");
        }

        if(/.{5,}/.test(this.modifyPassword.password) === false) {
            errors.push("Nem megfelelő a jelszó, legalább 5 karakter legyen.");
        }

        if(this.modifyPassword.password !== this.modifyPassword.password_confirm) {
            errors.push("A két jelszó nem egyezik.");
        }

        return errors;
    }

    @autobind handleModifyPasswordChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.modifyPassword[name] = value;
    }

    @autobind handleModifyPasswordClick() {
        this.isModifyPassword = true;
        this.modifyPassword.password_current = "";
        this.modifyPassword.password = "";
        this.modifyPassword.password_confirm = "";
    }

    @autobind handleModifyPasswordCancel() {
        this.isModifyPassword = false;
    }

    @autobind async handleModifyPasswordSubmit(e) {
        e.preventDefault();

        try {
            await this.props.model.rest.changePassword(this.modifyPassword.password_current, this.modifyPassword.password);
        } catch (e) {
            alert('Nem sikerült a módosítás');
            return;
        }

        this.isModifyPassword = false;
    }







    @observable.shallow modifyData = {
        email: "",
        firstName: "",
        lastName: "",
    };

    renderDataForm() {
        if(!this.isModifyData) {
            return null;
        }

        return <form onSubmit={this.handleModifyDataSubmit}>
            <label>
                <span>Email</span>
                <input
                    type="text"
                    name="email"
                    onChange={this.handleModifyDataChange}
                    value={this.modifyData.email}
                />
            </label>
            <label>
                <span>Vezetéknév</span>
                <input
                    type="text"
                    name="firstName"
                    onChange={this.handleModifyDataChange}
                    value={this.modifyData.firstName}
                />
            </label>
            <label>
                <span>Keresztnév</span>
                <input
                    type="text"
                    name="lastName"
                    onChange={this.handleModifyDataChange}
                    value={this.modifyData.lastName}
                />
            </label>
            <button className="happy" type="submit" disabled={this.modifyDataErrors.length > 0}>Módosítás</button>
            <button type="button" onClick={this.handleModifyDataCancel}>Mégse</button>

            <div className="errors">{this.modifyDataErrors.map((error, index) => <p key={index}>{error}</p>)}</div>
        </form>
    }

    @computed get modifyDataErrors() {
        const errors = [];

        if( this.modifyData.email === "" &&
            this.modifyData.firstName === "" &&
            this.modifyData.lastName === "") {
            return [];
        }

        const emailRegExp = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        if(this.modifyData.email !== "" &&
            emailRegExp.test(this.modifyData.email) === false) {
            errors.push("Nem megfelelő az email cím.");
        }

        if(this.modifyData.firstName !== "" && this.modifyData.firstName.length < 2) {
            errors.push("A vezetékneved legalább 2 karakter legyen");
        }

        if(this.modifyData.lastName !== "" && this.modifyData.lastName.length < 2) {
            errors.push("A keresztneved legalább 2 karakter legyen");
        }

        return errors;
    }

    @autobind handleModifyDataChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.modifyData[name] = value;
    }

    @autobind handleModifyDataClick() {
        this.isModifyData = true;
        this.modifyData.email = "";
        this.modifyData.firstName = "";
        this.modifyData.lastName = "";
    }

    @autobind handleModifyDataCancel() {
        this.isModifyData = false;
    }

    @autobind async handleModifyDataSubmit(e) {
        e.preventDefault();

        const data = {};

        if(this.modifyData.email !== "") {
            data.email = this.modifyData.email;
        }

        if(this.modifyData.firstName !== "") {
            data.firstName = this.modifyData.firstName;
        }

        if(this.modifyData.lastName !== "") {
            data.lastName = this.modifyData.lastName;
        }

        try {
            await this.props.model.rest.editUser(data);
        } catch (e) {
            alert('Nem sikerült a módosítás');
            return;
        }
        this.isModifyData = false;
        await this.fetchUser();
    }



    renderMyData() {
        if(!this.isSelf) {
            return null;
        }
        return <div className="data">

            <div className="username">Felhasználónév: <span>{this.user.username}</span></div>
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

        return <Rate myRating={this.myRating} targetUserId={this.props.id} fetch={this.fetchRatings}/>;
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

    renderModify() {
        if(!this.isSelf) {
            return null;
        }

        return <Aux>
            <button onClick={this.handleModifyDataClick}>Adatok módosítása</button>
            {this.renderDataForm()}

            <button onClick={this.handleModifyPasswordClick}>Jelszó módosítása</button>
            {this.renderPasswordForm()}
        </Aux>;
    }

    render() {
        if (this.user === undefined) {
            return null;
        }

        return <div className="user-page">
            <div className="profile">
                <h2>{this.isSelf ? 'Profilom' : `${this.user.username} profilja`}</h2>
                {this.renderMyData()}

                {this.renderModify()}

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
