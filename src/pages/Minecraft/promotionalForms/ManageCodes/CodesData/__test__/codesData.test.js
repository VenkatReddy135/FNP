/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
import CodesData from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useMutation: () => [() => console.log("mutate"), { loading: true }],
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
    edit: true,
    data: [{}],
    type: "autoCodes",
    formValues: {
      autoCodes: [{ fromDate: "Fri 19 Nov" }, { thruDate: "Fri 19 Nov" }],
      fromDate: "Fri 19 Nov",
      thruDate: "Fri 19 Nov",
      autoCodeConfigs: [{ fromDate: "Fri 19 Nov" }, { thruDate: "Fri 19 Nov" }],
    },
    exportCodes: () => console.log("ExportCodes"),
    deleteCodes: () => console.log("DeleteCodes"),
    updateCodes: () => console.log("UpdateCodes"),
  };

  beforeEach(() => {
    render(<CodesData {...initialState} />);
  });
  afterEach(() => {
    cleanup();
  });

  it("should render CodesData component", () => {
    expect(screen.getByTestId("codes")).toBeTruthy();
  });

  it("should render CustomNumberInput with label code", () => {
    expect(screen.findByLabelText("code")).toBeTruthy();
  });

  it("should render DateTimeInput with label promotion_start_date", () => {
    expect(screen.findByLabelText("promotion_start_date")).toBeTruthy();
  });

  it("should render DateTimeInput with label promotion_end_date", () => {
    expect(screen.findByLabelText("promotion_end_date")).toBeTruthy();
  });

  it("should trigger onClick function deleteCodes() when edit value is true", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("DeleteCodes");
  });
});
