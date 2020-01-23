import { createStore, applyMiddleware } from "redux";
import rootReducer from "../reducers/rootReducer";
import { composeWithDevTools } from 'redux-devtools-extension';
import thunk from "redux-thunk";
import firebase from '../config/firebase'; //getting firebase with our custom config
import {reduxFirebase, getFirestore, reduxFirestore} from 'redux-firestore'
import { reactReduxFirebase, getFirebase } from "react-redux-firebase";
// getFirebase allows us to get an instance of our firebase inside our actions. Once we have access to our firebase instance we'll have acess to the firebase API. Which means we can update/delete/add etc.




const rrfConfig = { //giving react redux firestore some configuration.  
    userProfile: 'users', // so when we create a new user inside firebase, then the user will have a userProfile and we want the collection ('table') to be called users.
    attachAuthIsReady: true, //this allows us to wait until the authentication is ready before we go and render something in our app.
    useFirestoreForProfile: true,// this will tell our configuration that when we do have a user profile for a user who has just registered, then we'll store that in firestore and not firebase ( which is the default location). 
    updateProfileOnLogin: false //this makes sure that when we login with Social, we're not updating that user's document with ALL the information that social login provides. Because social logins comes with a lot of other information about the user that we dont really need and does not comply with our standard structure of data for other users.
}

export const configureStore = () => {
    const middlewares =[thunk.withExtraArgument({getFirebase, getFirestore})]; //we can have an array of middlewares
    //thunk by itself gives us the dispatch() and getState() 
    //but we can have the withExtraArgument function to pass in one extra argument. We're passing in two things but in once single object.

    const composedEnhancer = composeWithDevTools( //these are our store enhancers
        applyMiddleware(...middlewares), //gives us access to our middlewares which gives us access to thunks which now has extra features like getFirestore and getFirebase
        reactReduxFirebase(firebase, rrfConfig), // reactReduxFirebase is our store enhancer. It adds our firebase configuration to our store as well as takes the reactReduxFirebase configs as well.
        reduxFirestore(firebase)); //this also takes our firebase config as well

    const store = createStore(rootReducer, composedEnhancer);

    return store;
}