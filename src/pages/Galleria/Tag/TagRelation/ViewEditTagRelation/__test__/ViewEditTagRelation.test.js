import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import ViewEditTagRelationsUI from "../ViewEditTagRelationsUI";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
}));

describe("ViewEdit Tag Relation test cases", () => {
  let result;

  beforeEach(() => {
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(
      <ViewEditTagRelationsUI
        responseData={{}}
        isEditable={false}
        id="anniversary"
        relationTypes={[]}
        showPopup={false}
        cancelTagHandler={() => {}}
        deleteToggleOpen={() => {}}
        switchToEditHandler={() => {}}
        handleIsEnabledChange={() => {}}
        editRelationObj={null || {}}
        handleUpdatedObj={() => {}}
        handleAutocompleteChange={() => {}}
        errorMsg={false}
      />,
    );
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render ViewEdit Tag Relation UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have relationType label", () => {
    const field = result.props.children.props.children[1].props.children[0].props.children.props.label;
    expect(field).toBe("relation_type");
  });

  it("should have relationTypeValue label", () => {
    const field = result.props.children.props.children[1].props.children[1].props.children.props.label;
    expect(field).toBe("relation_type_value");
  });

  it("should have sequence label", () => {
    const field = result.props.children.props.children[1].props.children[2].props.children.props.label;
    expect(field).toBe("sequence");
  });

  it("should have is_tag_relation_enabled label", () => {
    const field = result.props.children.props.children[2].props.children[0].props.children;
    expect(field).toBe("is_tag_relation_enabled");
  });

  it("should have relations_created_by label", () => {
    const field = result.props.children.props.children[3].props.children[0].props.label;
    expect(field).toBe("relations_created_by");
  });

  it("should have relations_created_date label", () => {
    const field = result.props.children.props.children[3].props.children[1].props.label;
    expect(field).toBe("relations_created_date");
  });

  it("should have last_modified_by label", () => {
    const field = result.props.children.props.children[4].props.children[0].props.label;

    expect(field).toBe("last_modified_by");
  });

  it("should have last_modified_date label", () => {
    const field = result.props.children.props.children[4].props.children[1].props.label;
    expect(field).toBe("last_modified_date");
  });
});
