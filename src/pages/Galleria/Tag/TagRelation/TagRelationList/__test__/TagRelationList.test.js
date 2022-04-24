import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import TagRelationList from "../TagRelationList";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useHistory: () => {},
}));

describe("Tag relation List test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<TagRelationList id="anniversary" />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render tag-relation list component", () => {
    expect(result).toBeTruthy();
  });

  it("should include grid title", () => {
    const label = result.props.children[0].props.gridTitle;
    expect(label).toBe("tag_relations_and_associations");
  });

  it("should include search label", () => {
    const label = result.props.children[0].props.searchLabel;
    expect(label).toBe("search_by_tag_relation");
  });

  it("should have 4 buttons for filled grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForGrid;
    expect(buttons.length).toBe(4);
  });

  it("should have 2 buttons for empty grid", () => {
    const buttons = result.props.children[0].props.actionButtonsForEmptyGrid;
    expect(buttons.length).toBe(2);
  });
});
