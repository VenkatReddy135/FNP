import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import TagList from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  useTranslate: () => (label) => label,
}));

jest.mock("react-router-dom", () => ({
  useHistory: () => {
    return {
      location: {
        search: "",
      },
    };
  },
}));

describe("Tag List test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<TagList />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Tag list component", () => {
    expect(result).toBeTruthy();
  });

  it("should include grid title", () => {
    const label = result.props.children[0].props.gridTitle;
    expect(label).toBe("tag_management");
  });

  it("should include search label", () => {
    const label = result.props.children[0].props.searchLabel;
    expect(label).toBe("tag_management_search_label");
  });

  it("should have 3 buttons for filled grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForGrid;
    expect(buttons.length).toBe(3);
  });

  it("should have 2 buttons for empty grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForEmptyGrid;
    expect(buttons.length).toBe(2);
  });
});
