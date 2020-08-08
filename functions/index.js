

const functions = require('firebase-functions');
const admin = require('firebase-admin'); //get access to the admin functionality. So we wont need permissions and have full rights to the application. 
admin.initializeApp(functions.config().firebase);  //initialize the app.

const objectToArray = object => {
    return Object.entries(object).map(e => Object.assign({}, e[1], {id: e[0]})) 
}

const newActivity = (type, event, id) => {
    return {
        type: type,
        eventDate: event.date,
        hostedBy: event.hostedBy,
        title: event.title,
        photoURL: event.hostPhotoURL,
        timestamp: admin.firestore.FieldValue.serverTimestamp(),
        hostUid: event.hostUid,
        eventId: id
    }
}

exports.createActivity = functions.firestore
    .document('events/{eventId}') //listens to the events collection, specifically events/{eventId} and whenever something is created here, we'll execute the function in our onCreate.
    .onCreate( async event => { //grab the current value of what was written to cloud firestore which is the event. We could also add a second parameter context and we can use that to access the eventId doing context.params.eventId
        let newEvent = event.data();
        console.log(newEvent); //this will be logged on our Logs in firebase functions.

        const activity = newActivity('newEvent', newEvent, event.id)

        console.log(activity);

        try {//so now we're adding a new document with the new activity to our activity collection.
            const docRef = await admin.firestore().collection('activity').add(activity);
            return console.log('Activity created with ID: ', docRef.id);
        }
        catch (err) {
            return console.log('Error adding activity', err);
        } 
    })

exports.cancelActivity = functions.firestore
    .document('events/{eventId}')
    .onUpdate( async (event, context) => { //note here the event is not our own event, it is the cloud functions event that is occuring when a change happens or a something is updated in the document we are listening to.
        let updatedEvent = event.after.data(); //we get a snap of the data before or after the update. In this case we're using the after snap.
        let previousEventData = event.before.data();

        if (!updatedEvent.cancelled || previousEventData.cancelled === updatedEvent.cancelled) {
            return false; //so if the event is not cancelled or if the update is not related to a cancel, we check if newEvent and previousEvent cancel property is same or not.
        }

        const activity = newActivity('cancelledEvent', updatedEvent, context.params.eventId)
        console.log({activity});

        try {
            const docRef = await admin.firestore().collection('activity').add(activity);
            return console.log('Activity created with ID: ', docRef.id);
        } catch(err) {
            return console.log('Error adding activity', err);
        }

    }) 

exports.deleteEventAttendeeDoc = functions.firestore
    .document('events/{eventId}')
    .onUpdate( async (event, context) => {
        let updatedEvent = event.after.data();
        let previousEventData = event.before.data();
        
        const prevAttendees =  previousEventData.attendees && objectToArray(previousEventData.attendees);
        const updatedAttendees = updatedEvent.attendees && objectToArray(updatedEvent.attendees);
        
        let attendeeToDelete;

        if (prevAttendees.length > updatedAttendees.length) { //only execute when number of attendees has decreased which only happens if someone cancels their place.

            for( let i = 0; i < prevAttendees.length; i++)  {
                  
                let joined = updatedAttendees.some(attendee => attendee.id === prevAttendees[i].id)
                
                if (!joined) {
                   attendeeToDelete = prevAttendees[i]
                }
            }

            try {
                const docRef = admin.firestore().collection('event_attendee').doc(`${context.params.eventId}_${attendeeToDelete.id}`);
                await docRef.delete();
                return console.log('deletion of doc is successful', docRef);
            } catch(err) {
                return console.log('Error deleting document', err);
            }
        } else return false;

    })

exports.addFollowersDoc = functions.firestore
    .document('users/{userId}/following/{followingId}')
    .onCreate(async (event, context) => {
        const followingId = context.params.followingId;
        const followerId = context.params.userId;

        try {
            let followerDocRef = admin.firestore().collection('users').doc(followerId);
            let docSnapshot = await followerDocRef.get();
            let follower = docSnapshot.data();

            return admin.firestore()
                .collection('users')
                .doc(followingId)
                .collection('followers')
                .doc(followerId)
                .set({
                    displayName: follower.displayName,
                    city: follower.city || 'unknown city',
                    photoURL: follower.photoURL || '/assets/user.png',
                    profilePath: `/profile/${followerId}`
                })

        } catch (err) {
            return console.log(err);
        }
    })

exports.deleteFollowerDoc = functions.firestore
    .document('users/{userId}/following/{followingId}')
    .onDelete(async (event, context) => {
        const followingId = context.params.followingId;
        const followerId = context.params.userId;

        try {
            docRef = admin.firestore().collection('users').doc(followingId).collection('followers').doc(followerId);
            await docRef.delete();
            return console.log(docRef + ' deleted');

        } catch (err) {
            return console.log(err);
        }

    })

