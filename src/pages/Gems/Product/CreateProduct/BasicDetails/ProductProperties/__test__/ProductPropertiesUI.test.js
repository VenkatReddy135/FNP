/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ProductPropertiesUI from "../ProductPropertiesUI";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  SelectInput: "SelectInput",
  TextInput: "TextInput",
  NumberInput: "NumberInput",
}));

describe(`BasicDetails Component test cases`, () => {
  const props = { isEditable: true, state: {} };

  beforeEach(() => {
    render(<ProductPropertiesUI {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the product_properties without crashing `, () => {
    expect(screen.getByTestId("product_properties")).toBeTruthy();
  });
  it(`should render the minimum_order_quantity_corporate without crashing `, () => {
    expect(screen.getByTestId("minimum_order_quantity_corporate")).toBeTruthy();
  });
  it(`should render the maximum_order_quantity_b2c without crashing `, () => {
    expect(screen.getByTestId("maximum_order_quantity_b2c")).toBeTruthy();
  });
  it(`should render the brand_name without crashing `, () => {
    expect(screen.getByTestId("brand_name")).toBeTruthy();
  });
  it(`should render the test_product_country without crashing `, () => {
    expect(screen.getByTestId("test_product_country")).toBeTruthy();
  });
  it(`should render the test_length without crashing `, () => {
    expect(screen.getByTestId("test_length")).toBeTruthy();
  });
  it(`should render the test_breadth without crashing `, () => {
    expect(screen.getByTestId("test_breadth")).toBeTruthy();
  });
  it(`should render the test_height without crashing `, () => {
    expect(screen.getByTestId("test_height")).toBeTruthy();
  });
  it(`should render the test_weight without crashing `, () => {
    expect(screen.getByTestId("test_weight")).toBeTruthy();
  });
  it(`should render the cubic_volume without crashing `, () => {
    expect(screen.getByTestId("cubic_volume")).toBeTruthy();
  });
});
