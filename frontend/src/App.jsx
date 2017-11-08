import React from 'react';


import "./app.less"
import Header from "./Header";

export default class App extends React.Component {
    render() {
        return <div className="app">
            <Header/>

            <div className="search">
                <input type="text" id="search-text" placeholder="keresés"/>

                <fieldset>
                    <label><input type="radio" name="contact" value="keres"/>Keres</label>
                    <label><input type="radio" name="contact" value="keres"/>Kínál</label>
                </fieldset>

                <fieldset>
                    <legend>
                        Tantárgy
                    </legend>
                    <label><input type="checkbox" name="contact" value="keres"/>Informatika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Matematika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Fizika</label>
                    <label><input type="checkbox" name="contact" value="keres"/>Kémia</label>
                </fieldset>
            </div>

            <div className="content">
                <ul>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                        <div className="time">2017. 11. 08. 23:16</div>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                        <div className="time">2017. 11. 08. 23:16</div>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                        <div className="time">2017. 11. 08. 23:16</div>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                        <div className="time">2017. 11. 08. 23:16</div>
                    </li>
                    <li>
                        <h2><a href="#">Matematika korrepetálás</a></h2>
                        <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Laudantium nisi perspiciatis voluptas. A aut consectetur deleniti, ea impedit laboriosam minima molestias non numquam, placeat tempore temporibus ullam. Itaque, provident quae?</p>
                        <div className="time">2017. 11. 08. 23:16</div>
                    </li>
                </ul>
            </div>
        </div>;
    }
}
