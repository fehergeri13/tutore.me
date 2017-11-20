import React from 'react';
import {observable, toJS} from 'mobx';
import {observer, inject} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./editor.less";

@inject('model')
@observer
export default class Editor extends React.Component {

    async componentDidMount() {
        if (this.props.id !== undefined) {
            this.isLoading = true;

            const post = await this.props.model.rest.getPost(this.props.id);
            const keys = Object.keys(toJS(this.postData));

            keys.forEach(key => {
                this.postData[key] = post[key];
            });

            this.isLoading = false;
        }
    }

    @observable isLoading = false;

    @observable postData = {
        name: "",
        body: "",
        type: "",
        subject: [],
    };

    @autobind
    handleFormChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.postData[name] = value;

        console.log('postData', toJS(this.postData))
    }

    @autobind
    handleMultiCheckboxChange(e) {
        const target = e.target;
        const checked = target.checked;
        const value = target.value;
        const name = target.name;

        if (checked) {
            this.postData[name].push(value);
        } else {
            this.postData[name].remove(value);
        }

        console.log('postData', toJS(this.postData));
    }

    @autobind
    async handleFormSubmit(e) {
        e.preventDefault();

        try {
            if (this.props.id === undefined) {
                await this.props.model.rest.createPost(toJS(this.postData));
            } else {
                const data = {
                    id: this.props.id,
                    ...toJS(this.postData),
                };

                await this.props.model.rest.updatePost(data);
            }
        } catch (e) {
            console.error(e);
            alert(JSON.stringify(e))
        }

        this.props.model.routingStore.push('/user');
    }

    @autobind
    handleClearClick(e) {
        e.preventDefault();

        this.postData = {
            name: "",
            body: "",
            type: "",
            subject: [],
        };
    }

    renderForm() {
        if(this.isLoading) {
            return <h3>Adatok betöltése...</h3>
        }

        return <form onSubmit={this.handleFormSubmit}>
            <label className="title">
                <span>Hirdetés neve</span>
                <input
                    type="text"
                    name="name"
                    onChange={this.handleFormChange}
                    value={this.postData.name}
                />
            </label>
            <label className="text"><span>Hirdetés szövege</span>
                <textarea
                    name="body"
                    onChange={this.handleFormChange}
                    value={this.postData.body}
                />
            </label>

            <fieldset className="type">
                <legend>Típus</legend>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="demand"
                        checked={this.postData.type === 'demand'}
                        onChange={this.handleFormChange}
                    />
                    <span>Keres</span>
                </label>
                <label>
                    <input
                        type="radio"
                        name="type"
                        value="supply"
                        checked={this.postData.type === 'supply'}
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
                        checked={this.postData.subject.includes('informatika')}
                    />
                    <span>Informatika</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="subject"
                        value="matematika"
                        onChange={this.handleMultiCheckboxChange}
                        checked={this.postData.subject.includes('matematika')}
                    />
                    <span>Matematika</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="subject"
                        value="fizika"
                        onChange={this.handleMultiCheckboxChange}
                        checked={this.postData.subject.includes('fizika')}
                    />
                    <span>Fizika</span>
                </label>
                <label>
                    <input
                        type="checkbox"
                        name="subject"
                        value="kemia"
                        onChange={this.handleMultiCheckboxChange}
                        checked={this.postData.subject.includes('kemia')}
                    />
                    <span>Kémia</span>
                </label>
            </fieldset>

            <div className="buttons">
                <button type="button" onClick={this.handleClearClick}>Törlés</button>
                <button type="submit">Mentés</button>
            </div>
        </form>;
    }

    render() {
        return <div className="editor-page">
            <div className="editor">
                <h2>Új hirdetés felvétele</h2>


                {this.renderForm()}
            </div>

        </div>;
    }
}
