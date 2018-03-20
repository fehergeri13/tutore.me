import React from "react";

import "./header.less";

export default class Header extends React.Component {
    render() {
        return <div className="header">
            <h1>TUTORE.ME - Korrepetálás hirdetés</h1>
            <p>
                Ingyenes korrepetálás hirdetés!
                <a href="#hirdetesek">Hirdetések</a>
                <a href="#feladas">Hirdetés feladás</a>
            </p>
        </div>
    }
}