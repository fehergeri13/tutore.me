import {observable, action} from "mobx";

import Auth from "./Auth";
import Rest from "./Rest";

export default class Model {
    @observable.ref auth = new Auth(this);
    @observable.ref routingStore = undefined;
    @observable.ref rest = new Rest(this);

    @observable isMessageModalOpen = false;
    @observable.ref messagePost = undefined;


    constructor(routingStore) {
        this.routingStore = routingStore;
    }

    @action openMessageModal(post) {
        this.isMessageModalOpen = true;
        this.messagePost = post;
    }

    @action closeMessageModal() {
        this.isMessageModalOpen = false;
    }
}