import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CarrierShippingMasterView from "../index";
import { NIFTY_PAGE_TYPE } from "../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
}));

describe("Carrier Shipping Master View", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<CarrierShippingMasterView />);
    result = renderer1.getRenderOutput();
  });

  it("should render Carrier Shipping Master UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should be view mode", () => {
    const viewMode = result.props.mode;
    expect(viewMode).toEqual(NIFTY_PAGE_TYPE.VIEW);
  });

  afterEach(() => {
    cleanup();
  });
});
