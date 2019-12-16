import {INCREMENT_COUNTER, DECREMENT_COUNTER} from './testConstants';

export const incrementCounter = () => { //action creator that retrun actions.
    return {type: INCREMENT_COUNTER}
}

export const decrementCounter = () => {
    return {type: DECREMENT_COUNTER}
}