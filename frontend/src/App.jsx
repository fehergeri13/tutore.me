import React from 'react';


import "./app.less"

export default class App extends React.Component {
    render() {
        return <div className="app">
            <div className="header">
                <h1>tutore.me</h1>

                <div className="nav">
                    <a href="#">Hirdetések</a>
                    <a href="#">Új hirdetés</a>
                </div>

                <div className="user">
                    <a href="#">Üzenetek</a>
                    <a href="#">Profilom</a>
                    <a href="#">Kilépés</a>
                </div>
            </div>

            <div className="search">
                <input type="text" id="search-text" placeholder="keresés"/>

                <fieldset>
                    <label>Keres<input type="radio" name="contact" value="keres"/></label>
                    <label>Kínál<input type="radio" name="contact" value="keres"/></label>
                </fieldset>

                <fieldset>
                    <legend>
                        Tantárgy
                    </legend>
                    <label>informatika<input type="checkbox" name="contact" value="keres"/></label>
                    <label>Matematika<input type="checkbox" name="contact" value="keres"/></label>
                    <label>Fizika<input type="checkbox" name="contact" value="keres"/></label>
                    <label>Kémia<input type="checkbox" name="contact" value="keres"/></label>
                </fieldset>
            </div>

            <div className="content">
                <ul>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                    </li>
                </ul>
            </div>
        </div>;
    }
}
