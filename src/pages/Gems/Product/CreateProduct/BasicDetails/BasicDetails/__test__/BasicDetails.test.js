/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import BasicDetails from "../BasicDetails";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  SelectInput: "SelectInput",
  TextInput: "TextInput",
}));

describe(`BasicDetails Component test cases`, () => {
  const props = { isEditable: true };

  beforeEach(() => {
    render(<BasicDetails {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the product_id without crashing `, () => {
    expect(screen.getByTestId("product_id")).toBeTruthy();
  });
  it(`should render the product_classification without crashing `, () => {
    expect(screen.getByTestId("product_classification")).toBeTruthy();
  });
  it(`should render the product_url without crashing `, () => {
    expect(screen.getByTestId("product_url")).toBeTruthy();
  });
  it(`should render the sku_code without crashing `, () => {
    expect(screen.getByTestId("sku_code")).toBeTruthy();
  });
  it(`should render the product_name without crashing `, () => {
    expect(screen.getByTestId("product_name")).toBeTruthy();
  });
  it(`should render the display_name without crashing `, () => {
    expect(screen.getByTestId("display_name")).toBeTruthy();
  });
  it(`should render the productState without crashing `, () => {
    expect(screen.getByTestId("productState")).toBeTruthy();
  });
  it(`should render the type_id without crashing `, () => {
    expect(screen.getByTestId("type_id")).toBeTruthy();
  });
  it(`should render the sub_type_id without crashing `, () => {
    expect(screen.getByTestId("sub_type_id")).toBeTruthy();
  });
});
