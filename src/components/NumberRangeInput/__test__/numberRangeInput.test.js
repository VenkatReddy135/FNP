/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import NumberRangeInput from "..";

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
      input: { onChange: jest.fn(), onFailure: jest.fn(), value: ["value-0", "value-1"] },
      meta: { touched: "", error: "" },
    };
  },
  SelectInput: "SelectInput",
}));

describe("Number Range Input Unit test cases", () => {
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

  it("should render Number Range Input component", () => {
    render(<NumberRangeInput {...initialState} />);
    expect(screen.findByLabelText("NumberRangeInput")).toBeTruthy();
  });

  it("should render Start-Label when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<NumberRangeInput {...updatedState} />);
    expect(screen.findByLabelText("start")).toBeTruthy();
  });
  it("should render Start-Value when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<NumberRangeInput {...updatedState} />);
    expect(screen.findByLabelText("value-0")).toBeTruthy();
  });

  it("should render End-Label when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<NumberRangeInput {...updatedState} />);
    expect(screen.findByLabelText("end")).toBeTruthy();
  });
  it("should render End-Value when edit is false", () => {
    const updatedState = { ...initialState, edit: false };
    render(<NumberRangeInput {...updatedState} />);
    expect(screen.findByLabelText("value-1")).toBeTruthy();
  });
  it("should render Textfield with label name From Value", () => {
    render(<NumberRangeInput {...initialState} />);
    expect(screen.findByLabelText("From Value")).toBeTruthy();
  });

  it("should render Textfield with label name To Value", () => {
    render(<NumberRangeInput {...initialState} />);
    expect(screen.findByLabelText("To Value")).toBeTruthy();
  });
});
