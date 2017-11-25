import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {observable, toJS, computed} from 'mobx';

import "./login.less"


@inject('model')
@observer
export default class Login extends React.Component {
    @observable.shallow loginData = {
        username: "",
        password: "",
        isRemember: false,
    };

    @observable.shallow registerData = {
        username: "",
        password: "",
        password_confirm: "",
        email: "",
        firstName: "",
        lastName: "",
    };

    @computed get errors() {
        const errors = [];

        if(this.registerData.username === "" &&
            this.registerData.password === "" &&
            this.registerData.password_confirm === "" &&
            this.registerData.email === "" &&
            this.registerData.firstName === "" &&
            this.registerData.lastName === "") {
            return [];
        }

        if(/^[a-zA-Z0-9_.]{5,10}$/.test(this.registerData.username) === false) {
            errors.push("Nem megfelelő a felhasználónév. Legalább 5 karakter és maximum 10 karakter lehet, csak betűket, számokat, alulvonást és pontot tartalmazhat");
        }

        if(/.{5,}/.test(this.registerData.password) === false) {
            errors.push("Nem megfelelő a jelszó, legalább 5 karakter legyen.");
        }

        if(this.registerData.password !== this.registerData.password_confirm) {
            errors.push("A két jelszó nem egyezik.");
        }

        if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
                .test(this.registerData.email) === false) {
            errors.push("Nem megfelelő az email cím.");
        }

        if(this.registerData.firstName.length < 2) {
            errors.push("A vezetékneved legalább 2 karakter legyen");
        }

        if(this.registerData.lastName.length < 2) {
            errors.push("A keresztneved legalább 2 karakter legyen");
        }

        return errors;
    }

    @autobind
    handleLoginChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.loginData[name] = value;

        console.log('loginData', toJS(this.loginData))
    }

    @autobind
    handleLoginSubmit(e) {
        e.preventDefault();

        this.props.model.auth.doLogin(toJS(this.loginData));
    }

    @autobind
    handleRegisterChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.registerData[name] = value;

        console.log('registerData', toJS(this.registerData))
    }

    @autobind
    async handleRegisterSubmit(e) {
        e.preventDefault();

        await this.props.model.auth.doRegister(toJS(this.registerData));

        this.loginData.username = this.registerData.username;
        this.loginData.password = "";

        this.registerData.username = "";
        this.registerData.password = "";
        this.registerData.password_confirm = "";
        this.registerData.firstName = "";
        this.registerData.lastName = "";
        this.registerData.email = "";

    }

    render() {
        return <div className="login-page">
            <div className="login">
                <h2>Bejelentkezés</h2>

                <form onSubmit={this.handleLoginSubmit}>
                    <label>
                        <span>Felhasználónév</span>
                        <input
                            type="text"
                            name="username"
                            onChange={this.handleLoginChange}
                            value={this.loginData.username}
                        />
                    </label>
                    <label>
                        <span>Jelszó</span>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleLoginChange}
                            value={this.loginData.password}
                        />
                    </label>
                    <label><span>Emlékezz rám</span><input type="checkbox"/></label>
                    <button type="submit">Belépés</button>
                </form>
            </div>

            <div className="register">
                <h2>Regisztráció</h2>

                <form onSubmit={this.handleRegisterSubmit}>
                    <label>
                        <span>Felhasználónév</span>
                        <input
                            type="text"
                            name="username"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.username}
                        />
                    </label>
                    <label>
                        <span>Jelszó</span>
                        <input
                            type="password"
                            name="password"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.password}
                        />
                    </label>
                    <label>
                        <span>Jelszó megerősítése</span>
                        <input
                            type="password"
                            name="password_confirm"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.password_confirm}
                        />
                    </label>
                    <label>
                        <span>Email</span>
                        <input
                            type="text"
                            name="email"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.email}
                        />
                    </label>
                    <label>
                        <span>Vezetéknév</span>
                        <input
                            type="text"
                            name="firstName"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.firstName}
                        />
                    </label>
                    <label>
                        <span>Keresztnév</span>
                        <input
                            type="text"
                            name="lastName"
                            onChange={this.handleRegisterChange}
                            value={this.registerData.lastName}
                        />
                    </label>
                    <button type="submit" disabled={this.errors.length > 0}>Regisztrálás</button>

                    <div className="errors">{this.errors.map((error, index) => <p key={index}>{error}</p>)}</div>
                </form>
            </div>
        </div>;
    }
}
