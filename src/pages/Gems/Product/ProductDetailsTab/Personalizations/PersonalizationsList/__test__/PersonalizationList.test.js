import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FeatureList from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
}));

describe("Personalization List test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<FeatureList />);
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
    expect(label).toBe("personalizations");
  });

  it("should have 1 button for filled grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForGrid;
    expect(buttons.length).toBe(1);
  });

  it("should have 1 buttons for empty grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForEmptyGrid;
    expect(buttons.length).toBe(1);
  });
});
