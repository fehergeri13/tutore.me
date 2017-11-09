import React from 'react';
import "./messages.less"
import Header from "../../components/header/Header";

export default class Messages extends React.Component {
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
