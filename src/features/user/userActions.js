import { toastr } from "react-redux-toastr";
import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import { FETCH_EVENTS } from "../event/eventConstants";

export const updateProfile = (user) => 
async (dispatch, getState, { getFirebase }) => {
    const firebase = getFirebase();
    const {isLoaded, isEmpty, ...updatedUser} = user;
    // so when we updateProfile we also update it with isEmpty and isLoaded which are part of the user object that we get.
    // to get omit these, we'll code the line above where we're destructoring out these two and the rest of the info into a new object called updatedUser.
    //so updated user has all the user info except for the 2 that we detructored out.
    
    try {
        await firebase.updateProfile(updatedUser); //updateProfile updates our firestore, but we access it through our firebase reducer.
        toastr.success('Success', 'Your profile has been updated')
    } catch (error) {
        console.log(error);
    }
}

export const uploadProfileImage = (file, fileName) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const imageName = cuid(); //we'll give our images a unique name so as to avoid using the same name for duplicate images.
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const path = `${user.uid}/user_images`; //assigning the path which firebase will use to know where the images should be stored.
        const options = { //when we upload a file, we need to upload an options object.
            name:  imageName //when we delete photos, we need the firebase needs the file name.
        };
        try {

            dispatch(asyncActionStart()); //since this action may take a while to execute. We'll dispatch our async start and end for this.

            //upload file to firebase storage
            let uploadedFile = await firebase.uploadFile(path, file, null, options) //the uploadFile method is something we're getting from getFirebase, the one provided by the react-redux-firebase. So its not the firebase API itself. Its an additional method that was created on this particular instance of firebase that were using here. The 3rd parameter is used if we wanted to affect our actual firebase directly from here. In this case we're not so we set it to null.
           
            //get the URL of the image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL(); //this is just how we get the url from our firebase storage.
           
            //get the user document from firestore because we need this to add our new photoURL 
            let userDoc = await firestore.get(`users/${user.uid}`);
           
            //also need to check if the user has a current profile photo or not. If not update the profile photo.
            if (!userDoc.data().photoURL) {//userDoc gets us the document. But to actually get to the data, we need to use .data() method to get access to all the document fields we see in our firestore.
               //so if user doesnt already have a photoURL i.e doesnt have a profile pic, then we set this uploaded one as the profile pic.
                await firebase.updateProfile({ //updateProfile updates our firestore, but we access it through our firebase reducer.
                    photoURL: downloadURL //only updating the profile part of the user. 
                });
                await user.updateProfile({ //just for consistency, we also want to update the auth part of our firebase because updateProfile updates our firestore only, even though we access it through our firebase reducer.
                    photoURL: downloadURL
                }) 
            }

            //create a storage area for all our photos i.e. a document in firestore with the name of the image and the downloadURL for it.
            //add image to firestore. The method above was to just add the photoURL to the profile part of the user. This here is to add the photoURL and the name to the collection photos for the user, and not the profile.
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}] //creates a new subcollection for our photos
            }, { //also specify what we are adding
                name: imageName, //when we delete photos, firebase needs the name of the file.
                url: downloadURL
            })

            dispatch(asyncActionFinish());

        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
        }

}

export const deletePhoto = (photo) => 
    async (dispatch, getState, {getFirebase, getFirestore }) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try {
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`);
            await firestore.delete({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            })
        } catch (error) {
            console.log(error);
            throw new Error('Problem deleting photo');
        }
}

export const setMainPhoto = (photo) =>
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase(); //only need firebase because firebase is what is responsible for everything related to the user profile. Even though we are changing something inside firestore as well, firebase gives us the hook to change it without calling firestore specifically
        try {
            await firebase.updateProfile({
                photoURL: photo.url
            });
        } catch (error) {
            console.log(error);
            throw new Error('Problem setting main photo');
        }
    }

export const goingToEvent = (event) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        const profile = getState().firebase.profile; //getState gets us the firebase state from the reducer. We are getting the profile from firebase.profile and not auth because we dont keep auth updated.
        const attendee = {
            going: true,
            joinDate: firestore.FieldValue.serverTimestamp(),
            photoURL: profile.photoURL || '/assets/user/png',
            displayName: profile.displayName,
            host: false
        }
        try {
            await firestore.update(`/events/${event.id}`, {
                [`attendees.${user.uid}`]: attendee //add attendee to the event doc under attendees. We'll give this attendee a key of user Id that joined, using object notaion. Firestore will automatically add an attendee with this id and update it with our attendee object which we setup above.
            })
            await firestore.set(`event_attendee/${event.id}_${user.uid}` , { //this is how we want to set up this document in our firestore.
                eventId: event.id,
                userUid: user.uid,
                eventDate: event.date,
                host: false
            })
            toastr.success('Success', 'You have signed up to the event')
        } catch (error) {
            console.log(error)
            toastr.error('Oops', 'Problem signing up to the event')
        }
    }

export const cancelGoingToEvent = (event) => 
    async (dispatch, getState, {getFirebase, getFirestore}) => {
        const firebase = getFirebase();
        const firestore = getFirestore();
        const user = firebase.auth().currentUser;
        try {
            await firestore.update(`events/${event.id}`, { //cant directily access the attendees, so need to use object bracket notation, kind of like an array.
                [`attendees.${user.uid}`] : firestore.FieldValue.delete() //remove a specific field in a document, in this case its deleting the attendee with the key of of this user who cancels going to the event.
            })
            await firestore.delete(`event_attendees/${event.id}_${user.uid}`); //using the delete() method directly here cause we're deleting the entire document here and not just a specific field or something
            toastr('Success', 'You have removed yourself from the event')
        } catch (error) {
            console.log(error);
            toastr.error('Oops', 'Something went wrong');
        }
    }

export const getUserEvents = (userUid, activeTab) => 
    async (dispatch, getState) => {
        dispatch(asyncActionStart());
        const firestore = firebase.firestore();
        const today = new Date(Date.now());
        let eventsRef = firestore.collection('event_attendee'); //this collection doesnt carry the full information of the event itself. We made it for lookup purposes only.
        let query;
        switch (activeTab) {
            case 1: //past events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '<=', today)
                    .orderBy('eventDate', 'desc');
                break;
            case 2: //future events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('eventDate', '>=', today)
                    .orderBy('eventDate', 'desc');
                    break;
            case 3: //hosted events
                query = eventsRef
                    .where('userUid', '==', userUid)
                    .where('host', '==', true)
                    .orderBy('eventDate', 'desc');
                    break;
            default:
                    query = eventsRef
                    .where('userUid', '==', userUid)
                    .orderBy('eventDate', 'desc');
                    break;
        }

        try {
            let querySnap = await query.get(); //.get() executes the query and gives us a query snapshot.
            let events =[];

            for(let i = 0; i < querySnap.docs.length; i++) {
                let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get(); //go to the events collection in firestore, and get the document pertaining to the event with the eventId that we find from each doc in the querySnap which has the events that this user is attending. Doing querySnap.doc.data converts the fields in the document into an object and from there we're doing .eventId to get the eventId and use it to get the actual event with this particular id from the events collection.
                events.push({...evt.data(), id: evt.id});
            }
            dispatch({type: FETCH_EVENTS, payload: {events}})

            dispatch(asyncActionFinish());
            return querySnap;

        } catch (error) {
            console.log(error)
            dispatch(asyncActionError());
        }
    }