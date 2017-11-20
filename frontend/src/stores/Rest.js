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


    /**
     * GET: /post/list
     * request: {
     *  filters: [{
     *   type: enum, [subject, type], required
     *   value: string, required
     *  }]
     * }
     * response: {
     *  posts: [{
     *   id: string
     *   name: string
     *   body: string
     *   type: enum, [demand, supply]
     *   subject: string
     *   userId: string
     *   username: string
     *   createdAt: date
     *   expiresAt: date
     *  }]
     * }
     *
     * Lists all available posts with the given filters.
     */
    async getPosts() {
        return (await axios.get('/post/list')).data;
    }

    /**
     * GET: /post/:id
     * response: {
     *  id: string
     *  name: string
     *  body: string
     *  type: enum, [demand, supply]
     *  subject: string
     *  userId: string
     *  username: string
     *  createdAt: date
     *  expiresAt: date
     * }
     *
     * Returns the post with the given id or 400 in case of
     * any error.
     */
    async getPost(postId) {
        return (await axios.get(`/post/${postId}`)).data;
    }


    /**
     * POST: /post/
     * request: {
     *  name: string, required
     *  body: string, required
     *  type: enum, [demand, supply], required
     *  subject: string, required
     * }
     *
     * Creates a new post for the logged in user. Returns
     * 200 in case of success, 400 otherwise.
     */
    async createPost({name, body, type, subject}) {
        await axios.post('/post/', {name, body, type, subject});
    }


    /**
     * PUT: /post/:id
     * request: {
     *  name: string, required
     *  body: string, required
     *  type: enum, [demand, supply], required
     *  subject: string, required
     * }
     *
     * Updates the given post. Returns 200 in
     * case of success, 400 otherwise.
     */
    async updatePost({id, name, body, type, subject}) {
        await axios.put(`/post/${id}`, {name, body, type, subject});
    }

    /**
     * POST: /message/
     * request: {
     *  to: string, required
     *  message: string, required
     * }
     *
     * Creates a messages to the given user.
     * Return 200 in case of success, 400 otherwise.
     */
    async sendMessage(userId, message) {
        await axios.post(`/message/`, {to: userId, message});
    }
}