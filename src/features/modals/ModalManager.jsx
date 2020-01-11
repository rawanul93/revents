import React from 'react'
import {connect} from 'react-redux';
import TestModal from './TestModal';
import LoginModal from './LoginModal';
import RegisterModal from './RegisterModal';

const modalLookUp = {
    TestModal,
    LoginModal,
    RegisterModal
}

const mapState = (state) => ({
    currentModal: state.modals
})


const ModalManager = ({ currentModal }) => {
    let renderedModal; //just declaring

    if(currentModal) {
        const { modalType, modalProps } = currentModal;
        const ModalComponent = modalLookUp[modalType] //object notation where when the modalType matches with whatever value is inside the modalLookUp object, it will assign that component to the ModalComponent
        
        renderedModal = <ModalComponent {...modalProps}/>
    }
    return (
     <span>{renderedModal}</span>
    )
}

export default connect(mapState, null)(ModalManager);
