import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import TagViewEditUI from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  useRedirect: () => jest.fn(),
}));

describe("tag ViewEdit test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<TagViewEditUI id="anniversary" />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render tag ViewEdit UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have tag name label", () => {
    const field = result.props.children[0].props.children[1].props.children[0].props.children[0].props.children;
    expect(field).toBe("tag_name");
  });

  it("should have tag id label", () => {
    const field = result.props.children[0].props.children[1].props.children[1].props.children[0].props.children;
    expect(field).toBe("tag_id");
  });

  it("should have tag type label", () => {
    const field = result.props.children[0].props.children[1].props.children[2].props.children[0].props.children;
    expect(field).toBe("tag_type");
  });
});
