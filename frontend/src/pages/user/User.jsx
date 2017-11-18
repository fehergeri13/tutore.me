import React from 'react';
import {inject, observer} from 'mobx-react';

import "./user.less"

@inject('model')
@observer
export default class App extends React.Component {


    async componentDidMount() {
        const users = await this.props.model.rest.logout();
        alert(users);
    }

    render() {
        return <div className="user-page">
            <div className="profile">
                <img src="" alt=""/>

                <div className="data">
                    <div className="name">Név <span>Gipsz Jakab</span><button>🖉</button></div>
                    <div className="email">Email <span>gipsz.jakab@gmail.com</span><button>🖉</button></div>
                    <div className="address">Lakhely <span>1112 Budapest, Tudósok körútja 1.</span><button>🖉</button></div>
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
