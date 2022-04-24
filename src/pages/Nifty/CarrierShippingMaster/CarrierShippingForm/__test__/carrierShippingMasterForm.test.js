import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CarrierShippingMasterForm from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  FormWithRedirect: jest.fn(),
  FormDataConsumer: jest.fn(),
  SelectInput: jest.fn(),
  TextInput: jest.fn(),
  BooleanInput: jest.fn(),
  regex: jest.fn(),
}));

describe("Carrier Shipping Master Create", () => {
  let result;
  let form;
  let firstFormRow;
  let secondFormRow;
  let thirdFormRow;
  let sixthFormRow;
  let eighthFormRow;
  const initialState = { shippingRateTypeConfig: "", shippingRateType: "" };
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CarrierShippingMasterForm initialState={initialState} mode="create" />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = { form: {} };
    const formRenderer = result.props.children[3].props.children.props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    const formDataConsumer = form.props.children[5].props.children;
    firstFormRow = form.props.children[0].props;
    secondFormRow = form.props.children[1].props;
    thirdFormRow = form.props.children[2].props;
    sixthFormRow = formDataConsumer(initialState).props;
    eighthFormRow = form.props.children[7].props;
  });

  it("should render Carrier Shipping Master Form UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have configurationCode as data-test-id", () => {
    const configurationCode = firstFormRow.children[0].props.children.props["data-test-id"];
    expect(configurationCode).toEqual("configurationCode");
  });

  it("should have geo as data-test-id", () => {
    const geo = firstFormRow.children[1].props.children.props["data-test-id"];
    expect(geo).toEqual("geo");
  });

  it("should have fulfillmentCenter as data-test-id", () => {
    const fulfillmentCenter = firstFormRow.children[2].props.children.props["data-test-id"];
    expect(fulfillmentCenter).toEqual("fulfillmentCenter");
  });

  it("should have uomValues as data-test-id", () => {
    const uomValues = firstFormRow.children[3].props.children.props["data-test-id"];
    expect(uomValues).toEqual("uomValues");
  });

  it("should have originGeo as data-test-id", () => {
    const originGeo = secondFormRow.children[0].props.children.props["data-test-id"];
    expect(originGeo).toEqual("originGeo");
  });

  it("should have carrierName as data-test-id", () => {
    const carrierName = secondFormRow.children[1].props.children.props["data-test-id"];
    expect(carrierName).toEqual("carrierName");
  });

  it("should have shippingRateType as data-test-id", () => {
    const shippingRateType = secondFormRow.children[2].props.children.props["data-test-id"];
    expect(shippingRateType).toEqual("shippingRateType");
  });

  it("should have uomTypes as data-test-id", () => {
    const uomTypes = secondFormRow.children[3].props.children.props["data-test-id"];
    expect(uomTypes).toEqual("uomTypes");
  });

  it("should have geoGroup as data-test-id", () => {
    const geoGroup = thirdFormRow.children[0].props.children.props["data-test-id"];
    expect(geoGroup).toEqual("geoGroup");
  });

  it("should have currency as data-test-id", () => {
    const currency = thirdFormRow.children[1].props.children.props["data-test-id"];
    expect(currency).toEqual("currency");
  });

  it("should have shippingRateTypeConfig as data-test-id", () => {
    const shippingRateTypeConfig = thirdFormRow.children[2].props.children.props["data-test-id"];
    expect(shippingRateTypeConfig).toEqual("shippingRateTypeConfig");
  });

  it("should have shippingMethodName as data-test-id", () => {
    const shippingMethodName = thirdFormRow.children[3].props.children.props["data-test-id"];
    expect(shippingMethodName).toEqual("shippingMethodName");
  });

  it("should have timeSlot as data-test-id", () => {
    const timeSlot = form.props.children[3].props.children.props.children.props["data-test-id"];
    expect(timeSlot).toEqual("timeSlot");
  });

  it("should have isEnabled as data-test-id", () => {
    const isEnabled = form.props.children[4].props.children.props.children.props["data-test-id"];
    expect(isEnabled).toEqual("isEnabled");
  });

  it("should have Manage Shipment Rate Type Configuration button", () => {
    const shipmentConfig = sixthFormRow.children[0].props.children.props.children;
    expect(shipmentConfig).toEqual("carrierShippingPriceMaster.manage_shipment_rate_type_configuration");
  });

  it("should have cancel button", () => {
    const cancelLabel = eighthFormRow.children[0].props.children;
    expect(cancelLabel).toEqual("cancel");
  });

  it("should have add button", () => {
    const addLabel = eighthFormRow.children[1].props.children;
    expect(addLabel).toEqual("add");
  });

  afterEach(() => {
    cleanup();
  });
});
