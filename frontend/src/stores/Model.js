import {observable} from "mobx";

import Auth from "./Auth";
import Rest from "./Rest";

export default class Model {
    @observable.ref auth = new Auth(this);
    @observable.ref routingStore = undefined;
    @observable.ref rest = new Rest(this);


    constructor(routingStore) {
        this.routingStore = routingStore;
    }
}