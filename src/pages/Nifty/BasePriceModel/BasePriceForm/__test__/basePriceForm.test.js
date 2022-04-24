import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import BasePriceForm from "../BasePriceForm";

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
  NumberInput: jest.fn(),
  BooleanInput: jest.fn(),
  FormDataConsumer: jest.fn(),
  TextInput: jest.fn(),
  DateInput: jest.fn(),
  regex: jest.fn(),
}));

const initialState = {};

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

describe("Base Price Create", () => {
  let result;
  let firstFormRow;
  let secondFormRow;
  let thirdFormRow;
  let fourthFormRow;
  let fifthFormRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<BasePriceForm mode="edit" />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {
      form: {
        getState: getValues,
      },
    };
    const formRenderer = result.props.children[3].props.children.props.render;
    const form = formRenderer({ handleSubmitWithRedirect, ...rest });
    const formDataConsumer = form.props.children[0].props.children;
    const basicForm = formDataConsumer(initialState).props;
    firstFormRow = basicForm.children[0].props;
    secondFormRow = basicForm.children[1].props;
    thirdFormRow = basicForm.children[2].props;
    fourthFormRow = basicForm.children[3].props;
    fifthFormRow = basicForm.children[4].props;
  });

  it("should render Base Price Form UI component", () => {
    expect(result).toBeTruthy();
  });

  test("Base Price Form breadcrumbs should exist", () => {
    expect(result.props.children[0].props.breadcrumbs).toBeTruthy();
  });

  test("Base Price Form title should exist", () => {
    expect(result.props.children[1].props.children[0].props).toBeTruthy();
  });

  it("should have modelId as data-test-id", () => {
    const modelId = firstFormRow.children[0].props.children.props["data-test-id"];
    expect(modelId).toEqual("modelId");
  });

  it("should have geo as data-test-id", () => {
    const geo = firstFormRow.children[1].props.children.props["data-test-id"];
    expect(geo).toEqual("geo");
  });

  it("should have sales_percentage as data-test-id", () => {
    const salesPercentage = firstFormRow.children[2].props.children.props["data-test-id"];
    expect(salesPercentage).toEqual("sales_percentage");
  });

  it("should have dc as data-test-id", () => {
    const dc = firstFormRow.children[3].props.children.props["data-test-id"];
    expect(dc).toEqual("dc");
  });

  it("should have look_back_period as data-test-id", () => {
    const lookBackPeriod = secondFormRow.children[0].props.children.props["data-test-id"];
    expect(lookBackPeriod).toEqual("look_back_period");
  });

  it("should have number_of_days as data-test-id", () => {
    const numOfDays = secondFormRow.children[1].props.children.props["data-test-id"];
    expect(numOfDays).toEqual("number_of_days");
  });

  it("should have pp_calc as data-test-id", () => {
    const ppCalc = thirdFormRow.children[1].props.children.props["data-test-id"];
    expect(ppCalc).toEqual("pp_calc");
  });

  it("should have ceilingAmount as data-test-id", () => {
    const ceilingAmount = thirdFormRow.children[2].props.children.props["data-test-id"];
    expect(ceilingAmount).toEqual("ceilingAmount");
  });

  it("should have fall_back_charges as data-test-id", () => {
    const fallBackCharges = thirdFormRow.children[3].props.children.props["data-test-id"];
    expect(fallBackCharges).toEqual("fall_back_charges");
  });

  it("should have incl_delivery_charge as data-test-id", () => {
    const includeDeliveryCharge = fourthFormRow.children[0].props.children.props["data-test-id"];
    expect(includeDeliveryCharge).toEqual("incl_delivery_charge");
  });

  it("should have currency as data-test-id", () => {
    const currency = fourthFormRow.children[1].props.children.props["data-test-id"];
    expect(currency).toEqual("currency");
  });

  it("should have status as data-test-id", () => {
    const status = fourthFormRow.children[2].props.children.props["data-test-id"];
    expect(status).toEqual("status");
  });

  test("Create form add button exists", () => {
    const cancelButtonLabel = fifthFormRow.children[0].props.children;
    expect(cancelButtonLabel).toEqual("cancel");
  });

  test("Base Price form update button exists", () => {
    const addButtonLabel = fifthFormRow.children[1].props.children;
    expect(addButtonLabel).toEqual("update");
  });

  afterEach(() => {
    cleanup();
  });
});
