import React from 'react';


import "./login.less"
import Header from "../../components/header/Header";

export default class App extends React.Component {
    render() {
        return <div className="loginpage">
            <Header/>

            <div className="login">
                <h2>Bejelentkezés</h2>

                <form>
                    <label><span>Felhasználónév</span><input type="text" /></label>
                    <label><span>Jelszó</span><input type="password" /></label>
                    <label><span>Emlékezz rám</span><input type="checkbox"/></label>
                    <button type="submit">Belépés</button>
                </form>
            </div>

            <div className="register">
                <h2>Regisztráció</h2>

                <form>
                    <label><span>Felhasználónév</span><input type="text" /></label>
                    <label><span>Email</span><input type="text" /></label>
                    <label><span>Jelszó</span><input type="password" /></label>
                    <label><span>Jelszó megerősítése</span><input type="password" /></label>
                    <button type="submit">Regisztrálás</button>
                </form>
            </div>
        </div>;
    }
}
