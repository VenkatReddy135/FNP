/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import ManageCodes from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useCreate: () => [() => {}],
  useNotify: jest.fn(),
  useQueryWithStore: jest.fn(),
  required: jest.fn(),
  useCallback: jest.fn(),
  useDelete: () => {
    return [
      null,
      () => console.log("mutate"),
      {
        onSuccess: jest.fn(),
        onFailure: jest.fn(),
      },
    ];
  },
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
    create: true,
    formValues: { couponRequired: "" },
    updateMasterForm: () => console.log("UpdateMasterForm"),
    updateMasterFormValidity: () => console.log("UpdateMasterFormValidity"),
    addManualCode: () => console.log("AddManualCode"),
    showAddButton: () => true,
  };

  beforeEach(() => {
    render(<ManageCodes {...initialState} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render CodesData component", () => {
    expect(screen.getByTestId("manageCode")).toBeTruthy();
  });

  it("should render GenericRadioGroup with label coupon_required", () => {
    expect(screen.findByLabelText("coupon_required")).toBeTruthy();
  });

  it("should render CustomNumberInput with label coupon_limit_per_code", () => {
    expect(screen.findByLabelText("coupon_limit_per_code")).toBeTruthy();
  });

  it("should render CustomNumberInput with label coupon_limit_per_customer", () => {
    expect(screen.findByLabelText("coupon_limit_per_customer")).toBeTruthy();
  });

  it("manual_codes should exist", () => {
    expect(screen.findByText("manual_codes")).toBeTruthy();
  });
});
