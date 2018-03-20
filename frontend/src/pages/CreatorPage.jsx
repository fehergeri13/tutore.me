import React from "react";
import autobind from "autobind-decorator";

import "./creator.less";
import {computed, observable} from "mobx";
import {observer, inject} from "mobx-react";

import Recaptcha from "react-recaptcha";

@inject("model")
@observer
export default class CreatorPage extends React.Component {

    @observable title = "Ez az első korrepetálás hirdetés";
    @observable body = "Korrepetálást tartok egyetemistáknak, akik érdekeltek programozásban";
    @observable email = "fehergeri13@gmail.com";
    @observable reCaptchaResponse = undefined;

    @observable isValidate = false;
    @observable isSubmitted = false;

    @observable isSending = false;
    @observable isSent = false;

    @autobind
    async handleSubmit(e) {
        e.preventDefault();
        this.isValidate = true;

        if (this.errors.length === 0) {
            this.isSending = true;

            await this.props.model.rest.createPost(this.title, this.body, this.email, this.reCaptchaResponse);

            this.isSending = false;
            this.isSent = true;
        }
    }

    @autobind
    handleTitleChange(e) {
        this.title = e.target.value;
    }

    @autobind
    handleBodyChange(e) {
        this.body = e.target.value;
    }

    @autobind
    handleEmailChange(e) {
        this.email = e.target.value;
    }

    @autobind
    handleLoad() {
        console.log("reCaptcha loaded");
    }

    @autobind
    handleVerify(response) {
        this.reCaptchaResponse = response;
    }

    @autobind
    handleExpire() {
        this.reCaptchaResponse = undefined;
    }

    @computed get errors() {
        if (!this.isValidate) {
            return [];
        }

        const errors = [];

        if (this.title === "") {
            errors.push("A címet töltsd ki!");
        } else if (this.title.length < 5) {
            errors.push("Túl rövidnek tűnik a cím, kérlek írj egy jobbat! (legalább 5 karakter)");
        }

        if (this.body === "") {
            errors.push("A szöveget töltsd ki!")
        } else if (this.body.length < 20) {
            errors.push("Túl rövidnek tűnik a szöveg, kérlek írj egy jobbat! (legalább 20 karater)");
        }

        if (this.email === "") {
            errors.push("Az email címet töltsd ki!");
        }

        if (this.reCaptchaResponse === undefined) {
            errors.push("Töltsd ki az ellenőrzőt!");
        }

        return errors;
    }

    render() {
        if(this.isSending) {
            return <div id="feladas">
                <h2>Hirdetés küldése folyamatban... </h2>
                <div className="loader"/>
            </div>;
        }

        if(this.isSent) {
            return <div id="feladas">
                <h2>Hirdetés elküldve!</h2>
            </div>;
        }

        return <div id="feladas">
            <h2>Hirdetés feladása</h2>

            <form className="vflex" onSubmit={this.handleSubmit}>
                <label className="title">
                    <span>Cím:</span>
                    <input type="text" onChange={this.handleTitleChange} value={this.title}/>
                </label>

                <label className="body">
                    <span>Szöveg:</span>
                    <textarea onChange={this.handleBodyChange} value={this.body}/>
                </label>

                <label className="email">
                    <span>Email cím:</span>
                    <input type="text" onChange={this.handleEmailChange} value={this.email}/>
                </label>

                {this.errors.length > 0 && <ul className="errors">
                    {this.errors.map((error, index) => <li key={index}>{error}</li>)}
                </ul>}

                <Recaptcha
                    render="explicit"
                    sitekey={RE_CAPTCHA_SITE_KEY}
                    verifyCallback={this.handleVerify}
                    onloadCallback={this.handleLoad}
                    expiredCallback={this.handleExpire}
                />


                <button type="submit">Küldés</button>
            </form>
        </div>
    }
}