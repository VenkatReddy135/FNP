import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import Capping from "../index";

/**
 * @function findComponentByDataTest
 *
 * @param {component} component component to find test data
 * @param {string} value value to match the data-test
 * @returns {component} component
 */
const findComponentByDataTest = (component, value) => component.find(`[data-test='${value}']`);

describe("Capping component", () => {
  const initialState = {
    columbus: {
      apiFormData: {
        capping: { totalResult: 6, boostedSearch: 2, recentSearch: 2, popularSearch: 2 },
      },
    },
  };
  const invalidInitialState = {
    columbus: {
      apiFormData: {
        capping: { totalResult: -6, boostedSearch: 9, recentSearch: 12, popularSearch: 2 },
      },
    },
  };
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const inValidStore = mockStore(invalidInitialState);

  test("Capping should disable update button when invalid values are entered", () => {
    const wrapper = mount(
      <Provider store={inValidStore}>
        <Router>
          <Capping domain="FNP.com" />
        </Router>
      </Provider>,
    );
    expect(findComponentByDataTest(wrapper, "updateButton").last().hasClass("Mui-disabled")).toBe(true);
  });
  test("Total must be equals to boosted recent and popular", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <Capping domain="FNP.com" />
        </Router>
      </Provider>,
    );
    const totalResult = findComponentByDataTest(wrapper, "totalResult").get(0).props.value;
    const boostedSearch = findComponentByDataTest(wrapper, "boostedSearch").get(0).props.value;
    const recentSearch = findComponentByDataTest(wrapper, "recentSearch").get(0).props.value;
    const popularSearch = findComponentByDataTest(wrapper, "popularSearch").text() * 1;
    const searchTotal = boostedSearch + recentSearch + popularSearch;
    expect(searchTotal).toEqual(totalResult);
  });
});
