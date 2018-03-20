const ReactDOMServer = require('react-dom/server');
const React = require("react");

// const renderEmailTemplate = (title, body, link) => {
//     return ReactDOMServer.renderToString(
//         <div>
//             <p>
//                 Szia!
//                 A <a href="http://tutore.me">tutore.me</a> oldalon regisztráltál egy korrepetálás hirdetést. <br/>
//                 Ha tényleg te adtad fel a hirdetést, kérlek erősítsd meg az igazoló linkkel. <br/>
//                 Ha nem te voltál, nincs semmi teendőd, a hirdetést automatikusan töröljük az adatbázisból. <br/>
//             </p>
//             <h1>{title}</h1>
//             <p>{body}</p>
//             <br/>
//             <br/>
//             <p>
//                 A megerősítéshez kattints a linkre:
//                 <a href={link}>{link}</a>
//             </p>
//         </div>
//     );
// };


"use strict";

const renderEmailTemplate = function renderEmailTemplate(title, body, link) {
    return ReactDOMServer.renderToString(React.createElement(
        "div",
        null,
        React.createElement(
            "p",
            null,
            "Szia! A ",
            React.createElement(
                "a",
                { href: "http://tutore.me" },
                "tutore.me"
            ),
            " oldalon regisztr\xE1lt\xE1l egy korrepet\xE1l\xE1s hirdet\xE9st. ",
            React.createElement("br", null),
            "Ha t\xE9nyleg te adtad fel a hirdet\xE9st, k\xE9rlek er\u0151s\xEDtsd meg az igazol\xF3 linkkel. ",
            React.createElement("br", null),
            "Ha nem te volt\xE1l, nincs semmi teend\u0151d, a hirdet\xE9st automatikusan t\xF6r\xF6lj\xFCk az adatb\xE1zisb\xF3l. ",
            React.createElement("br", null)
        ),
        React.createElement(
            "h1",
            null,
            title
        ),
        React.createElement(
            "p",
            null,
            body
        ),
        React.createElement("br", null),
        React.createElement("br", null),
        React.createElement(
            "p",
            null,
            "A meger\u0151s\xEDt\xE9shez kattints a linkre:",
            React.createElement(
                "a",
                { href: link },
                link
            )
        )
    ));
};

module.exports = renderEmailTemplate;