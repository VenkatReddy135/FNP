import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import BasePriceViewHistory from "../index";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
}));

describe("BasePriceViewHistory list test cases", () => {
  let result;
  let labels;
  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<BasePriceViewHistory />);
    result = shallowRenderer.getRenderOutput();
    labels = result.props.children[1].props;
  });

  it("should render BasePriceViewHistory list component", () => {
    expect(result).toBeTruthy();
  });

  it("should include grid title to be View History", () => {
    const title = labels.gridTitle;
    expect(title).toBe("view_history");
  });

  it("should include first column label to be User", () => {
    const FirstColumnLabel = labels.configurationForGrid[0].label;
    expect(FirstColumnLabel).toBe("user");
  });
  it("should include grid filters to be null", () => {
    const filter = labels.filters;
    expect(filter).toBe(null);
  });
  it("should include actionButtonForEmptyGrid length to be 1", () => {
    const searchLabel = labels.actionButtonsForEmptyGrid;
    expect(searchLabel.length).toBe(1);
  });
  afterEach(() => {
    cleanup();
  });
});
