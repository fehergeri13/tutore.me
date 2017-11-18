import axios from 'axios';
import {observable} from 'mobx';
import {startsWith} from 'lodash';

export default class Rest {
    @observable.ref model = undefined;

    constructor(model) {
        this.model = model;

        // redirect to /api
        axios.interceptors.request.use(function (config) {
            // Do something before request is sent

            if(!startsWith(config.url, '/api')) {
                config.url = `/api${config.url}`;
            }

            return config;
        }, function (error) {
            // Do something with request error
            return Promise.reject(error);
        });
    }


    /**
     * POST: /user/login
     * request: {
     *  username: string, required
     *  password: string, required
     * }
     *
     * Tries logging in the user with the credentials in the request.
     * Returns 200 if successful, 401 otherwise.
     */
    async login({username, password}) {
        await axios.post('/user/login', {username, password});
    }


    /**
     * POST: /user/register
     * request: {
     *  username: string, required
     *  password: string, required
     *  email: string, required
     *  firstName: string
     *  lastName: string
     * }
     *
     * Registers the user with the given data.
     */
    async register({username, password, email, firstName, lastName}) {
        await axios.post('/user/register', {username, password, email, firstName, lastName});
    }

    async logout() {
        await axios.post('/user/logout');
    }

    getPosts({type, value}) {
        return {
            posts: [{
                id: "string",
                name: "string",
                body: "string",
                type: "enum, [demand, supply]",
                subject: "string",
                userId: "string",
                username: "string",
                createdAt: Date.now(),
                expiresAt: Date.now(),
            }]
        }
    }

    getPostById(id) {

    }

    createPost() {

    }
}