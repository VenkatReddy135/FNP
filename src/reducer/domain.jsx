import { SET_TAG_VALUE, GET_TAG_LIST_SUCCESS } from "../actions/domain";
import { tagDropDownMapping } from "../config/GlobalConfig";

const initialState = {
  domainData: {
    domain: "",
    list: [],
  },
  geoData: {
    geo: "",
    list: [],
  },
};

export default (state = initialState, { type, payload }) => {
  switch (type) {
    case SET_TAG_VALUE: {
      const { tagType, value } = payload;
      const tagObject = { ...state[tagType] };
      tagObject[tagDropDownMapping[tagType]] = value;
      return { ...state, [tagType]: tagObject };
    }
    case GET_TAG_LIST_SUCCESS: {
      const { tagType, list } = payload;
      const tagObject = { ...state[tagType] };
      tagObject.list = list;
      return {
        ...state,
        [tagType]: tagObject,
      };
    }
    default:
      return state;
  }
};
