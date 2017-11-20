import React from 'react';
import {observable, toJS} from 'mobx';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./message.less";
import Modal from 'react-modal';

@inject('model')
@observer
export default class Message extends React.Component {

    @observable.shallow data = {
        message: "",
    };

    @autobind
    handleChange(e) {
        const target = e.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.data[name] = value;

        console.log('loginData', toJS(this.data))
    }

    @autobind
    handleSubmit(e) {
        e.preventDefault();

        this.props.model.rest.sendMessage(this.props.model.messagePost.userId, this.data.message);
    }

    @autobind
    handleCancelClick(e) {
        e.preventDefault();

        this.props.model.closeMessageModal();
    }

    render() {
        if(!this.props.model.isMessageModalOpen) {
            return null;
        }

        return <Modal
            isOpen={this.props.model.isMessageModalOpen}
            className={{
                base: 'message-modal',
                afterOpen: 'myClass_after-open',
                beforeClose: 'myClass_before-close',
            }}
            overlayClassName={{
                base: 'message-modal-overlay',
                afterOpen: 'myOverlayClass_after-open',
                beforeClose: 'myOverlayClass_before-close',
            }}
        >
            <h2>Üzenet küldése</h2>

            <form onSubmit={this.handleSubmit}>
                <input
                    type="text"
                    value={this.props.model.messagePost.username}
                    readOnly
                    />
                <input
                    type="text"
                    name="message"
                    onChange={this.handleChange}
                    value={this.data.message}
                />
                <button
                type="submit">
                    Küld
                </button>
                <button
                    type="button"
                    onClick={this.handleCancelClick}
                >Mégsem küldök üzenetet</button>
            </form>
        </Modal>
    }
}
