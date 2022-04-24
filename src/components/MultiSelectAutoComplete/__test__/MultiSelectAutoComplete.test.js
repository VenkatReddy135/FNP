/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import MultiSelectAutoComplete from "..";

jest.mock("react-admin", () => ({
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useCreate: () => [() => console.log("mutate"), { loading: true }],
  useQueryWithStore: jest.fn(),
  required: jest.fn(),
  useCallback: jest.fn(),
  useDelete: () => [() => console.log("mutate"), { loading: true, error: "Error" }],
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return { isRequired: false, input: { onChange: jest.fn(), onFailure: jest.fn() } };
  },
  SelectInput: "SelectInput",
}));

describe("MultiSelectAutoComplete Create Unit test cases", () => {
  const initialState = {
    edit: true,
    limitTags: 3,
    labelName: "name",
    optionsFromParentComponent: false,
    required: false,
    disabled: false,
    onOpen: false,
    errorMsg: false,
    onChangeFromParentComponent: false,
    autoCompleteClass: null,
    value: [],
    optionData: [],
    dataId: "",
    label: "textLabel",
    clearOnBlur: true,
    onInputChangeCall: () => {},
    onChange: () => {},
    onOpenCall: () => {},
    onSearchInputChange: () => {},
  };

  afterEach(() => {
    cleanup();
  });

  it("should render MultiSelectAutoComplete component", () => {
    render(<MultiSelectAutoComplete {...initialState} />);
    expect(screen.getByTestId("MultiSelectAutoComplete")).toBeTruthy();
  });

  it("should render TextField", () => {
    render(<MultiSelectAutoComplete {...initialState} />);
    expect(screen.getByText("textLabel")).toBeTruthy();
  });

  it("should render field with text edit", () => {
    const updatedState = { ...initialState, edit: false, label: "edit" };
    render(<MultiSelectAutoComplete {...updatedState} />);
    expect(screen.getByText("edit")).toBeTruthy();
  });
});
