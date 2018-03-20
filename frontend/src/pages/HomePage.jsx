import React from "react";
import {inject, observer} from "mobx-react";
import {observable} from "mobx";
import {format} from 'date-fns'
import moment from "moment";

import "./posts.less";

@inject("model")
@observer
export default class HomePage extends React.Component {

    @observable isLoading = false;

    async componentDidMount() {
        this.isLoading = true;
        this.posts = await this.props.model.rest.getAllPost();
        this.isLoading = false;
    }

    @observable posts = [];

    renderPosts() {
        if (this.isLoading) {
            return <div className="loader"/>
        }

        if (this.posts.length === 0) {
            return <p>Nincs jelenleg aktív hirdetés.</p>
        }

        return this.posts.map(post => <div className="post" key={post._id}>
            <h3 className="title">{post.title}</h3>
            <div className="body">{post.body}</div>
            <div className="timestamp">Feladva: {moment(post.timestamp).format("YYYY MMMM DD. HH:mm")}</div>
        </div>)
    }

    render() {
        return <div className="posts" id="hirdetesek">
            <h2>Hirdetések</h2>
            {this.renderPosts()}
        </div>
    }
}