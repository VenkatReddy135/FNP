/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ComponentPriceRuleManagerForm from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  FormWithRedirect: jest.fn(),
  SelectInput: jest.fn(),
  FormDataConsumer: jest.fn(),
  TextInput: jest.fn(),
  DateInput: jest.fn(),
  regex: jest.fn(),
}));

const formState = {};
const initialState = {
  ruleName: "",
  fulfillmentGeo: "",
  FCGroupId: "",
  ruleAppliedOn: "Component Names",
  componentValues: "",
  overrideType: "Flat Amount Update",
  overrideValue: "",
  fromDate: "",
  toDate: "",
  currency: "",
  state: "Pending",
  currencyOptions: [],
};

/**
 * @function getValues function to return state
 * @returns {object} return object
 */
const getValues = () => {
  return {
    values: {
      currencyOptions: [],
    },
  };
};

describe("Component Price Rule Manager page", () => {
  let result;
  let form;
  let firstFormRow;
  let dataConsumer;
  let fourthFormRow;
  let fifthFormRow;
  let sixthFormRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ComponentPriceRuleManagerForm mode={NIFTY_PAGE_TYPE.CREATE} initialState={initialState} />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {
      form: {
        getState: getValues,
      },
    };
    const formRenderer = result.props.children[3].props.children.props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    const formDataConsumer = form.props.children[1].props.children;
    dataConsumer = formDataConsumer(formState).props;
    firstFormRow = form.props.children[0].props;
    fourthFormRow = dataConsumer.children[3].props;
    fifthFormRow = form.props.children[2].props;
    sixthFormRow = form.props.children[3].props;
  });

  test("Component price rule component should exist", () => {
    expect(result).toBeTruthy();
  });

  it("should have ruleName as data-test-id", () => {
    const ruleName = firstFormRow.children[0].props.children.props["data-test-id"];
    expect(ruleName).toEqual("ruleName");
  });

  it("should have fulfillmentGeo as data-test-id", () => {
    const fulfillmentGeo = firstFormRow.children[1].props.children.props["data-test-id"];
    expect(fulfillmentGeo).toEqual("fulfillmentGeo");
  });

  it("should have FCGroupId as data-test-id", () => {
    const FCGroupId = firstFormRow.children[2].props.children.props["data-test-id"];
    expect(FCGroupId).toEqual("FCGroupId");
  });

  it("should have ruleAppliedOn as data-test-id", () => {
    const ruleAppliedOn = dataConsumer.children[0].props.children[0].props.children.props["data-test-id"];
    expect(ruleAppliedOn).toEqual("ruleAppliedOn");
  });

  it("should have componentValues as data-test-id", () => {
    const componentValues = dataConsumer.children[0].props.children[1].props.children.props["data-test-id"];
    expect(componentValues).toEqual("componentValues");
  });

  it("should have fromDate as data-test-id", () => {
    const fromDate = dataConsumer.children[2].props.children[0].props.children.props["data-test-id"];
    expect(fromDate).toEqual("fromDate");
  });

  it("should have toDate as data-test-id", () => {
    const toDate = dataConsumer.children[2].props.children[1].props.children.props["data-test-id"];
    expect(toDate).toEqual("toDate");
  });

  it("should have override_type as data-test-id", () => {
    const overrideType = fourthFormRow.children[0].props.children[0].props.children.props["data-test-id"];
    expect(overrideType).toEqual("override_type");
  });

  it("should have overrideValue as data-test-id", () => {
    const overrideValue = fourthFormRow.children[0].props.children[1].props.children.props["data-test-id"];
    expect(overrideValue).toEqual("overrideValue");
  });

  it("should have currency as data-test-id", () => {
    const currency = fourthFormRow.children[2].props.children.props["data-test-id"];
    expect(currency).toEqual("currency");
  });

  test("should have state as data-test-id", () => {
    const state = fifthFormRow.children.props.children.props["data-test-id"];
    expect(state).toEqual("state");
  });

  test("component price rule form cancel button exists", () => {
    const cancelButtonLabel = sixthFormRow.children[0].props.children;
    expect(cancelButtonLabel).toEqual("cancel");
  });

  test("component price rule form update button exists", () => {
    const addButtonLabel = sixthFormRow.children[1].props.children;
    expect(addButtonLabel).toEqual("add");
  });

  afterEach(() => {
    cleanup();
  });
});
