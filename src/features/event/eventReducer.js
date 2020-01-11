import { createReducer } from "../../app/common/util/reducerUtil";
import { CREATE_EVENT, DELETE_EVENT, UPDATE_EVENT, FETCH_EVENTS } from "./eventConstants";

 const initialState = [];

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

const fetchEvents = (state, payload) => {
  return payload.events //taking the events from the payload and updating the state store 
}

export default createReducer(initialState, {
    [CREATE_EVENT]: createEvent,
    [UPDATE_EVENT]: updateEvent,
    [DELETE_EVENT]: deleteEvent,
    [FETCH_EVENTS]: fetchEvents
})
