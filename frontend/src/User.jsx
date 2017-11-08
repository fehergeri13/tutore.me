import React from 'react';


import "./login.less"
import Header from "./Header";

export default class App extends React.Component {
    render() {
        return <div className="userpage">
            <Header/>

            <div className="left">
                <img src="" alt=""/>

                <div className="data">
                    <div className="name">Név</div>
                    <div className="email">Email</div>
                    <div className="address">Lakhely</div>
                </div>

                <div className="feedbacks">
                    <div className="feedback">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At consectetur cupiditate dolores doloribus est expedita fuga ipsa ipsam iure, iusto labore neque, officia porro praesentium quas saepe sunt vitae, voluptatum.</p>
                    </div>
                    <div className="feedback">
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. At consectetur cupiditate dolores doloribus est expedita fuga ipsa ipsam iure, iusto labore neque, officia porro praesentium quas saepe sunt vitae, voluptatum.</p>
                    </div>
                </div>
            </div>

            <div className="right">

            </div>
        </div>;
    }
}
