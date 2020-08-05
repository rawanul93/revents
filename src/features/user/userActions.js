import { toastr } from "react-redux-toastr";
import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";
import cuid from 'cuid';
import firebase from '../../app/config/firebase';
import { FETCH_USER_EVENTS } from "../event/eventConstants";

export const updateProfile = (user) => 
async (dispatch, getState, { getFirebase }) => { //everything to do with users profile and authentication is controlled by firebase instance.
    const firebase = getFirebase();
    const {isLoaded, isEmpty, ...updatedUser} = user;
    // so when we updateProfile using the user, it comes with isEmpty and isLoaded which are part of the user object and we need to get rid of that. We are destructuring out the isLoaded and isEmpty properties out. We could have also used .delete method to actually get rid off it
    // to omit these, we'll code the line above where we're destructoring out these two and the rest of the info into a new object called updatedUser.
    //so updated user has all the user info except for the 2 that we detructored out.
    try {
        await firebase.updateProfile(updatedUser); //updateProfile updates our firestore, but remember that we access it through our firebase reducer.
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
        const user = firebase.auth().currentUser; //user is the one in auth. The other data is stored in firestore.
        const path = `${user.uid}/user_images`; //assigning the path which firebase will use to know where the images should be stored.
        const options = { //when we upload a file, we need to upload an options object.
            name:  imageName //when we delete photos, the firebase needs the file name.
        };
        try {

            dispatch(asyncActionStart()); //since this action may take a while to execute. We'll dispatch our async start and end for this.

            //upload file to firebase STORAGE. Not in the user collection. We store it in the collection as a url that points to this storage instead of actually storing it there.
            let uploadedFile = await firebase.uploadFile(path, file, null, options) //the uploadFile method is something we're getting from getFirebase, the one provided by the react-redux-firebase. So its not the firebase API itself. Its an additional method that was created on this particular instance of firebase that were using here. The 3rd parameter is used if we wanted to affect our actual firebase directly from here. In this case we're not so we set it to null.
           
            //get the URL of the image
            let downloadURL = await uploadedFile.uploadTaskSnapshot.ref.getDownloadURL(); //the uploadTaskSnapshot has the actual data. This is just how we get the url from our firebase storage.
           
            //get the user document from firestore because we need this to add our new photoURL 
            let userDoc = await firestore.get(`users/${user.uid}`);
           
            //also need to check if the user has a current profile photo or not. If not update the profile photo.
            if (!userDoc.data().photoURL) {//userDoc gets us the document. But to actually get to the data, we need to use .data() method to get access to all the document fields we see in our firestore.
               //so if user doesnt already have a photoURL i.e doesnt have a profile pic, then we set this uploaded one as the profile pic.
                await firebase.updateProfile({ //updateProfile updates our firestore, but we access it through our firebase reducer.
                    photoURL: downloadURL //only updating the profile part of the user. 
                });
                await user.updateProfile({ //if we want to update the data in auth, just for consistency, we need to do it via the user object.
                    photoURL: downloadURL
                }) 
            }

            //Now that we uploaded the photo to our storage above, we need take that url and add it to the users collection in our firestore database.
            await firestore.add({
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos'}] //creates a new subcollection for our photos if there is none to begin with.
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
            await firebase.deleteFile(`${user.uid}/user_images/${photo.name}`); //deleting the actual file from the storage.
            await firestore.delete({ //we also want to delete this from our user collection as well.
                collection: 'users',
                doc: user.uid,
                subcollections: [{collection: 'photos', doc: photo.id}]
            })
        } catch (error) {
            console.log(error);
            throw new Error('Problem deleting photo');
        }
}

export const setMainPhoto = (photo) => //contains batch update. We will be getting all the events that the user is attending and update each of these events with the new main photo. We also want to update the user document itself with the new main photo.
    async (dispatch, getState) => {
        // const firebase = getFirebase(); //only need firebase because firebase is what is responsible for everything related to the user profile. Even though we are changing something inside firestore as well, firebase gives us the hook to change it without calling firestore specifically
        const firestore = firebase.firestore(); //using the firebase api directly.
        const user = firebase.auth().currentUser;
        const today = new Date(); //we will NOT be updating photos for events that are in the past.
        let userDocRef = firestore.collection('users').doc(user.uid);
        let eventAttendeeRef = firestore.collection('event_attendee');
        
        
        try {
            dispatch(asyncActionStart());
            let batch = firestore.batch();
           
            batch.update(userDocRef, { //not commiting the queries here yet.
                photoURL: photo.url
            })

            let eventQuery = await eventAttendeeRef
                .where('userUid', '==', user.uid)
                .where('eventDate', '>=', today)

            let eventQuerySnap = await eventQuery.get();

            for (let i = 0; i < eventQuerySnap.docs.length; i++) {
                let eventDocRef = await firestore
                    .collection('events')
                    .doc(eventQuerySnap.docs[i].data().eventId);
                let event = await eventDocRef.get(); //now for each of these documents we need to check if user is the host of the document. If so we need to update the hostPhotoURL as well as the attendees photoURLs. Otherwise just the attendees photos.
                if (event.data().hostUid === user.uid) { //doing the update main photo for host.
                    batch.update(eventDocRef, 
                    {
                        hostPhotoURL: photo.url,
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    })
                } else {
                    batch.update(eventDocRef, 
                    {
                        [`attendees.${user.uid}.photoURL`]: photo.url
                    })
                }
            }

        await batch.commit();
        console.log(batch);
        dispatch(asyncActionFinish());

        } catch (error) {
            console.log(error);
            dispatch(asyncActionError());
            throw new Error('Problem setting main photo');
        }
    }

export const goingToEvent = (event) => 
    async (dispatch, getState) => {
       
        dispatch(asyncActionStart());

        const firestore = firebase.firestore();
        const user = firebase.auth().currentUser;
        const profile = getState().firebase.profile; //getState gets us the firebase state from the reducer. We are getting the profile from firebase.profile and not auth because we dont keep auth updated.
        const attendee = {
            going: true,
            joinDate: new Date(),
            photoURL: profile.photoURL || '/assets/user/png',
            displayName: profile.displayName,
            host: false
        }
        try {
            let eventDocRef = firestore.collection('events').doc(event.id); //we want to monitor any changes in this events document so that if there are changes while this method is being called, this transaction will re-run so that it uses the latest version of that data.
            let eventAttendeeDocRef = firestore.collection('event_attendee').doc(`${event.id}_${user.uid}`);

            await firestore.runTransaction(async (transaction) => {
                await transaction.get(eventDocRef) //as per transaction rules, first we do the read. We're using this to track our changes.
                await transaction.update(eventDocRef, {
                    [`attendees.${user.uid}`]: attendee //this is how we want to set up this document in our firestore.
                })
                await transaction.set(eventAttendeeDocRef, {
                    eventId: event.id,
                    userUid: user.uid,
                    eventDate: event.date,
                    host: false
                })
            })

            // await firestore.update(`/events/${event.id}`, {
            //     [`attendees.${user.uid}`]: attendee 
            // })
            // await firestore.set(`event_attendee/${event.id}_${user.uid}` , { //this is how we want to set up this document in our firestore.
            //     eventId: event.id,
            //     userUid: user.uid,
            //     eventDate: event.date,
            //     host: false
            // })
            dispatch(asyncActionFinish());
            toastr.success('Success', 'You have signed up to the event')
        } catch (error) {
            dispatch(asyncActionError());
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
            toastr.success('Success', 'You have removed yourself from the event')

           // await firestore.delete(`event_attendees/${event.id}_${user.uid}`); //using the delete() method directly here cause we're deleting the entire document here and not just a specific field or something
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
            default: //when we dont pass in an activeTab
                    query = eventsRef
                    .where('userUid', '==', userUid)
                    .orderBy('eventDate', 'desc');
                    break;
        }

        try {
            let querySnap = await query.get(); //so here we're getting everything in the event_attendees collection depending on which tab the user clicked on. We'll get the data from this regarding the eventIds and use those ids to query and get the data of those actual events from the events collection. 
          
            let events =[];

            for(let i = 0; i < querySnap.docs.length; i++) {
                let evt = await firestore.collection('events').doc(querySnap.docs[i].data().eventId).get(); //using the eventIds we get from the event_attendee collection and use that to query and get the actual events pertaining to those ids from the events collection.
                events.push({...evt.data(), id: evt.id});
            }
            dispatch({type: FETCH_USER_EVENTS, payload: {events}}) //we do this so that we get it in our reducer.

            dispatch(asyncActionFinish());
            return querySnap;

        } catch (error) {
            console.log(error)
            dispatch(asyncActionError());
        }
    }