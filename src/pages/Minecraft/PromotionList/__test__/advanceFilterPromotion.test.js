/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import AdvanceFilterPromotion from "../AdvanceFilterPromotion";

jest.mock("react-router", () => ({
  useLocation: () => ({
    pathname: "localhost:3000",
  }),
}));

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
      input: { onChange: jest.fn(), onFailure: jest.fn(), value: "" },
      meta: { touched: "", error: "" },
    };
  },
  SelectInput: "SelectInput",
}));

describe("Advance Filter Promotion Unit test cases", () => {
  const initialState = {
    edit: true,
    id: 0,
  };

  beforeEach(() => {
    render(<AdvanceFilterPromotion {...initialState} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Advance Filter Promotion component", () => {
    expect(screen.getByTestId("advanceFilterPromotion")).toBeTruthy();
  });

  it("should render heading promotion_title", () => {
    expect(screen.getByText("promotion_title")).toBeTruthy();
  });

  it("should render BoundedCheckBoxDropdown with label Promotion Domain", () => {
    expect(screen.findByLabelText("promotion_domain")).toBeTruthy();
  });

  it("should render BoundedCheckBoxDropdown with label Promotion Geo", () => {
    expect(screen.findByLabelText("promotion_geo")).toBeTruthy();
  });

  it("should render CustomTextInput with label Promotion Name", () => {
    expect(screen.findByLabelText("promotion_name")).toBeTruthy();
  });

  it("should render CustomTextInput with label Category Name", () => {
    expect(screen.findByLabelText("category_name")).toBeTruthy();
  });

  it("should render DropDownText with label state", () => {
    expect(screen.findByLabelText("state")).toBeTruthy();
  });

  it("should render DropDownText with label Promotion Type", () => {
    expect(screen.findByLabelText("promotion_type")).toBeTruthy();
  });

  it("should render CustomTextInput with label Promotion Id", () => {
    expect(screen.findByLabelText("promotion_id")).toBeTruthy();
  });
});
