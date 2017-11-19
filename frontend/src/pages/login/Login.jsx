import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {observable, toJS} from 'mobx';

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
    handleRegisterSubmit(e) {
        e.preventDefault();

        this.props.model.auth.doRegister(toJS(this.registerData));
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
                    <button type="submit">Regisztrálás</button>
                </form>
            </div>
        </div>;
    }
}
