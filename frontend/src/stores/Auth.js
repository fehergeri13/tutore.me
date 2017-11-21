import {observable, action} from "mobx";
import axios from 'axios';

const getLocalStorageItem = (name, def) => {
    if (localStorage.getItem(name) !== null) {
        return localStorage.getItem(name);
    }

    return def;
};


export default class Auth {
    constructor(model) {
        this.model = model;

        this.isLoggedIn = getLocalStorageItem('isLoggedIn', false);
        this.username = getLocalStorageItem('username', undefined);
        this.userId = getLocalStorageItem('userId', undefined);
    }

    @observable.ref model = undefined;
    @observable isLoggedIn = false;
    @observable username = undefined;
    @observable userId = undefined;

    @action async doLogin({username, password}) {
        try {
            const userId = (await this.model.rest.login({username, password})).userId;

            this.isLoggedIn = true;
            this.username = username;
            this.userId = userId;

            localStorage.setItem('isLoggedIn', true);
            localStorage.setItem('username', username);
            localStorage.setItem('userId', userId);

            this.model.routingStore.push('/user');
        } catch(e) {
            console.error(e);
        }
    }

    @action async doRegister({username, password, password_confirm, email, firstName, lastName}) {
        if(password !== password_confirm) {
            alert('Password does not match');
        }

        try {
            await this.model.rest.register({username, password, email, firstName, lastName});
            alert('registered');
        } catch(e) {
            alert(e);
        }
    }

    @action async doLogout() {
        try {
            await this.model.rest.logout();
        } catch(e) {
            console.error(e);
        }

        console.log('logged out');

        this.isLoggedIn = false;
        this.username = undefined;
        this.userId = undefined;

        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        localStorage.removeItem('userId');

        this.model.routingStore.push('/');
    }
}