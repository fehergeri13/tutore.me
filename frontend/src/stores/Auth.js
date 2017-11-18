import {observable} from "mobx";

export default class Auth {
    @observable isLoggedIn = false;
    @observable username = undefined;
}