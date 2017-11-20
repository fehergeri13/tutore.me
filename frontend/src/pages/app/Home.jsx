import React from 'react';
import {observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import "./home.less"
import PostItem from "../../components/post/PostItem";
import Modal from 'react-modal';

@inject('model')
@observer
export default class Home extends React.Component {

    @observable.shallow allPosts = [];

    async componentDidMount() {
        const response = await this.props.model.rest.getPosts();
        this.allPosts.replace(response.posts);

        console.log('this.allPosts', toJS(this.allPosts));
    }

    renderPosts() {
        if (this.allPosts.length === 0) {
            return <h2>Nincs hirdetés</h2>
        }

        return <ul>
            {this.allPosts.map(post => <li key={post.id}><PostItem post={post} isControl={false}/></li>)}
        </ul>;
    }

    render() {
        return <div className="home-page">
            <div className="search">
                <input type="text" id="search-text" placeholder="keresés"/>

                <fieldset>
                    <label><input type="radio" name="contact" value="keres"/>Keres</label>
                    <label><input type="radio" name="contact" value="keres"/>Kínál</label>
                </fieldset>

                <fieldset>
                    <legend>
                        Tantárgy
                    </legend>
                    <label><input type="checkbox" name="contact" value="keres"/>Informatika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Matematika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Fizika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Kémia</label>
                </fieldset>
            </div>

            <div className="content">
                {this.renderPosts()}
            </div>
        </div>;
    }
}
