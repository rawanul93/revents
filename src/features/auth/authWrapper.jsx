import { connectedReduxRedirect } from 'redux-auth-wrapper/history4/redirect';
import { openModal } from '../modals/modalActions';

export const UserIsAuthenticated = connectedReduxRedirect({
    wrapperDisplayName: 'UserIsAuthenticated',
    allowRedirectBack: true, //we're not actually using these, but its not an optional parameter
    redirectPath: '/events',
    authenticatedSelector: ({ firebase: {auth}}) =>  //what we use to decide if user is authenticated or not.
        auth.isLoaded && !auth.isEmpty, //remember that this is connected to our redux store, so we have access to firebase state here.
    redirectAction: newLoc => (dispatch) => { //newLoc will have details as to where we redirect to which we set up above. However we wont be using that.
        dispatch(openModal('UnauthModal'))
    }
})