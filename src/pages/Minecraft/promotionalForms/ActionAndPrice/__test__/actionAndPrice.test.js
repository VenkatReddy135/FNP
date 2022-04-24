/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import ActionAndPrice from "..";

jest.mock("react-admin", () => ({
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
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

describe(`Value And Range Component test cases`, () => {
  const props = {
    formValues: { action: { price: { amountRange: [] } } },
    updateMasterForm: () => {
      console.log("updateMasterForm");
    },
    handleChange: () => console.log("HandleChange"),
  };

  beforeEach(() => {
    render(<ActionAndPrice {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getAllByTestId("addAndRange")).toBeTruthy();
  });

  it("should render DropDownText with label promotion_action", () => {
    expect(screen.findByLabelText("promotion_action")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_action_price_amount_off", () => {
    expect(screen.findByLabelText("promotion_action_price_amount_off")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_before_offer_message", () => {
    expect(screen.findByLabelText("promotion_before_offer_message")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_after_offer_message", () => {
    expect(screen.findByLabelText("promotion_after_offer_message")).toBeTruthy();
  });

  it("should render DropDownText with label promotion_price", () => {
    expect(screen.findByLabelText("promotion_price")).toBeTruthy();
  });

  it("should render CustomTextInput with label promotion_max_cap", () => {
    expect(screen.findByLabelText("promotion_max_cap")).toBeTruthy();
  });
});
