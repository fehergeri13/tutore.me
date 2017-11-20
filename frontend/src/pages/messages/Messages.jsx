import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {observable, toJS} from 'mobx';

import "./messages.less"

@inject('model')
@observer
export default class Messages extends React.Component {

    @observable.shallow topics = [];

    async componentDidMount() {

        const topics = await this.props.model.rest.getMessageTopics();
        this.topics.replace(topics);

        console.log(toJS(this.topics));
    }

    render() {
        return <div className="messages-page">
            <div className="left">
                <ul className="conservations">
                    <li>
                        <img/>
                        <div className="name">Fülöp Farkas</div>
                        <div className="last-message">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias amet asperiores </div>
                    </li>
                    <li>
                        <img/>
                        <div className="name">Gipsz Józsi</div>
                        <div className="last-message">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias amet asperiores </div>
                    </li>
                    <li>
                        <img/>
                        <div className="name">Lellei Lilla</div>
                        <div className="last-message">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Ad alias amet asperiores </div>
                    </li>
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
