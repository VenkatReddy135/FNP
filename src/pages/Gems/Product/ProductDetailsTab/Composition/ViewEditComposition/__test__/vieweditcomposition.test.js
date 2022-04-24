/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ViewEditComposition from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useHistory: () => {},
  useRedirect: () => {},
  useDelete: () => {
    return [() => {}];
  },
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
  const props = { match: { params: { pid: "P_00000122", cid: "PC_00000100" } } };
  beforeEach(() => {
    render(<ViewEditComposition {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render details_block `, () => {
    expect(screen.getByTestId("details_block")).toBeTruthy();
  });

  it(`should render date_block`, () => {
    expect(screen.getByTestId("date_block")).toBeTruthy();
  });
});
