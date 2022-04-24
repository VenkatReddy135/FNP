import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CategoryAttributesViewEditUI from "../CategoryAttributesViewEditUI";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
}));

describe("Category Attributes ViewEdit test cases", () => {
  let result;

  const initialFormData = {
    attributeName: "",
    attributeValue: "",
    createdAt: "",
    createdBy: "",
    updatedAt: "",
    updatedBy: "",
  };

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(
      <CategoryAttributesViewEditUI
        isEditable={false}
        editAttributeHandler={() => {}}
        deleteAttributeHandler={() => {}}
        updateAttributeHandler={() => {}}
        saveAttributeData={() => {}}
        closeForm={() => {}}
        categoryId="10054552"
        attributeId="7860744"
        open={false}
        toggleModal={() => {}}
        updateToggle={false}
        setUpdateToggle={() => {}}
        initialFormData={initialFormData}
      />,
    );
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Category Attributes ViewEdit UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have category attribute name label", () => {
    const field = result.props.children[0].props.children[0].props.children;
    expect(field).toBe("category_attribute_name");
  });

  it("should have attributeType label", () => {
    const field = result.props.children[1].props.children.props.children[0].props.children[0].props.label;
    expect(field).toBe("attribute_type");
  });

  it("should have attributeValue label", () => {
    const field = result.props.children[1].props.children.props.children[0].props.children[1].props.label;
    expect(field).toBe("attribute_value");
  });

  it("should have createdBy label", () => {
    const field = result.props.children[1].props.children.props.children[1].props.children[0].props.label;
    expect(field).toBe("createdBy");
  });

  it("should have createdDate label", () => {
    const field = result.props.children[1].props.children.props.children[1].props.children[1].props.label;
    expect(field).toBe("createdDate");
  });

  it("should have lastModifiedBy label", () => {
    const field = result.props.children[1].props.children.props.children[2].props.children[0].props.label;
    expect(field).toBe("lastModifiedBy");
  });

  it("should have lastModifiedDate label", () => {
    const field = result.props.children[1].props.children.props.children[2].props.children[1].props.label;
    expect(field).toBe("lastModifiedDate");
  });
});
