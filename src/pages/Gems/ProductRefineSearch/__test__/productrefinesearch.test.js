/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ProductRefineSearch from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
  List: "List",
  ResourceContextProvider: "ResourceContextProvider",
  Datagrid: "Datagrid",
  MenuItemLink: "MenuItemLink",
  SimpleForm: "SimpleForm",
  SelectInput: "SelectInput",
}));

describe(`ProductRefineSearch Component test cases`, () => {
  beforeEach(() => {
    render(<ProductRefineSearch />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getByText("product_management")).toBeTruthy();
  });

  it(`should render skuId autocomplete `, () => {
    expect(screen.getByTestId("skuId")).toBeTruthy();
  });

  it(`should render prodId autocomplete `, () => {
    expect(screen.getByTestId("prodId")).toBeTruthy();
  });

  it(`should render prodName autocomplete `, () => {
    expect(screen.getByTestId("prodName")).toBeTruthy();
  });

  it(`should render classificationVal dropdown `, () => {
    expect(screen.getByTestId("classificationVal")).toBeTruthy();
  });

  it(`should render geoId autocomplete `, () => {
    expect(screen.getByTestId("geoId")).toBeTruthy();
  });

  it(`should render productTypeVal dropdown `, () => {
    expect(screen.getByTestId("productTypeVal")).toBeTruthy();
  });
});
