import { createReducer } from "../../app/common/util/reducerUtil";
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT } from "./eventConstants";

 const initialState = [
    {
      id: '1',
      title: 'Trip to Empire State building',
      date: '2018-03-21',
      category: 'culture',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
      city: 'NY, USA',
      venue: 'Empire State Building, 5th Avenue, New York, NY, USA',
      venueLatLng: {
        lat: 40.7484405,
        lng: -73.98566440000002
      },
      hostedBy: 'Bob',
      hostPhotoURL: 'https://randomuser.me/api/portraits/men/20.jpg',
      attendees: [
        {
          id: 'a',
          name: 'Bob',
          photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
        },
        {
          id: 'b',
          name: 'Tom',
          photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
        }
      ]
    },
    {
      id: '2',
      title: 'Trip to Punch and Judy Pub',
      date: '2018-03-18',
      category: 'drinks',
      description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus sollicitudin ligula eu leo tincidunt, quis scelerisque magna dapibus. Sed eget ipsum vel arcu vehicula ullamcorper.',
      city: 'London, UK',
      venue: 'Punch & Judy, Henrietta Street, London, UK',
      venueLatLng: {
        lat: 51.5118074,
        lng: -0.12300089999996544
      },
      hostedBy: 'Tom',
      hostPhotoURL: 'https://randomuser.me/api/portraits/men/22.jpg',
      attendees: [
        {
          id: 'a',
          name: 'Bob',
          photoURL: 'https://randomuser.me/api/portraits/men/20.jpg'
        },
        {
          id: 'b',
          name: 'Tom',
          photoURL: 'https://randomuser.me/api/portraits/men/22.jpg'
        }
      ]
    }
  ];

const createEvent = (state, payload) => {
    return [
        ...state, payload.event
    ]
}

const updateEvent = (state, payload) => {
    return [
        ...state.filter(event => event.id !== payload.event.id), payload.event
        //state.filter returns all the events except the one we updated,
        //then the spread operator adds the updated event (payload.event) 
        //to the events array which didnt have the event that got updated.
    ]
}

const deleteEvent = (state, payload) => {
    return [...state.filter(event => event.id !== payload.eventId)]
}

export default createReducer(initialState, {
    [CREATE_EVENT]: createEvent,
    [UPDATE_EVENT]: updateEvent,
    [DELETE_EVENT]: deleteEvent

})
