// import { UPDATE_EVENT, DELETE_EVENT } from "./eventConstants";
// import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";
// import { fetchSampleData } from "../../app/data/mockApi";
import {toastr} from "react-redux-toastr";
import {createNewEvent} from "../../app/common/util/helpers";
import firebase from '../../app/config/firebase'; // getting the firebase api directly. We use this for our getEventsForDashboard action. We're using this instead of using getFirebase from react-redux-firebase (passed as middleware from the configure store) that is used in all the other actions and its from react-redux-firebase and has its own reducer.
import {FETCH_EVENTS} from "./eventConstants";
import {asyncActionStart, asyncActionFinish, asyncActionError} from "../async/asyncActions";

export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore, getFirebase}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL; // we can use getState to get the photo because firebase automatically loads up the profile when a user logs in because in our auth actions we set up that when a user signs in, the firebase auth is immediately updated
        const newEvent = createNewEvent(user, photoURL, event) // this is in the helper.js file. We kept it there so as to avoid the clutter.
        try {
            dispatch(asyncActionStart());
            let createdEvent = await firestore.add('events', newEvent); // adding newEvent to the event collection. The createdEvent is the document snapShot. So now we can use the createdEvent id. We use .add when we add a document where we want firestore to give a unique id when creating it. I.e. we are not exclusively setting a specific id or referring to one.
            
            await firestore.set(`event_attendee/${ //doing .set here because unlike the above where we use .add, we know the id we want to give it.
                createdEvent.id}_${user.uid}`, { // this is to setup a doc which we will use for easily quering events based on events that user us attending, past events and the ones he/she has hosted. Here we use .set because we want to add this document based on a specific id that we want which in this case is the event id.
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true
            })
            toastr.success('Success', 'Event has been created');
            dispatch(asyncActionFinish());
            return createdEvent; // since this is a async function, it automatically returns with a Promise. So we can return our createdEvent like this.
        } catch (error) {
            dispatch(asyncActionError());
            toastr.error('Oops', 'Something went wrong')
        }
    }
}

export const updateEvent = (event) => {
    return async (dispatch, getState) => {
        const firestore = firebase.firestore();
        try {
            dispatch(asyncActionStart());
            let eventDocRef = firestore.collection('events').doc(event.id);
            let dateEqual = getState().firestore.ordered.events[0].date.isEqual(event.date); //isEqual is a firestore timestamp method which we can use to compare the timestamp date to a javascript date.
            if(!dateEqual) {
                let batch = firestore.batch();
                batch.update(eventDocRef, event) //updating the specific event in events collection

                let eventAttendeeRef = firestore.collection('event_attendee');
                let eventAttendeeQuery = await eventAttendeeRef.where('eventId', '==', event.id);
                let eventAttendeeQuerySnap = await eventAttendeeQuery.get(); 

                for (let i = 0; i < eventAttendeeQuerySnap.docs.length; i++) { //so we need the eventAttendeeSnap in order to know which docs to update. We loop through the docs in event_attendee that that match the event being updated and use the id of each doc to get the docRef which we need to pass to our batch function.
                    let eventAttendeeDocRef = await firestore
                        .collection('event_attendee')
                        .doc(eventAttendeeQuerySnap.docs[i].id);
                    
                    batch.update(eventAttendeeDocRef, {
                        eventDate: event.date
                    })
                }
                await batch.commit();
            } else {
                await eventDocRef.update(event)
            }
            dispatch(asyncActionFinish());
            toastr.success('Success', 'Event has been updated');
        } catch {
            dispatch(asyncActionError());
            toastr.error('Oops', 'Something went wrong')
        }}
}

export const cancelToggle = (cancelled, eventId) => async (dispatch, getState, {getFirestore}) => {
    const message = cancelled ? 'Are you sure you want to cancel the event?' : 'This will reactivate the event. Are you sure?'
    const firestore = getFirestore();
    try {
        toastr.confirm(message, { // onOk is just a toastr thing. We just need to pass in a function. So we give our firestore function in here instead.
            onOk: async () => await firestore.update(`events/${eventId}`, {
                cancelled: cancelled // boolean just to see if the event is cancelled or not
            })
        })

    } catch (error) {
        console.log(error);
    }
}

