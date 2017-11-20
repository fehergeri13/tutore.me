import React from 'react';
import {inject, observer} from 'mobx-react';
import autobind from 'autobind-decorator';
import "./message.less";
import Modal from 'react-modal';

@inject('model')
@observer
export default class Message extends React.Component {


    render() {
        return <Modal
            isOpen={this.props.model.isMessageModalOpen}
            className={{base: 'message-modal'}}
            overlayClassName={{base: 'message-modal-overlay'}}
        >
            <h2>Üzenet küldése</h2>

            <form>
                hello bello
            </form>
        </Modal>
    }
}
