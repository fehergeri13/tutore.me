import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {observable, toJS} from 'mobx';
import classnames from 'classnames';

import "./messages.less"

@inject('model')
@observer
export default class Messages extends React.Component {

    @observable.shallow topics = [];

    @observable selectedTopic = -1;

    @observable.shallow messages = [];

    @observable newMessage = "";

    async componentDidMount() {
        await this.getTopics();
    }

    async getTopics() {
        const topics = await this.props.model.rest.getMessageTopics();
        this.topics.replace(topics);

        if (this.topics.length > 0 && this.selectedTopic === -1) {
            this.selectedTopic = 0;

            await this.getMessages();
        }
    }

    async getMessages() {
        const currentTopic = this.topics[this.selectedTopic];
        const currentUserId = currentTopic.user.userId;
        const messages = await this.props.model.rest.getMessagesWithUser(currentUserId);
        this.messages.replace(messages);
    }

    @autobind
    async handleSelectTopic(index) {
        this.selectedTopic = index;

        await this.getMessages();
    }

    @autobind
    handleMessageChange(e) {
        this.newMessage = e.target.value;
    }

    @autobind
    async handleNewMessageSubmit(e) {
        e.preventDefault();

        const currentTopic = this.topics[this.selectedTopic];
        const currentUserId = currentTopic.user.userId;

        const message = this.newMessage;
        this.newMessage = "";

        await this.props.model.rest.sendMessage(currentUserId, message);

        this.getMessages();
        this.getTopics();
    }

    render() {
        return <div className="messages-page">
            <div className="left">
                <ul className="conservations">

                    {this.topics.map((topic, index) => <li
                        key={index}
                        className={classnames(index === this.selectedTopic && 'selected')}
                        onClick={() => this.handleSelectTopic(index)}
                    >
                        <div className="name">{topic.user.username}</div>
                        <div className="last-message">{topic.lastMessage.body}</div>
                    </li>)}
                </ul>
            </div>

            <div className="right">
                <ul className="messages">
                    {this.messages.map((message, index) => <li className={message.received ? "received" : "sent"} key={index}>
                        <span>{message.message}</span>
                    </li>)}
                </ul>
                <form
                    className="new-message"
                    onSubmit={this.handleNewMessageSubmit}
                >
                    <input
                        type="text"
                        value={this.newMessage}
                        onChange={this.handleMessageChange}
                    />
                    <button type="submit">Küld</button>
                </form>
            </div>
        </div>;
    }
}
