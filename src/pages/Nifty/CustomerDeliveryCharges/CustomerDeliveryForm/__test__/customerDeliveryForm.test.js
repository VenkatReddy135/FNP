import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CustomerDeliveryChargesForm from "../CustomerDeliveryForm";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

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
  TextInput: jest.fn(),
  FormDataConsumer: jest.fn(),
  regex: jest.fn(),
}));

const initialState = {};

describe("Customer Delivery Charges Create", () => {
  let result;
  let form;
  let firstFormRow;
  let secondFormRow;
  let thirdFormRow;
  let fourthFormRow;
  let fifthFormRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CustomerDeliveryChargesForm mode={NIFTY_PAGE_TYPE.CREATE} />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {};
    const formRenderer = result.props.children[3].props.children.props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    firstFormRow = form.props.children[0].props;
    secondFormRow = form.props.children[1].props;
    thirdFormRow = form.props.children[2].props;
    fourthFormRow = form.props.children[3].props;
    fifthFormRow = form.props.children[4].props;
  });

  it("should render Customer Delivery Charges UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have domain as data-test-id", () => {
    const domain = firstFormRow.children[0].props.children.props["data-test-id"];
    expect(domain).toEqual("domain");
  });

  it("should have geo as data-test-id", () => {
    const formDataConsumer = firstFormRow.children[1].props.children.props.children;
    const field = formDataConsumer(initialState).props["data-test-id"];
    expect(field).toEqual("geo");
  });

  it("should have configurationCode as data-test-id", () => {
    const configurationCode = firstFormRow.children[2].props.children.props["data-test-id"];
    expect(configurationCode).toEqual("configurationCode");
  });

  it("should have geoGroup as data-test-id", () => {
    const geoGroup = secondFormRow.children[0].props.children.props["data-test-id"];
    expect(geoGroup).toEqual("geoGroup");
  });

  it("should have shippingMethodName as data-test-id", () => {
    const shippingMethodName = secondFormRow.children[1].props.children.props["data-test-id"];
    expect(shippingMethodName).toEqual("shippingMethodName");
  });

  it("should have productType as data-test-id", () => {
    const productType = secondFormRow.children[2].props.children.props["data-test-id"];
    expect(productType).toEqual("productType");
  });

  it("should have timeSlot as data-test-id", () => {
    const timeSlot = thirdFormRow.children[0].props.children.props["data-test-id"];
    expect(timeSlot).toEqual("timeSlot");
  });

  it("should have customerDeliveryCharges as data-test-id", () => {
    const customerDeliveryCharges = thirdFormRow.children[1].props.children.props["data-test-id"];
    expect(customerDeliveryCharges).toEqual("customerDeliveryCharges");
  });

  it("should have currency as data-test-id", () => {
    const currency = thirdFormRow.children[2].props.children.props["data-test-id"];
    expect(currency).toEqual("currency");
  });

  it("should have isEnabled as data-test-id", () => {
    const isEnabled = fourthFormRow.children.props.children.props["data-test-id"];
    expect(isEnabled).toEqual("isEnabled");
  });

  test("Customer delivery charges form cancel button exists", () => {
    const cancelButtonLabel = fifthFormRow.children[0].props.children;
    expect(cancelButtonLabel).toEqual("cancel");
  });

  test("Customer delivery charges form add button exists", () => {
    const addButtonLabel = fifthFormRow.children[1].props.children;
    expect(addButtonLabel).toEqual("add");
  });

  afterEach(() => {
    cleanup();
  });
});
