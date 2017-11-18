import {observable, action} from "mobx";
import axios from 'axios';

export default class Auth {
    constructor(model) {
        this.model = model;
    }

    @observable.ref model = undefined;
    @observable isLoggedIn = false;
    @observable username = undefined;

    @action async doLogin({username, password}) {
        try {
            await this.model.rest.login({username, password});
            this.username = username;
            this.isLoggedIn = true;

            // this.model.routingStore.push('/user');
        } catch(e) {
            alert(e);
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
}