export const getEventsForDashboard = (lastEvent) => // for the query cursor. Here lastEvent is not the doc itself and it is the last event that is being displayed in the dashboard. We're basically gonna start loading more events when the user scrolls down but we'll load events that start after this one.
async (dispatch, getState) => {
    let today = new Date(Date.now());
    const firestore = firebase.firestore(); //since we're gonna use our own reducer to store the events on the dashboard, we wont be using the react-redux-firebase getFirebase/getFirestore

    const eventsRef = firestore.collection('events'); // just a reference const
    // const eventsQuery = firestore.collection('events').where('date', '>=', today); // this is not sending the query direct to firestore yet. We need to write .get() to this in order to execute it. Its just building the query up in memory. goal is to get all of our events that is in the future.

    try {
        dispatch(asyncActionStart());
        let startAfter = lastEvent && await firestore.collection('events').doc(lastEvent.id).get(); // this is to get the document itself which we'll start loading after. Because this is how paging works, this is the query cursor.
        // let querySnap = await eventsQuery.get() //executes the query and returns a QuerySnapshot. This snapshot will have our docs containing all future events as docs
        let query;

        lastEvent ? query = eventsRef
            .where('date', '>=', today)
            .orderBy('date').startAfter(startAfter).limit(2)  //startAfter() is a firestore method which lets us start after the document we pass to it.
        : query = eventsRef
            .where('date', '>=', today)
            .orderBy('date').limit(2); //just quering the first two events and query is not executed yet without the get(). This is just storing the query in memory.

        let querySnap = await query.get(); //executing the actual query. After this we can do .data() to get all the neccessary info.

        if(querySnap.docs.length === 0) { //we need to let our EventDashboard component know if there are any more events to load or not. Since we cant actually efficiently find out the total number of events docs in our database, we'll just check if our query snapshot has any more docs inside it. If it doesnt, then there are no more events and we'll just return.
            dispatch(asyncActionFinish());
            return querySnap;
        }

        let events = [];
        for (let i = 0; i < querySnap.docs.length; i++) {
            let evt = {
                ...querySnap.docs[i].data(), //the data() method retrieves all the fields from the doc as an object. We're also creating and populating the id as a field here, becasue even though the events all have their ids its not a field inside the doc itself which is what we're making the array out of.
                id: querySnap.docs[i].id
            } 
            events.push(evt); // populating our empty events array with each event as a object.
        }
        
        dispatch({type: FETCH_EVENTS, payload: {
                events
            }}) // this is from our previously created event constants and the state is stored in eventReducer
        dispatch(asyncActionFinish());
        return querySnap; //so that we can do something with the UI when we're loading or not loading.
    } catch (error) {
        console.log(error)
        dispatch(asyncActionError());
    }
}

export const addEventComment = (eventId, values, parentId) => 
    async (dispatch, getState, {getFirebase}) => {
        const firebase = getFirebase();
        const profile = getState().firebase.profile; //getting all the info we want to provide to our chat component so that it can display all the neccesary info.
        const user = firebase.auth().currentUser
        let newComment = {
            parentId: parentId,
            displayName: profile.displayName,
            photoURL: profile.photoURL || '/assets/user.png', //if the user doesnt have a display photo.
            uid: user.uid,
            text: values.comment,
            date: Date.now()
        }
        try {
            await firebase.push(`event_chat/${eventId}`, newComment)  //in firebase we push items with their location.
        } catch (error) {
            console.log(error)
            toastr.error('Oops', 'Problem adding comment');
        }
    }


// export const loadEvents = () => {
//     return async dispatch => {
//         try {
//             dispatch(asyncActionStart())
//             const events = await fetchSampleData();
//             dispatch({
//                 type: FETCH_EVENTS,
//                 payload: {
//                     events
//                 }
//             })
//             dispatch(asyncActionFinish());
//         } catch (error) {
//             console.log(error);
//             dispatch(asyncActionError());
//         }
//     }
// }
