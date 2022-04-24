import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import PriceRuleManagementList from "../index";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
  Button: jest.fn(),
}));

describe("Price Rule Management List test cases", () => {
  let result;
  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<PriceRuleManagementList />);
    result = shallowRenderer.getRenderOutput();
  });

  it("should render Price Rule Management list component", () => {
    expect(result).toBeTruthy();
  });

  afterEach(() => {
    cleanup();
  });
});
