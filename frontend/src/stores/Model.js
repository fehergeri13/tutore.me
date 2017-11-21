import {observable, action} from "mobx";

import Auth from "./Auth";
import Rest from "./Rest";

export default class Model {
    @observable.ref auth = new Auth(this);
    @observable.ref routingStore = undefined;
    @observable.ref rest = new Rest(this);

    @observable isMessageModalOpen = false;
    @observable messageUserId = undefined;
    @observable messageUsername = undefined;


    constructor(routingStore) {
        this.routingStore = routingStore;
    }

    @action openMessageModal(messageUserId, messageUsername) {
        this.isMessageModalOpen = true;
        this.messageUserId = messageUserId;
        this.messageUsername = messageUsername;
    }

    @action closeMessageModal() {
        this.isMessageModalOpen = false;
    }
}