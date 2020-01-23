import { closeModal } from "../modals/modalActions";
import { SubmissionError, reset } from 'redux-form'
import { toastr } from "react-redux-toastr";


export const login = (creds) => { //if we use curly braces here then we have to write return underneath to return everything. If we didnt use curly braces here, then the return is implied and we couldve simply started with async and not specify return a
    return async (dispatch, getState, { getFirebase }) => { 
        //we can pass in dispatch and getState to our actions now. But due to adding withExtraArguments() with thunk, we also get access to getFirebase and getFirestore.
        //authentication is stored in firebase rather than firestore
        const firebase =  getFirebase();
        try {
            await firebase.auth().signInWithEmailAndPassword(creds.email, creds.password);
            dispatch(closeModal());
       } catch (error) {
            console.log(error);
            throw new SubmissionError({
               // _error: error.message
               _error: 'Login Failed'
            })
       }      
    };
};

export const registerUser = user => //user object with all the information that the user types into our register form.
    async (dispatch, getState, { getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        try {
            let createdUser = await firebase.auth().createUserWithEmailAndPassword(user.email, user.password);
            //console.log(createdUser);
            await createdUser.user.updateProfile({ //our newly createdUser will have a user object which has a method updateProfile. This user object is what is inside our auth, its not the one in our firebase
                displayName: user.displayName //setting the displayName in profile (not auth) in firebase.
            })
            let newUser = { //createdUser was created to be stored in our firebase auth. But we now want to create an actual new user in our firestore.
                displayName: user.displayName,
                createdAt: firestore.FieldValue.serverTimestamp() //we're gonna store the time at which the user was created. We'll be using the server timestamp since its more accurate than our own system's time.
            }
            await firestore.set(`users/${createdUser.user.uid}`, {...newUser})
            //firestore.set allows us to create a new collection or update an existing one. In this case we're calling it users. Since it doesnt already exist, firestore will create it for us.
            //the createdUser in our firebase auth will have its own created id called uid, so we'll use that to reference this newly created user's new document in the users collection in firebase.
            //also we're spreading the newUser properties onto the new user. The new user in firestore will look exactly like our newUser object from above.

            dispatch(closeModal());
        } catch (error) {
            console.log(error);
            throw new SubmissionError({
                // _error: error.message
                _error: error.message
             })
        }
    }
    export const socialLogin = (selectedProvider) =>  //selectedProvider is either Facebook or Google provider the user chose.
        async (dispatch, getState, { getFirebase, getFirestore }) => {
            const firebase = getFirebase();
            const firestore = getFirestore();

            try {
                dispatch(closeModal()); //closing our own modal
                let user = await firebase.login({ //opening firebase modal for the specific provider that the user has chosen.
                    provider: selectedProvider,
                    type: 'popup' //the window will popup
                });
                // the user we're returning above has all kinds of data. Including one that isNewUser which tells us if this is a new user or not. So we'll check that and either add as new user or just do a regular login.
                if (user.additionalUserInfo.isNewUser) { //this will only run if this is a new user. If not, the default behaviour is that a new user will be created.
                    await firestore.set(`users/${user.user.uid}`, {
                        displayName: user.profile.displayName,
                        photoURL: user.profile.avatarUrl,
                        createdAt: firestore.FieldValue.serverTimestamp()
                    });
                }
            } catch (error) {
                console.log(error);
            }
        }

        export const updatePassword = (creds) =>
            async (dispatch, getState, { getFirebase }) => {
                const firebase = getFirebase();
                const user = firebase.auth().currentUser; //firebase method to get the current user.
                try {
                    await user.updatePassword(creds.newPassword1);
                    await dispatch(reset('account')); // reset is something we have to import from redux-form. It helps us reset the form once its called. We just need to specify the name of the form.
                    toastr.success('Success', 'Your password has been successfully updated!')
                } catch (error) {
                    throw new SubmissionError ({
                        _error: error.message
                    })
                }
            }