import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import AttributesList from "../AttributesList";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
}));

describe("Feature List test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<AttributesList />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render list component", () => {
    expect(result).toBeTruthy();
  });

  it("should include grid title", () => {
    const label = result.props.children[0].props.gridTitle;
    expect(label).toBe("Attributes");
  });

  it("should include search label", () => {
    const label = result.props.children[0].props.searchLabel;
    expect(label).toBe("search");
  });

  it("should have 3 buttons for filled grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForGrid;
    expect(buttons.length).toBe(2);
  });

  it("should have 3 buttons for empty grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForEmptyGrid;
    expect(buttons.length).toBe(2);
  });
});
