import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import LookBackWindow from "../index";

/**
 * @function findComponentByDataTest
 *
 * @param {component} component component to find test data
 * @param {string} value value to match the data-test
 * @returns {component} component
 */
const findComponentByDataTest = (component, value) => component.find(`[data-test='${value}']`);

describe("Look Back Window component", () => {
  const InValidInitialState = {
    columbus: {
      apiFormData: {
        lookBackWindow: { value: -5 },
      },
    },
  };
  const mockStore = configureStore();
  const invalidStore = mockStore(InValidInitialState);

  test("LookBack should disable update button when invalid values are entered", () => {
    const wrapper = mount(
      <Provider store={invalidStore}>
        <Router>
          <LookBackWindow domain="FNP.com" />
        </Router>
      </Provider>,
    );
    expect(findComponentByDataTest(wrapper, "updateButton").last().hasClass("Mui-disabled")).toBe(true);
  });
});
