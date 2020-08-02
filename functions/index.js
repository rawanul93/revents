const functions = require('firebase-functions');
const admin = require('firebase-admin'); //get access to the admin functionality. So we wont need permissions and have full rights to the application. 
admin.initializeApp(functions.config().firebase);  //initialize the app.

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


