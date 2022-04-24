import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CarrierShippingMasterSearch from "../index";
import { DEFAULT_EQUALS_OPERATOR, DEFAULT_IN_OPERATOR } from "../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  BooleanInput: jest.fn(),
  FormDataConsumer: jest.fn(),
  SelectInput: jest.fn(),
  FormWithRedirect: jest.fn(),
}));

const initialState = {
  carrierName: "",
  carrierNameOperator: DEFAULT_EQUALS_OPERATOR,
  originGeo: "",
  originGeoOperator: DEFAULT_IN_OPERATOR,
  geo: "",
  geoOperator: DEFAULT_IN_OPERATOR,
  shippingMethodName: "",
  shippingMethodNameOperator: DEFAULT_IN_OPERATOR,
  shippingRateType: "",
  shippingRateTypeOperator: DEFAULT_IN_OPERATOR,
  currency: "",
  currencyOperator: DEFAULT_IN_OPERATOR,
  fulfillmentCenterName: "",
  fulfillmentCenterNameOperator: DEFAULT_IN_OPERATOR,
  isEnabled: true,
};

/**
 * @function getValues function to return state
 * @returns {object} return object
 */
const getValues = () => {
  return {
    values: initialState,
  };
};

describe("Carrier Shipping Master Search", () => {
  let result;
  let form;
  let firstFormRow;
  let secondFormRow;
  let thirdFormRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CarrierShippingMasterSearch />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {
      form: {
        getState: getValues,
      },
    };
    const formRenderer = result.props.children[3].props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    const formDataConsumer = form.props.children.props.children({ formData: initialState });
    firstFormRow = formDataConsumer.props.children[0].props.children;
    secondFormRow = formDataConsumer.props.children[1].props.children;
    thirdFormRow = formDataConsumer.props.children[2].props.children;
  });

  test("Search form container exists", () => {
    expect(form).toBeTruthy();
  });

  test("Search form carrier name operator exists", () => {
    const carrierNameOperator = firstFormRow[0].props.children.props.testId;
    expect(carrierNameOperator).toEqual("carrierNameOperator");
  });

  test("Search form carrier name exists", () => {
    const carrierName = firstFormRow[1].props.children.props.source;
    expect(carrierName).toEqual("carrierName");
  });

  test("Search form origin geo operator exists", () => {
    const originGeoOperator = firstFormRow[2].props.children.props.testId;
    expect(originGeoOperator).toEqual("originGeoOperator");
  });

  test("Search form origin geo exists", () => {
    const originGeo = firstFormRow[3].props.children.props.source;
    expect(originGeo).toEqual("originGeo");
  });

  test("Search form shipping method name operator exists", () => {
    const shippingMethodNameOperator = secondFormRow[0].props.children.props.testId;
    expect(shippingMethodNameOperator).toEqual("shippingMethodNameOperator");
  });

  test("Search form shipping method name exists", () => {
    const shippingMethodName = secondFormRow[1].props.children.props.source;
    expect(shippingMethodName).toEqual("shippingMethodName");
  });

  test("Search form shipping rate type operator exists", () => {
    const shippingRateTypeOperator = secondFormRow[2].props.children.props.testId;
    expect(shippingRateTypeOperator).toEqual("shippingRateTypeOperator");
  });

  test("Search form shipping rate type exists", () => {
    const shippingRateType = secondFormRow[3].props.children.props.source;
    expect(shippingRateType).toEqual("shippingRateType");
  });

  test("Search form currency operator exists", () => {
    const currencyOperator = secondFormRow[4].props.children.props.testId;
    expect(currencyOperator).toEqual("currencyOperator");
  });

  test("Search form currency exists", () => {
    const currency = secondFormRow[5].props.children.props.source;
    expect(currency).toEqual("currency");
  });

  test("Search form fulfillment center name operator exists", () => {
    const fulfillmentCenterNameOperator = thirdFormRow[0].props.children.props.testId;
    expect(fulfillmentCenterNameOperator).toEqual("fulfillmentCenterNameOperator");
  });

  test("Search form fulfillment center name exists", () => {
    const fulfillmentCenterName = thirdFormRow[1].props.children.props.source;
    expect(fulfillmentCenterName).toEqual("fulfillmentCenterName");
  });

  test("Search form is enabled exists", () => {
    const isEnabled = thirdFormRow[2].props.children.props["data-test-id"];
    expect(isEnabled).toEqual("isEnabled");
  });

  afterEach(() => {
    cleanup();
  });
});
