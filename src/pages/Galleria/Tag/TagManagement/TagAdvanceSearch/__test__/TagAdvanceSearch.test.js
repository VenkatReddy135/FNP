import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import TagAdvanceSearch from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  useRedirect: () => jest.fn(),
}));

describe("Tag Advance Search test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<TagAdvanceSearch />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render tag advance search component", () => {
    expect(result).toBeTruthy();
  });

  it("should have tag id autocomplete", () => {
    const field =
      result.props.children[2].props.children.props.children[0].props.children[1].props.children.props.label;
    expect(field).toBe("tag_id");
  });

  it("should have tag name autocomplete", () => {
    const field =
      result.props.children[2].props.children.props.children[1].props.children[1].props.children.props.label;
    expect(field).toBe("tag_name");
  });
});
