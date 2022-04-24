import { INCREMENT_STEPPER, DECREMENT_STEPPER } from "./createProductAction";

/**
 * @function formReducer form reducer
 * @param {object} state previous state
 * @param {object} action contains type and value
 * @returns {object} returns new state
 */
const formReducer = (state, action) => {
  const { type, value } = action;
  switch (type) {
    case INCREMENT_STEPPER:
      return { ...state, stepCount: value + 1 };
    case DECREMENT_STEPPER:
      return { ...state, stepCount: value - 1 };
    default:
      return { ...state };
  }
};

export default formReducer;
