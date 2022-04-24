/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import CategoryAdvanceSearch from "../SearchForm";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  useRedirect: () => jest.fn(),
}));

describe("Category Advance Search test cases", () => {
  let result;

  beforeEach(() => {
    const state = {
      values: { domain: "", geography: "", productType: "", occasion: "", city: "", recipient: "", party: "" },
      apiParams: {
        type: "getData",
        url: "",
        sortParam: "tagName",
      },
      operatorList: [],
      checkboxList: [],
      workflowStatus: [],
      tagTypes: [],
    };
    const shallowRenderer = new ShallowRenderer();
    shallowRenderer.render(
      <CategoryAdvanceSearch
        translate={(label) => label}
        classes={{}}
        handleAutocomplete={() => {}}
        searchTagsHandler={() => {}}
        checkboxHandler={() => {}}
        cancelHandler={() => {}}
        {...state}
      />,
    );
    result = shallowRenderer.getRenderOutput();
  });

  afterEach(() => {
    cleanup();
  });

  it("should render advance search", () => {
    expect(result).toBeTruthy();
  });

  it("should have 8 grids containing fields", () => {
    const fields = result.props.children.props.children.length;
    expect(fields).toBe(8);
  });
});
