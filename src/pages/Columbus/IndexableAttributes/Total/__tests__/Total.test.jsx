import React from "react";
import { shallow } from "enzyme";
import Total from "../index";

/**
 * @function findComponentByDataTest
 *
 * @param {component} component component to find test data
 * @param {string} value value to match the data-test
 * @returns {component} component
 */
const findComponentByDataTest = (component, value) => component.find(`[data-test='${value}']`);

describe("Total component", () => {
  test("should check total must be 100", () => {
    const wrapper = shallow(<Total isInvalidValue={false} total={100} />);
    const totalText = findComponentByDataTest(wrapper, "total").text();
    const total = totalText.replace("%", "") * 1;
    expect(total).toBe(100);
  });
});
