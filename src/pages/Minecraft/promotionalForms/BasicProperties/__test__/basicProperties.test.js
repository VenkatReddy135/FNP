/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import BasicProperties from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  required: jest.fn(),
  useCallback: jest.fn(),
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
  SelectInput: "SelectInput",
}));

describe("BasicProperties Unit test cases", () => {
  const initialState = {
    formValues: {
      promotionName: "",
      promotionDescription: "",
      promotionTypeId: "",
      fromDate: "",
      thruDate: "",
    },
    edit: true,
    create: true,
    updateMasterForm: () => {
      console.log("UpdateMasterFormValidity");
    },
  };

  afterEach(() => {
    cleanup();
  });

  it("should render Basic Properties component", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.getByTestId("basicPropertiesComponent")).toBeTruthy();
  });

  it("should render Basic Properties component when create is true", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.getByTestId("create_true")).toBeTruthy();
  });

  it("should render Basic Properties component when create is False", () => {
    const updatedState = { ...initialState, create: false };
    render(<BasicProperties {...updatedState} />);
    expect(screen.getByTestId("create_false")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_name", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_name")).toBeTruthy();
  });

  it("should render GenericRadioGroup with label promotion_state ", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_state")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_start_date ", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_description")).toBeTruthy();
  });

  it("should render DateTimeInput with label promotion_start_date", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_start_date")).toBeTruthy();
  });

  it("should render DateTimeInput with label promotion_end_date", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_end_date")).toBeTruthy();
  });
  it("should render DropDownText with label promotion_type", () => {
    render(<BasicProperties {...initialState} />);
    expect(screen.findByLabelText("promotion_type")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_id", () => {
    const updatedState = { ...initialState, create: false };
    render(<BasicProperties {...updatedState} />);
    expect(screen.findByLabelText("promotion_id")).toBeTruthy();
  });
});
