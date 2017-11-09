import React from 'react';
import "./create.less"
import Header from "../../components/header/Header";

export default class Create extends React.Component {
    render() {
        return <div className="create-page">
            <div className="creator">
                <h2>Új hirdetés felvétele</h2>

                <form>
                    <label className="title"><span>Hirdetés neve</span><input type="text"/></label>
                    <label className="text"><span>Hirdetés szövege</span>
                        <textarea defaultValue="Valami szöveg"/>
                    </label>

                    <fieldset className="type">
                        <legend>Típus</legend>
                        <label><input type="radio" name="contact" value="keres"/><span>Keres</span></label>
                        <label><input type="radio" name="contact" value="keres"/><span>Kínál</span></label>
                    </fieldset>

                    <fieldset className="subject">
                        <legend>Tantárgy</legend>
                        <label><input type="checkbox" name="contact" value="keres"/><span>Informatika</span></label>
                        <label><input type="checkbox" name="contact" value="keres"/><span>Matematika</span></label>
                        <label><input type="checkbox" name="contact" value="keres"/><span>Fizika</span></label>
                        <label><input type="checkbox" name="contact" value="keres"/><span>Kémia</span></label>
                    </fieldset>

                    <div className="buttons">
                        <button>Törlés</button>
                        <button>Mentés</button>
                    </div>
                </form>
            </div>

        </div>;
    }
}
