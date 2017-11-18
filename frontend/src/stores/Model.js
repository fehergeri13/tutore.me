import {observable} from "mobx";

import Auth from "./Auth";

export default class Model {
    @observable.ref auth = new Auth();
    @observable.ref routingStore = undefined;

    constructor(routingStore) {
        this.routingStore = routingStore;
    }
}