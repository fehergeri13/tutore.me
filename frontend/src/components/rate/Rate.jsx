import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS, computed} from 'mobx';
import autobind from 'autobind-decorator';
import "./rate.less";

@inject('model')
@observer
export default class Rate extends React.Component {
    @observable formData = {
        stars: 0,
        body: "",
    };

    constructor(props) {
        super(props);

        if(props.myRating !== undefined) {
            this.formData.stars = props.myRating.stars;
            this.formData.body = props.myRating.body;
        }
    }

    componentWillReceiveProps(nextProps) {
        if(nextProps.myRating !== undefined) {
            this.formData.stars = nextProps.myRating.stars.toString();
            this.formData.body = nextProps.myRating.body;
        }
    }

    @computed get isAlreadyRated() {
        return this.props.myRating !== undefined;
    }

    @autobind
    handleFormChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.formData[name] = value;

        console.log('postData', toJS(this.formData))
    }

    @autobind
    async handleFormSubmit(e) {
        e.preventDefault();

        try {

            const userId = this.props.targetUserId;
            const stars = parseInt(this.formData.stars);
            const body = this.formData.body;

            if(this.isAlreadyRated) {

                await this.props.model.rest.updateRating(this.props.myRating.id, stars, body);
            } else {

                await this.props.model.rest.sendRating(userId, stars, body);
            }

        } catch (e) {
            console.error(e);
            alert(JSON.stringify(e))
        }

        // this.props.model.routingStore.push('/user');
    }

    render() {
        return <form className="rating" onSubmit={this.handleFormSubmit}>
            <h3>{this.isAlreadyRated ? 'Értékelésem' : 'Értékelés írása'}</h3>

            <div className="stars">
                <input
                    className="star star-5"
                    id="star-5"
                    type="radio"
                    name="stars"
                    value="5"
                    checked={this.formData.stars === '5'}
                    onChange={this.handleFormChange}
                />

                <label className="star star-5" htmlFor="star-5"/>
                <input
                    className="star star-4"
                    id="star-4"
                    type="radio"
                    name="stars"
                    value="4"
                    checked={this.formData.stars === '4'}
                    onChange={this.handleFormChange}
                />
                <label className="star star-4" htmlFor="star-4"/>
                <input
                    className="star star-3"
                    id="star-3"
                    type="radio"
                    name="stars"
                    value="3"
                    checked={this.formData.stars === '3'}
                    onChange={this.handleFormChange}
                />
                <label className="star star-3" htmlFor="star-3"/>
                <input
                    className="star star-2"
                    id="star-2"
                    type="radio"
                    name="stars"
                    value="2"
                    checked={this.formData.stars === '2'}
                    onChange={this.handleFormChange}
                />
                <label className="star star-2" htmlFor="star-2"/>
                <input
                    className="star star-1"
                    id="star-1"
                    type="radio"
                    name="stars"
                    value="1"
                    checked={this.formData.stars === '1'}
                    onChange={this.handleFormChange}
                />
                <label className="star star-1" htmlFor="star-1"/>
            </div>

            <textarea
                name="body"
                value={this.formData.body}
                onChange={this.handleFormChange}
            />

            <button type="submit">
                {this.isAlreadyRated ? 'Értékelésem módosítása' : 'Értékelem'}
            </button>

        </form>
    }
}
