/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
import AutoCodeConfig from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  required: jest.fn(),
  useCallback: jest.fn(),
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
  SelectInput: "SelectInput",
}));

describe("MineCraft Unit test cases", () => {
  const initialState = {
    id: 0,
    index: 0,
    formValues: {
      fromDate: "Fri 19 Nov",
      thruDate: "Fri 19 Nov",
      autoCodeConfigs: [{ fromDate: "Fri 19 Nov" }, { thruDate: "Fri 19 Nov" }],
    },
    updateAutoCodeConfigs: () => console.log("AutoCodeCOnfigs"),
    validateAutoCodes: () => console.log("ValidateAutoCodes"),
    clearAutoCodes: () => console.log("ClearAutoCodes"),
  };
  beforeEach(() => {
    render(<AutoCodeConfig {...initialState} />);
  });
  afterEach(() => {
    cleanup();
  });

  it("should render AutoCodeConfigs component", () => {
    expect(screen.getByTestId("autoCodeConfigs-0")).toBeTruthy();
  });
  it("should render AutoCodeConfigs component", () => {
    expect(screen.getByTestId("autoCodeConfigs-1")).toBeTruthy();
  });

  it("should render CustomNumberInput with label no_of_codes", () => {
    expect(screen.findByLabelText("no_of_codes")).toBeTruthy();
  });

  it("should render DateTimeInput with label start_date", () => {
    expect(screen.findByLabelText("start_date")).toBeTruthy();
  });

  it("should render DateTimeInput with label end_date", () => {
    expect(screen.findByLabelText("end_date")).toBeTruthy();
  });

  it("should render CustomNumberInput with label code_length", () => {
    expect(screen.findByLabelText("code_length")).toBeTruthy();
  });

  it("should render CustomNumberInput with label code_starts_with", () => {
    expect(screen.findByLabelText("code_starts_with")).toBeTruthy();
  });

  it("should trigger onClick function validateAutoCodes()", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/Validate/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("ValidateAutoCodes");
  });

  it("should trigger OnClick function clearAutoCodes()", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/Clear/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("ClearAutoCodes");
  });
});
