import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CategoryAttributesCreate from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useMutation: () => [() => {}],
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useHistory: jest.fn(),
  required: () => true,
}));

describe("Category Attributes Create test cases", () => {
  let result;
  const match = {
    params: {
      categoryId: "10049830",
    },
  };

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(<CategoryAttributesCreate match={match} />);
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Category Attributes Create component", () => {
    expect(result).toBeTruthy();
  });

  it("should have new attribute label", () => {
    const label = result.props.children[0].props.children[0].props.children;
    expect(label).toBe("new_attribute");
  });

  it("should have text input", () => {
    const label = result.props.children[0].props.children[1].props.children.props["data-testid"];
    expect(label).toBe("text-input");
  });

  it("should have create button", () => {
    const label = result.props.children[0].props.children[1].props.toolbar.props.saveButtonLabel;
    expect(label).toBe("create");
  });
});
