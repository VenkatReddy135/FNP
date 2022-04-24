/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ProductConfigurations from "../ProductConfigurations";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  RadioButtonGroupInput: "RadioButtonGroupInput",
}));

describe(`BasicDetails Component test cases`, () => {
  const props = { isEditable: true };

  beforeEach(() => {
    render(<ProductConfigurations {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the product_configurations without crashing `, () => {
    expect(screen.getByTestId("product_configurations")).toBeTruthy();
  });
  it(`should render the is_perishable without crashing `, () => {
    expect(screen.getByTestId("is_perishable")).toBeTruthy();
  });
  it(`should render the is_reusable without crashing `, () => {
    expect(screen.getByTestId("is_reusable")).toBeTruthy();
  });
  it(`should render the is_breakable without crashing `, () => {
    expect(screen.getByTestId("is_breakable")).toBeTruthy();
  });
  it(`should render the is_searchable without crashing `, () => {
    expect(screen.getByTestId("is_searchable")).toBeTruthy();
  });
  it(`should render the include_in_product_feed without crashing `, () => {
    expect(screen.getByTestId("include_in_product_feed")).toBeTruthy();
  });
  it(`should render the include_in_product_sitemap without crashing `, () => {
    expect(screen.getByTestId("include_in_product_sitemap")).toBeTruthy();
  });
  it(`should render the is_enabled without crashing `, () => {
    expect(screen.getByTestId("is_enabled")).toBeTruthy();
  });
});
