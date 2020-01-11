import {INCREMENT_COUNTER, DECREMENT_COUNTER} from './testConstants';
import { asyncActionFinish } from '../async/asyncActions';
import { ASYNC_ACTION_START } from '../async/asyncConstants';

export const incrementCounter = () => { //action creator that retrun actions.
    return {type: INCREMENT_COUNTER}
}

export const decrementCounter = () => {
    return {type: DECREMENT_COUNTER}
}

const delay = (ms) => { //artificially creating some delay
    return new Promise(resolve => setTimeout(resolve, ms))
}

export const incrementAsync = (name) => {
    return async dispatch => {
        dispatch({
            type: ASYNC_ACTION_START,
            payload: name
        }) //this will make the asyncReducer change the loading flag in our store to true
        await delay(1000)
        dispatch(incrementCounter())
        dispatch(asyncActionFinish())
    }
}

export const decrementAsync = (name) => {
    return async dispatch => {
        dispatch({
            type: ASYNC_ACTION_START,
            payload: name
        }) //this will make the asyncReducer change the loading flag in our store to true
        await delay(1000)
        dispatch({type: DECREMENT_COUNTER}) //same as using decrementcounter() action. We can also put in the action directly by type.
        dispatch(asyncActionFinish())
    }
}

