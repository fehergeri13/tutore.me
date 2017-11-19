import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import {observable, toJS} from 'mobx';

import "./logout.less"


@inject('model')
@observer
export default class Logout extends React.Component {

    componentDidMount() {
        this.props.model.auth.doLogout();
    }

    render() {
        return <div className="logout-page">
            <h2>Logging out...</h2>
        </div>;
    }
}
