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
        return (await (axios.post('/user/login', {username, password}))).data;
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

    /**
     * GET: /user/logout
     *
     * Logs out the current user.
     */
    async logout() {
        await axios.get('/user/logout');
    }

    /**
     * GET: /user/list
     * response: {
     *  users: [{
     *   id: string
     *   username: string
     *   email: string
     *   registeredAt: string
     *   lastLoginAt: string, optional
     *  }]
     * }
     *
     * Lists the registered users (admin function).
     */
    async getAllUser() {
        return await axios.get(`/user/list`);
    }


    /**
     * GET: /user/:id
     * response: {
     *  username: string
     *  registeredAt: date
     *  email: string, optional
     *  lastName: string, optional
     *  firstName: string, optional
     * }
     *
     * Returns the user data for the given id.
     */
    async getUser(userId) {
        return (await axios.get(`/user/${userId}`)).data;
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