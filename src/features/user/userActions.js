import { toastr } from "react-redux-toastr";

export const updateProfile = (user) => 
async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const {isLoaded, isEmpty, ...updatedUser} = user;
    // so when we updateProfile we also update it with isEmpty and isLoaded which are part of the user object that we get.
    // to get omit these, we'll code the line above where we're destructoring out these two and the rest of the info into a new object called updatedUser.
    //so updated user has all the user info except for the 2 that we detructored out.
    
    try {
        await firebase.updateProfile(updatedUser);
        toastr.success('Success', 'Your profile has been updated')
    } catch (error) {
        console.log(error);
    }
}