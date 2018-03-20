import React from "react";

import "./footer.less";

export default class Footer extends React.Component {
    // TODO http://www.uzletresz.hu/vallalkozas/20151120-impresszum-honlap-eloirasok-jog-elektronikus-kereskedelmi-torveny.html

    render() {
        return <div id="footer">
            <section>
                <h3>Mi ez?</h3>
                <p>
                    Ez egy faék egyszerűségű korrepetálást hirdető oldal. <br/>

                    Főleg egyetemistáknak készült,
                    hogy könnyen és ingyen tudjanak feladni hirdetéseket, de bárki használhatja.<br/>

                    Ha korrepetálni szeretnél, bátran adj fel egy hirdetést,
                    és itt meg fog jelenni egy hónapon keresztül. <br/>

                    Ha bármi kérdésed van, írj a site.tutore.me@gmail.com címre! <br/>
                </p>
            </section>

            <section>
                <h3>Szabályok</h3>
                <ul>
                    <li>A feladott hirdetéseket ellenőrzöm, és csak utána kerül ki ide.</li>
                    <li>A nem megfelelő nyelvű hirdetéseket nem jelenítem meg, szóval ilyet fel se adj!</li>
                    <li>A hirdetés 1 hónapon keresztül lesz elérhető, utána automatikusan törlődik, meghosszabbítani nem lehet.</li>
                    <li>A hirdetés címe és szövege publikus lesz, az email címet titkosan kezelem, a megerősítésen kívül semmire nem használom fel, nem adom ki harmadik félnek.</li>
                </ul>
            </section>

            <section>
                <h3>Kapcsolat</h3>
                <p>
                    A bármi probléma vagy kérdés van, írj a info.tutore.me@gmail.com címre.
                </p>
            </section>
        </div>
    }
}