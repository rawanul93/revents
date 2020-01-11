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

    if(currentModal) { //if a modal is in our state then it will render a modal. But suppose when we dispatch the closeModal action, we make the state=null. So nothing will render and if a modal was open, it will be gone.
        const { modalType, modalProps } = currentModal;
        const ModalComponent = modalLookUp[modalType] //object notation where when the modalType matches with whatever value is inside the modalLookUp object, it will assign that component to the ModalComponent
        
        renderedModal = <ModalComponent {...modalProps}/>
    }
    return (
     <span>{renderedModal}</span>
    )
}

export default connect(mapState, null)(ModalManager);
