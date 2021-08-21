//Action Types
export const INCREMENT_COUNTER = "INCREMENT_COUNTER";
export const DECREMENT_COUNTER = "DECREMENT_COUNTER";
export const SAVE_GIT_DATA = "SAVE_GIT_DATA";

//Action Creator
export const incrementCounter = () => ({
   type: INCREMENT_COUNTER
});

export const decrementCounter = () => ({
    type: DECREMENT_COUNTER
});

export const save_git_data = (data) => ({
    type: SAVE_GIT_DATA,
    payload: data
})
