import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ComponentPriceRuleManagerEdit from "../index";
import { NIFTY_PAGE_TYPE } from "../../../../niftyConfig";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
}));

describe("Customer Delivery Charges Edit", () => {
  let result;
  let resultProps;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<ComponentPriceRuleManagerEdit />);
    result = renderer1.getRenderOutput();
    resultProps = result.props;
  });

  it("should render Base Price Edit UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have page title", () => {
    expect(resultProps.pageTitle).toBeDefined();
  });

  it("should have edit as mode", () => {
    expect(resultProps.mode).toEqual(NIFTY_PAGE_TYPE.EDIT);
  });

  afterEach(() => {
    cleanup();
  });
});
