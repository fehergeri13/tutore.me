import axios from 'axios';
import {observable} from 'mobx';
import {startsWith} from 'lodash';

const wait = (time) => new Promise((resolve) => setTimeout(resolve, time));

export default class Rest {
    @observable.ref model = undefined;

    constructor(model) {
        this.model = model;
    }

    async getAllPost() {
        return (await axios.get('/api/hirdetes')).data;
    }

    async createPost(title, body, email, reCaptchaResponse) {
        return await axios.post('/api/hirdetes', {title, body, email, reCaptchaResponse});
    }
}