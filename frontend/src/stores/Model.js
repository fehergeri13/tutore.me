import {observable} from "mobx";

import Rest from "./Rest";

export default class Model {
    @observable.ref routingStore = undefined;
    @observable.ref rest = new Rest(this);

    constructor(routingStore) {
        this.routingStore = routingStore;
    }
}