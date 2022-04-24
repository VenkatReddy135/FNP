import sortBy from "lodash/sortBy";

/**
 * @function updateStateByUtils to update state with help of utils of form
 * @param {object} utils utility by form
 * @param {string} state state to be updated
 * @param {string} source source for value
 * @param {(object|string|Array)} value type of value to be set to state
 */
const updateStateByUtils = (utils, state, source, value) => {
  utils.changeValue(state, source, () => value);
};

const campaignFormMutators = {
  setTagList: (args, state, utils) => {
    updateStateByUtils(utils, state, `${args[0]}`, [...args[1]]);
  },
  updateFilterCondition: (args, state, utils) => {
    updateStateByUtils(utils, state, `${args[0]}`, [...args[1]]);
  },
  clearRepeatAndTime: (args, state, utils) => {
    updateStateByUtils(utils, state, "repeat", "");
    updateStateByUtils(utils, state, "time", "");
  },
  clearOperator: (args, state, utils) => {
    args.forEach((arg) => {
      if (state.fields[`${arg}`]) {
        utils.resetFieldState(`${arg}`);
        updateStateByUtils(utils, state, `${arg}`, "");
      }
    });
  },
  setField: (args, state, utils) => {
    if (args.length > 0) {
      updateStateByUtils(utils, state, `${args[0]}`, args[1]);
    }
  },
  setGeoList: (args, state, utils) => {
    if (args.length > 0) {
      const sortedList = [...sortBy(args[0], ["name"])];
      if (!args[1]) {
        updateStateByUtils(utils, state, "geoId", []);
        utils.resetFieldState("geoId");
      }
      updateStateByUtils(utils, state, "geoList", sortedList);
    }
  },
  resetGeoList: (args, state, utils) => {
    utils.resetFieldState("geoList");
  },
  setDomainList: (args, state, utils) => {
    updateStateByUtils(utils, state, "domainList", [...args[0]]);
  },
  setGeoId: (args, state, utils) => {
    if (args.length > 0) {
      updateStateByUtils(utils, state, "geoId", [...args[0]]);
    }
  },
  setOperatorList: (args, state, utils) => {
    if (args.length > 0) {
      updateStateByUtils(utils, state, `${args[0]}`, [...args[1]]);
    }
  },
  resetFilters: (args, state, utils) => {
    updateStateByUtils(utils, state, "andConditions", [...args[0]]);
  },
  setAttributeList: (args, state, utils) => {
    updateStateByUtils(utils, state, "attributeList", [...args[0]]);
  },
  setShippingList: (args, state, utils) => {
    updateStateByUtils(utils, state, `${args[0]}`, [...args[1]]);
  },
};

export default campaignFormMutators;
