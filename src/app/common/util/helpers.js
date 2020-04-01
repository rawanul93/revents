export const objectToArray = (object) => {
    if (object) {
        return Object.entries(object).map(e => Object.assign({}, e[1], {id: e[0]})) //now this is an array
        //Object.entries converts the attendees into an object with first entry as the attendee id and the second entry as an object that holds all the attendee information.
        //But we want this as one single entry i.e. an array where for an attendee it will be a sigle entry in the array with attendee id included.
        //Therefore we map over the entries object and create a new array with one entry per attendee using Object.assign.
        //With Object.assign we assign the e[1] which is the object containing all the information of this particular attendee we are looping over, into an empty object.
        //Then add our own parameter and call it id and assign it the id of the attendee which was stored in e[0].
    }
}

export const createNewEvent = (user, photoURL, event) => {
    return {
        ...event, // spreading the data we get from the event form
        hostUid: user.uid,
        hostedBy: user.displayName,
        hostPhotoURL: photoURL || '/assets/user.png',
        created: new Date(),
        attendees: {
            [user.uid]: {
                going: true,
                joinDate: new Date(),
                photoURL: photoURL || '/assets/user.png',
                displayName: user.displayName,
                host: true
            }
        }
    }
}
