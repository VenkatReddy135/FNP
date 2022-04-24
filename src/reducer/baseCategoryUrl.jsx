import { SET_URL_VALUE } from "../actions/galleria";

const initialState = {
  baseUrlData: {
    id: "",
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_URL_VALUE:
      return {
        baseUrlData: {
          ...payload,
        },
      };
    default:
      return state;
  }
};
