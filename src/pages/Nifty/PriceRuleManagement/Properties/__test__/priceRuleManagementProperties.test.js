import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PriceRuleManagementProperties from "../index";
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

describe("Price Rule Management Properties", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<PriceRuleManagementProperties />);
    result = renderer1.getRenderOutput();
  });

  it("should render price management Properties UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have create as mode", () => {
    expect(result.props.mode).toEqual(NIFTY_PAGE_TYPE.CREATE);
  });

  afterEach(() => {
    cleanup();
  });
});
