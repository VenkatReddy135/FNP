/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import OtherSKUIds from "../OtherSKUIDs";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  SelectInput: "SelectInput",
  TextInput: "TextInput",
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
}));

describe(`BasicDetails Component test cases`, () => {
  const props = { isEditable: true };

  beforeEach(() => {
    render(<OtherSKUIds {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the other_sku_ids without crashing `, () => {
    expect(screen.getByTestId("other_sku_ids")).toBeTruthy();
  });
  it(`should render the other_sku_types without crashing `, () => {
    expect(screen.getByTestId("other_sku_types")).toBeTruthy();
  });
  it(`should render the relations_created_by without crashing `, () => {
    expect(screen.getByTestId("relations_created_by")).toBeTruthy();
  });
  it(`should render the relations_created_date without crashing `, () => {
    expect(screen.getByTestId("relations_created_date")).toBeTruthy();
  });
  it(`should render the last_modified_by without crashing `, () => {
    expect(screen.getByTestId("last_modified_by")).toBeTruthy();
  });
  it(`should render the last_modified_date without crashing `, () => {
    expect(screen.getByTestId("last_modified_date")).toBeTruthy();
  });
});
