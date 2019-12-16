export const createReducer = (initialState, fnMap) => {
    return (state = initialState, {type, payload}) => {
        const handler = fnMap[type]; //this is object bracket[] notation. Whatever type is, it wil be swaped with a string depending whats passed into it.
        
        return handler ? handler(state, payload) : state
    }
}