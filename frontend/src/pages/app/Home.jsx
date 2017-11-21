import React from 'react';
import {observable, toJS, computed} from 'mobx';
import {observer, inject} from 'mobx-react';
import "./home.less"
import PostItem from "../../components/post/PostItem";
import autobind from 'autobind-decorator';

@inject('model')
@observer
export default class Home extends React.Component {

    @observable.shallow allPosts = [];

    @observable filter = {
        text: "",
        type: 'all',
        subject: [],
    };

    @computed get filteredPosts() {
        return this.allPosts.filter(post => {
            const isTextMatch =
                this.filter.text === "" ||
                post.name.toLowerCase().includes(this.filter.text.toLowerCase()) ||
                post.body.toLowerCase().includes(this.filter.text.toLowerCase()) ||
                post.username.toLowerCase().includes(this.filter.text.toLowerCase());

            const isTypeMatch =
                this.filter.type === 'all' ||
                post.type === this.filter.type;

            const isSubjectMatch =
                this.filter.subject.length === 0 ||
                this.filter.subject.some(subj => post.subject.includes(subj));

            return isTextMatch && isTypeMatch && isSubjectMatch;
        });
    }

    @autobind
    handleFormChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.filter[name] = value;
    }

    @autobind
    handleMultiCheckboxChange(e) {
        const target = e.target;
        const checked = target.checked;
        const value = target.value;
        const name = target.name;

        if (checked) {
            this.filter[name].push(value);
        } else {
            this.filter[name].remove(value);
        }

        console.log('filter', toJS(this.filter));
    }

    async componentDidMount() {
        const response = await this.props.model.rest.getPosts();
        this.allPosts.replace(response.posts);
    }

    renderPosts() {
        if (this.filteredPosts.length === 0) {
            return <h2>Nincs hirdetés</h2>
        }

        return <ul>
            {this.filteredPosts.map(post => <li key={post.id}><PostItem post={post} isControl={false}/></li>)}
        </ul>;
    }

    render() {
        return <div className="home-page">
            <div className="search">
                <input
                    type="text"
                    id="search-text"
                    placeholder="Szövegre keresés"
                    name="text"
                    onChange={this.handleFormChange}
                    value={this.filter.text}
                />

                <fieldset className="type">
                    <legend>Típus</legend>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="all"
                            checked={this.filter.type === 'all'}
                            onChange={this.handleFormChange}
                        />
                        <span>Mindkettő</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="demand"
                            checked={this.filter.type === 'demand'}
                            onChange={this.handleFormChange}
                        />
                        <span>Keres</span>
                    </label>
                    <label>
                        <input
                            type="radio"
                            name="type"
                            value="supply"
                            checked={this.filter.type === 'supply'}
                            onChange={this.handleFormChange}
                        />
                        <span>Kínál</span>
                    </label>
                </fieldset>

                <fieldset className="subject">
                    <legend>Tantárgy</legend>
                    <label>
                        <input
                            type="checkbox"
                            name="subject"
                            value="informatika"
                            onChange={this.handleMultiCheckboxChange}
                            checked={this.filter.subject.includes('informatika')}
                        />
                        <span>Informatika</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="subject"
                            value="matematika"
                            onChange={this.handleMultiCheckboxChange}
                            checked={this.filter.subject.includes('matematika')}
                        />
                        <span>Matematika</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="subject"
                            value="fizika"
                            onChange={this.handleMultiCheckboxChange}
                            checked={this.filter.subject.includes('fizika')}
                        />
                        <span>Fizika</span>
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            name="subject"
                            value="kemia"
                            onChange={this.handleMultiCheckboxChange}
                            checked={this.filter.subject.includes('kemia')}
                        />
                        <span>Kémia</span>
                    </label>
                </fieldset>
            </div>

            <div className="content">
                {this.renderPosts()}
            </div>
        </div>;
    }
}
