import { INCREMENT_COUNTER, DECREMENT_COUNTER } from "./testConstants";
import { createReducer } from "../../app/common/util/reducerUtil";

const initialState = {
    data:42
}

const incrementCounter = (state) => {
    return {...state, data: state.data + 1}; 
}

const decrementCounter = (state) => {
    return {...state, data: state.data - 1}; 
}

export default createReducer(initialState, {
    [INCREMENT_COUNTER]: incrementCounter, //[INCREMENT_COUNTER] this way we're passing in the type
    [DECREMENT_COUNTER]: decrementCounter
});

// const testReducer = (state = initialState, action) => { //passing in the state and setting it to the initial state.
//     switch (action.type) {
//         case INCREMENT_COUNTER:
//             return{...state, data: state.data + 1}; 
//             //spreading the state, so we're returning a new state object that contains data which is state.data + 1
//         case DECREMENT_COUNTER:
//             return{...state, data: state.data - 1}; 
    
//         default:
//             return state;
//     }
// };
