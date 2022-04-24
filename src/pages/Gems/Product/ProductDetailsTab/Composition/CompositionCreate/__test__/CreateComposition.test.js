/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import CompositionCreate from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
  required: () => {},
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
  List: "List",
  ResourceContextProvider: "ResourceContextProvider",
  Datagrid: "Datagrid",
  MenuItemLink: "MenuItemLink",
  SimpleForm: "SimpleForm",
  SelectInput: "SelectInput",
  NumberInput: "NumberInput",
}));

describe(`CompositionCreate Component test cases`, () => {
  const props = { match: { params: { id: "P_00000122" } } };
  beforeEach(() => {
    render(<CompositionCreate {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getByText("new_composition")).toBeTruthy();
  });

  it(`should render prodSkuCode autocomplete `, () => {
    expect(screen.getByTestId("prodSkuCode")).toBeTruthy();
  });

  it(`should render composition Quantity input `, () => {
    expect(screen.getByTestId("compQuantity")).toBeTruthy();
  });

  it(`should render suggestedMarkup input `, () => {
    expect(screen.getByTestId("suggestedMarkup")).toBeTruthy();
  });
});
