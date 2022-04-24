import { SAVE_FORM_DATA } from "../actions/columbus";

const initialState = {
  apiFormData: {
    weightage: {},
    capping: {},
    lookBackWindow: {},
    weightageFormValues: [],
    error: "",
  },
};

export default (state = initialState, { type, payload }) => {
  const { apiFormData } = state;
  switch (type) {
    case SAVE_FORM_DATA:
      return {
        ...state,
        apiFormData: {
          ...apiFormData,
          ...payload,
        },
      };
    default:
      return state;
  }
};
