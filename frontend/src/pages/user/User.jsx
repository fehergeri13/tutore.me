import React from 'react';
import {inject, observer} from 'mobx-react';
import {observable, toJS} from 'mobx';

import "./user.less"

@inject('model')
@observer
export default class User extends React.Component {

    @observable.ref user = undefined;

    async componentDidMount() {
        const userId = this.props.model.auth.userId;
        this.user = await this.props.model.rest.getUser(userId);
        console.log(toJS(this.user));
    }

    render() {
        if (this.user === undefined) {
            return null;
        }

        return <div className="user-page">
            <div className="profile">
                <img src="" alt=""/>

                <div className="data">
                    <div className="firstName">Vezetéknév: <span>{this.user.firstName}</span></div>
                    <div className="lastName">Keresztnév: <span>{this.user.lastName}</span></div>
                    <div className="email">Email: <span>{this.user.email}</span></div>
                </div>

                <div className="feedbacks">
                    <h2>Rólam írták</h2>

                    <ul>
                        <li>
                            <p>Nagyon király, 10/10</p>
                            <div className="stars">★★★★★</div>
                        </li>
                        <li>
                            <p>Egész jó!</p>
                            <div className="stars">★★★★☆</div>
                        </li>
                    </ul>
                </div>
            </div>

            <div className="userfeed">
                <h2>Hirdetéseim</h2>
                <ul>
                    <li>
                        <div className="ad">
                            <h2><a href="#">Matematika korrepetálás</a></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                            <div className="time">2017. 11. 08. 23:16</div>
                        </div>
                        <div className="actions">
                            <button>Szerkesztés</button>
                            <button>Törlés</button>
                            <button>Meghosszabbítás</button>
                        </div>
                    </li>
                    <li>
                        <div className="ad">
                            <h2><a href="#">Matematika korrepetálás</a></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                            <div className="time">2017. 11. 08. 23:16</div>
                        </div>
                        <div className="actions">
                            <button>Szerkesztés</button>
                            <button>Törlés</button>
                            <button>Meghosszabbítás</button>
                        </div>
                    </li>
                    <li>
                        <div className="ad">
                            <h2><a href="#">Matematika korrepetálás</a></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                            <div className="time">2017. 11. 08. 23:16</div>
                        </div>
                        <div className="actions">
                            <button>Szerkesztés</button>
                            <button>Törlés</button>
                            <button>Meghosszabbítás</button>
                        </div>
                    </li>
                    <li>
                        <div className="ad">
                            <h2><a href="#">Matematika korrepetálás</a></h2>
                            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                            <div className="time">2017. 11. 08. 23:16</div>
                        </div>
                        <div className="actions">
                            <button>Szerkesztés</button>
                            <button>Törlés</button>
                            <button>Meghosszabbítás</button>
                        </div>
                    </li>


                </ul>
            </div>
        </div>;
    }
}
