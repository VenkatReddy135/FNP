/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import DateRangeInput from "..";

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
  SimpleGrid: "SimpleGrid",
  TextInput: "TextInput",
  Button: "Button",
  SaveButton: "SaveButton",
  Toolbar: "Toolbar",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return {
      isRequired: false,
      input: { onChange: jest.fn(), onFailure: jest.fn(), value: "Thu 18 Nov 18:40:29 IST 2021" },
      meta: { touched: "", error: "" },
    };
  },
  SelectInput: "SelectInput",
}));

describe("DateRangeInput Unit test cases", () => {
  const initialState = {
    edit: true,
    source: "",
    label: "",
    startLabel: "start",
    endLabel: "end",
  };

  afterEach(() => {
    cleanup();
  });

  it("should render Date Range Input component", () => {
    render(<DateRangeInput {...initialState} />);
    expect(screen.findByLabelText("DateRangeInput")).toBeTruthy();
  });

  it("should render Date Time Input component with label From Date", () => {
    render(<DateRangeInput {...initialState} />);
    expect(screen.queryByText("From Date")).toBeTruthy();
  });

  it("should render Date Time Input component with label To Date", () => {
    render(<DateRangeInput {...initialState} />);
    expect(screen.queryByText("To Date")).toBeTruthy();
  });

  it("should render Start-Label when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<DateRangeInput {...updatedState} />);
    expect(screen.findByLabelText("start")).toBeTruthy();
  });

  it("should render End-Label when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<DateRangeInput {...updatedState} />);
    expect(screen.findByLabelText("end")).toBeTruthy();
  });
});
