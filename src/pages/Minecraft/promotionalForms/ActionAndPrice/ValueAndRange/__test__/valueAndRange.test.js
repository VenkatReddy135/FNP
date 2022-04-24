/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ValueAndRange from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
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

describe(`Value And Range Component test cases`, () => {
  const initialState = {
    edit: true,
    create: true,
    amountRange: [],
    formValues: {},
    addAmountRange: () => {
      console.log("AddAmountRange");
    },
    updateAmountRange: () => {
      console.log("UpdateAmountRange");
    },
    deleteAmountRange: () => {
      console.log("DeleteAmountRange");
    },
    handleChange: () => {
      console.log("HandleChange");
    },
  };

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    render(<ValueAndRange {...initialState} />);
    expect(screen.getAllByTestId("amountRange")).toBeTruthy();
  });

  it("should trigger OnClick function when the value of edit is true", () => {
    render(<ValueAndRange {...initialState} />);
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/add_range/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("AddAmountRange");
  });

  it(`should render the multiple amount range when amountRange length > 0`, () => {
    const updatedState = { ...initialState, amountRange: [{}] };
    render(<ValueAndRange {...updatedState} />);
    expect(screen.getAllByTestId("amountLength")).toBeTruthy();
  });

  it("should trigger OnClick function when the click on DeleteOutlinedIcon", () => {
    const updatedState = { ...initialState, amountRange: [{}] };
    render(<ValueAndRange {...updatedState} />);
    const consoleSpy = jest.spyOn(console, "log");
    const IconButton = screen.getByRole("button");
    fireEvent.click(IconButton);
    expect(consoleSpy).toHaveBeenCalledWith("DeleteAmountRange");
  });

  it("should render CustomTextInput with label promotion_action_price_amount", () => {
    render(<ValueAndRange {...initialState} />);
    expect(screen.findByLabelText("promotion_action_price_amount")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_action_price_amount_off", () => {
    render(<ValueAndRange {...initialState} />);
    expect(screen.findByLabelText("promotion_action_price_amount_off")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_action_price_minimum_amount when amount data is not zero", () => {
    const updatedState = { ...initialState, amountRange: [1] };
    render(<ValueAndRange {...updatedState} />);
    expect(screen.findByLabelText("promotion_action_price_minimum_amount")).toBeTruthy();
  });
});
