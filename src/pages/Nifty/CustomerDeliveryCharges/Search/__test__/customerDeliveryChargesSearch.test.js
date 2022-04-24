import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CustomerDeliveryChargesSearch from "../index";
import { DEFAULT_IN_OPERATOR } from "../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  FormWithRedirect: jest.fn(),
  FormDataConsumer: jest.fn(),
}));

const initialState = {
  currency: "Indian Rupee",
  currencyOperator: DEFAULT_IN_OPERATOR,
  deliveryArea: "",
  deliveryAreaOperator: DEFAULT_IN_OPERATOR,
  domain: "fnp.com",
  domainOperator: DEFAULT_IN_OPERATOR,
  geo: "",
  geoOperator: DEFAULT_IN_OPERATOR,
  productType: "",
  productTypeOperator: DEFAULT_IN_OPERATOR,
  shippingMethod: "",
  shippingMethodOperator: DEFAULT_IN_OPERATOR,
  timeSlot: "",
  timeSlotOperator: DEFAULT_IN_OPERATOR,
  status: true,
  currencyList: [],
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

describe("Customer Delivery Charges Search", () => {
  let result;
  let form;
  let firstFormRow;
  let secondFormRow;

  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CustomerDeliveryChargesSearch />);
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
    firstFormRow = formDataConsumer.props.children[0].props.children[0].props.children;
    secondFormRow = formDataConsumer.props.children[0].props.children[1].props.children;
  });

  test("Search form container exists", () => {
    expect(form).toBeTruthy();
  });

  test("Search form domain operator exists", () => {
    expect(firstFormRow[0].props.children.props.testId).toEqual("domainOperator");
  });

  test("Search form domain exists", () => {
    expect(firstFormRow[1].props.children.props.source).toEqual("domain");
  });

  test("Search form geo operator exists", () => {
    expect(firstFormRow[2].props.children.props.testId).toEqual("geoOperator");
  });

  test("Search form geo exists", () => {
    expect(firstFormRow[3].props.children.props.source).toEqual("geo");
  });

  test("Search form geo group operator exists", () => {
    expect(firstFormRow[4].props.children.props.testId).toEqual("geoGroupOperator");
  });

  test("Search form geo group exists", () => {
    expect(firstFormRow[5].props.children.props.source).toEqual("geoGroup");
  });

  test("Search form shipping method name operator exists", () => {
    expect(secondFormRow[0].props.children.props.testId).toEqual("shippingMethodNameOperator");
  });

  test("Search form shipping method name exists", () => {
    expect(secondFormRow[1].props.children.props.source).toEqual("shippingMethodName");
  });

  test("Search form currency operator exists", () => {
    expect(secondFormRow[2].props.children.props.testId).toEqual("currencyOperator");
  });

  test("Search form currency exists", () => {
    expect(secondFormRow[3].props.children.props.source).toEqual("currency");
  });

  test("Search form time slot operator exists", () => {
    expect(secondFormRow[4].props.children.props.testId).toEqual("timeSlotOperator");
  });

  test("Search form time slot exists", () => {
    expect(secondFormRow[5].props.children.props.source).toEqual("timeSlot");
  });

  test("Search form product type operator exists", () => {
    expect(secondFormRow[6].props.children.props.testId).toEqual("productTypeOperator");
  });

  test("Search form product type exists", () => {
    expect(secondFormRow[7].props.children.props.source).toEqual("productType");
  });

  test("Search form isEnabled default value should be true", () => {
    expect(secondFormRow[8].props.children[1].props.record).toEqual(true);
  });

  afterEach(() => {
    cleanup();
  });
});
