// import { UPDATE_EVENT, DELETE_EVENT } from "./eventConstants";
//import { asyncActionStart, asyncActionFinish, asyncActionError } from "../async/asyncActions";
// import { fetchSampleData } from "../../app/data/mockApi";
import { toastr } from "react-redux-toastr";
import { createNewEvent } from "../../app/common/util/helpers";

export const createEvent = (event) => {
    return async (dispatch, getState, {getFirestore, getFirebase}) => {
        const firestore = getFirestore();
        const firebase = getFirebase();
        const user = firebase.auth().currentUser;
        const photoURL = getState().firebase.profile.photoURL; //we can use getState to get the photo because firebase automatically loads up the profile when a user logs in.
        const newEvent = createNewEvent(user, photoURL, event) //this is in the helper.js file. We kept it there so as to avoid the clutter.
        try {
            let createdEvent = await firestore.add('events', newEvent); //adding newEvent to the event collection. The createdEvent is the document snapShot. So now we can use the createdEvent id. We use .add when we add a document where we want firestore to give a unique id when creating it. I.e. we are not exclusively setting a specific id or referring to one. 
            await firestore.set(`event_attendee/${createdEvent.id}_${user.uid}`, { // this is to setup a doc which we will use for easily quering events based on events that user us attending, past events and the ones he/she has hosted. Here we use .set because we want to add this document based on a specific id that we want which in this case is the event id.
                eventId: createdEvent.id,
                userUid: user.uid,
                eventDate: event.date,
                host: true 
            })
            toastr.success('Success', 'Event has been created');

            return createdEvent; //since this is a async function, it automatically return with a Promise. So we can return our createdEvent like this.
        } catch (error) {
            toastr.error('Oops', 'Something went wrong')
        }
    } 
}

export const updateEvent = (event) => {
    return async (dispatch, getState, {getFirestore}) =>{
       const firestore = getFirestore();
        try {
        await firestore.update(`events/${event.id}`, event)
        toastr.success('Success', 'Event has been updated');
       } catch {
        toastr.error('Oops', 'Something went wrong')
       }            
    }
}

export const cancelToggle = (cancelled, eventId) =>
    async (dispatch, getState, {getFirestore}) => {
        const message = cancelled ? 'Are you sure you want to cancel the event?' : 'This will reactivate the event. Are you sure?'
        const firestore = getFirestore();
        try {
            toastr.confirm(message, { //onOk is just a toastr thing. We just need to pass in a function. So we give our firestore function in here instead.
                onOk: async () =>  
                    await firestore.update(`events/${eventId}`, {
                    cancelled: cancelled //boolean just to see if the event is cancelled or not
                })
            })
           
        } catch (error) {
            console.log(error);
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