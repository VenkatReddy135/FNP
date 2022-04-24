import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
// eslint-disable-next-line import/no-extraneous-dependencies
import { Provider } from "react-redux";
import configureStore from "redux-mock-store";
import { mount } from "enzyme";
import Weightage from "../index";

/**
 * @function findComponentByDataTest
 *
 * @param {component} component component to find test data
 * @param {string} value value to match the data-test
 * @returns {component} component
 */
const findComponentByDataTest = (component, value) => component.find(`[data-test='${value}']`);

describe("WeightageComponent", () => {
  const initialState = {
    columbus: {
      apiFormData: {
        weightage: { ProductPrice: 45, ProductBrand: 30, ProductName: 25 },
        weightageFormValues: [
          { fieldName: "ProductPrice", fieldDisplayName: "Product Price", fieldVal: 45 },
          { fieldName: "ProductBrand", fieldDisplayName: "Product brand", fieldVal: 30 },
          { fieldName: "ProductName", fieldDisplayName: "Product Name", fieldVal: 25 },
        ],
      },
    },
  };
  const initialStateForInvalidValue = {
    columbus: {
      apiFormData: {
        weightage: { ProductPrice: -45, ProductBrand: 30, ProductName: 25 },
        weightageFormValues: [
          { fieldName: "ProductPrice", fieldDisplayName: "Product Price", fieldVal: -45 },
          { fieldName: "ProductBrand", fieldDisplayName: "Product brand", fieldVal: 30 },
          { fieldName: "ProductName", fieldDisplayName: "Product Name", fieldVal: 25 },
        ],
      },
    },
  };
  const mockStore = configureStore();
  const store = mockStore(initialState);
  const storeWithInvalidValue = mockStore(initialStateForInvalidValue);

  test("should check total must be 100", () => {
    const {
      apiFormData: { weightage },
    } = initialState.columbus;
    const total = Object.keys(weightage).reduce((totalValue, key) => {
      return totalValue + weightage[key];
    }, 0);
    expect(total).toBe(100);
  });

  test("should disable update button when invalid values are entered", () => {
    const wrapper = mount(
      <Provider store={storeWithInvalidValue}>
        <Router>
          <Weightage domain="FNP.com" />
        </Router>
      </Provider>,
    );
    expect(findComponentByDataTest(wrapper, "updateButton").last().hasClass("Mui-disabled")).toBe(true);
  });

  test("total must be 100", () => {
    const wrapper = mount(
      <Provider store={store}>
        <Router>
          <Weightage domain="FNP.com" />
        </Router>
      </Provider>,
    );

    const ProductPrice = findComponentByDataTest(wrapper, "ProductPrice").get(0).props.value;
    const ProductBrand = findComponentByDataTest(wrapper, "ProductBrand").get(0).props.value;
    const ProductName = findComponentByDataTest(wrapper, "ProductName").get(0).props.value;
    const total = ProductPrice + ProductBrand + ProductName;
    expect(total).toEqual(100);
  });
});
