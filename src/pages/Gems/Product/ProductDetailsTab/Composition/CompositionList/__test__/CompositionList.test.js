import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CompositionList from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
}));

describe("Composition List test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<CompositionList />);
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
    expect(label).toBe("composition");
  });

  it("should have 2 buttons for filled grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForGrid;
    expect(buttons.length).toBe(2);
  });

  it("should have 2 buttons for empty grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForEmptyGrid;
    expect(buttons.length).toBe(2);
  });
});
