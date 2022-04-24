import { set, cloneDeep } from "lodash";

/**
 * @function formReducer form reducer
 * @param {object} state previous state
 * @param {object} action contains type and value
 * @returns {object} returns new state
 */
export function formReducer(state, action) {
  const { payload } = action;

  if (action.type === "resetMultipleFields") {
    return {
      ...state,
      ...payload.fieldNamesConfig.reduce((acc, cur) => ({ ...acc, [cur.fieldName]: cur.value }), {}),
    };
  }

  if (action.type === "resetActionFields") {
    let newState = { ...state };
    payload.fieldNamesConfig.forEach((item) => {
      newState = { ...newState, ...set(newState, item.fieldName, item.value) };
    });

    return cloneDeep(newState);
  }

  if (action.type === "setValue") {
    return { ...state, ...payload };
  }

  return cloneDeep({ ...state, ...set(state, payload.fieldName, payload.value) });
}

/**
 * @function formValidityReducer form validity reducer
 * @param {object} state previous state
 * @param {object} action contains type and value
 * @returns {object} returns new state
 */
export function formValidityReducer(state, action) {
  const { formType: name, payload: value } = action;

  return { ...state, [name]: value };
}
