import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CategoryViewUI from "../CategoryViewUI";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
}));

describe("Category Master View test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(
      <CategoryViewUI
        cancelTagHandler={() => {}}
        categoryObj={{}}
        onUpdateHandler={() => {}}
        editable={false}
        deleteHandler={() => {}}
        updateCheckbox={() => {}}
        categoryTypes={[]}
        checkedState={{}}
        handleEditable={() => {}}
      />,
    );
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render category master view component", () => {
    expect(result).toBeTruthy();
  });

  it("should have category details label", () => {
    const label = result.props.children.props.children[0].props.children[0].props.children;
    expect(label).toBe("category_details");
  });

  it("should have category id label", () => {
    const field = result.props.children.props.children[1].props.children[0].props.children[0].props.children;
    expect(field).toBe("category_id");
  });

  it("should have URL label", () => {
    const field = result.props.children.props.children[3].props.children.props.children.props.label;
    expect(field).toBe("URL");
  });
});
