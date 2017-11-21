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

    async componentDidMount() {

        const topics = await this.props.model.rest.getMessageTopics();
        this.topics.replace(topics);

        if(this.topics.length > 0) {
            this.selectedTopic = 0;

            const currentTopic = this.topics[this.selectedTopic];
            const messages = await this.props.model.rest.getMessagesWithUser(currentTopic.user.userId);
            this.messages.replace(messages);
        }

        console.log(toJS(this.topics));
    }

    @autobind
    handleSelectTopic(index) {
        this.selectedTopic = index;
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
                    <li className="sent">
                        <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias amet asperiores </span>
                    </li>
                    <li className="received">
                        <span>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias amet asperiores </span>
                    </li>
                    <li className="received">
                        <span>:D</span>
                    </li>
                    <li className="sent">
                        <span>Hablaka dabla abrak abra abbra</span>
                    </li>
                    <li className="sent">
                        <span>Wtf?</span>
                    </li>
                    <li className="sent">
                        <span>Ok</span>
                    </li>
                </ul>
            </div>
        </div>;
    }
}
