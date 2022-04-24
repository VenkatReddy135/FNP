import { SET_OCCASION_DATA } from "../actions/freemessagecard";

const initialState = {
  occasionData: {
    selectedOccasion: {},
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_OCCASION_DATA:
      return {
        occasionData: {
          ...payload,
        },
      };
    default:
      return state;
  }
};
