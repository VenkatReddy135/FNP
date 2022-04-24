/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import EditFeature from "..";

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
  BooleanInput: "BooleanInput",
}));

describe(`edit feature Component test cases`, () => {
  const props = { match: { params: { pid: "P_00000100", fid: "PF_00001" } } };
  beforeEach(() => {
    render(<EditFeature {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getByText("edit_feature")).toBeTruthy();
  });

  it(`should render feature type name `, () => {
    expect(screen.getByTestId("feature_type_name")).toBeTruthy();
  });

  it(`should render Edit Feature Value dropdown `, () => {
    expect(screen.getByTestId("EditFeatureValue")).toBeTruthy();
  });

  it(`should render isEnabled toggle `, () => {
    expect(screen.getByTestId("isEnabled")).toBeTruthy();
  });
});
