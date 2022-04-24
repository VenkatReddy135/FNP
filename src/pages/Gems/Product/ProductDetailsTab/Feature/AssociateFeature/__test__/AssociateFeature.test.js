/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import AssociateFeature from "..";

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

describe(`AssociateFeature Component test cases`, () => {
  const props = { match: { params: { id: "P_00000122" } } };
  beforeEach(() => {
    render(<AssociateFeature {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getByText("associate_feature")).toBeTruthy();
  });

  it(`should render feature_type_name autocomplete `, () => {
    expect(screen.getByTestId("feature_type_name")).toBeTruthy();
  });

  it(`should render composition feature_value autocomplete `, () => {
    expect(screen.getByTestId("feature_value")).toBeTruthy();
  });
});
