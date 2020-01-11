import { createReducer } from "../../app/common/util/reducerUtil";
import { ASYNC_ACTION_START, ASYNC_ACTION_FINISH, ASYNC_ACTION_ERROR } from "./asyncConstants";

const initialState = {
    elementName: null, //to store the name of button or whatever we need and use it to isolate the loading feature accordingly.
    loading: false
}

const asyncActionStarted = (state, payload) => {
    return {
        ...state, //copying the new state. We dont need to but its good practice.
        loading: true,
        elementName: payload
    }
}

const asyncActionFinished = (state) => {
    return {
        ...state,
        loading: false,
        elementName: null
    }
}

const asyncActionError = (state) => {
    return {
        ...state,
        loading: false,
        elementName: null
    }
}

export default createReducer(initialState, {
    [ASYNC_ACTION_START]: asyncActionStarted,
    [ASYNC_ACTION_FINISH]: asyncActionFinished,
    [ASYNC_ACTION_ERROR]: asyncActionError
});