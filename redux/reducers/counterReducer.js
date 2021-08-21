import {DECREMENT_COUNTER, INCREMENT_COUNTER, SAVE_GIT_DATA} from '../actions/counterActions';

const counterReducer = (state = {value: 0, gitData: null}, action) => {
    switch (action.type) {
        case INCREMENT_COUNTER:
            return {...state, value: state.value + 1};
        case DECREMENT_COUNTER:
            return {...state, value: state.value - 1};
        case SAVE_GIT_DATA:
            return {...state, gitData: action.payload};
        default:
            return {...state};
    }
};

export default counterReducer;
