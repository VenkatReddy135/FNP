import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CustomerDeliveryChargesCreate from "../index";
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
const initialState = {
  domain: "",
  geo: "",
  configurationCode: "",
  geoGroup: "",
  shippingMethodName: "",
  productType: [],
  timeSlot: [],
  customerDeliveryCharges: "",
  currency: "",
  isEnabled: true,
  currencyOptions: [],
};
describe("Customer Delivery Charges Create", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CustomerDeliveryChargesCreate />);
    result = renderer1.getRenderOutput();
  });

  it("should render Customer Delivery Charges UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have create as mode", () => {
    expect(result.props.mode).toEqual(NIFTY_PAGE_TYPE.CREATE);
  });

  it("should have passed initial state", () => {
    expect(result.props.initialState).toEqual(initialState);
  });

  afterEach(() => {
    cleanup();
  });
});
