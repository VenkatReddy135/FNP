import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import BasePriceCreate from "../index";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
}));

const initialState = {
  geography: "",
  salesPercentage: "",
  deliveryCharges: "",
  lookBackPeriod: "Number of Days",
  ppCalculationMethod: "",
  ceilingAmount: "",
  fallBackCarrierCharges: "",
  includeDeliveryCharge: "Yes",
  currency: "",
  status: true,
  currencyOptions: [],
};

describe("Base Price Create", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<BasePriceCreate />);
    result = renderer1.getRenderOutput();
  });

  it("should render Base Price Create UI component", () => {
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
