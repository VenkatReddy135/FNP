/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import PromotionCreate from "..";

jest.mock("react-admin", () => ({
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  required: jest.fn(),
  useCallback: jest.fn(),
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return { isRequired: false, input: { onChange: jest.fn(), onFailure: jest.fn(), value: "dateTimeSplitter" } };
  },
  useCreate: () => [() => console.log("mutate"), { onSuccess: jest.fn(), onFailure: jest.fn(), loading: true }],
  SelectInput: "SelectInput",
}));

describe("Promotion Create Unit test cases", () => {
  const initialState = {
    formValues: { autoCodeConfigs: "Test" },
  };

  beforeEach(() => {
    render(<PromotionCreate {...initialState} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Promotion create component", () => {
    expect(screen.getByTestId("promotionCreate")).toBeTruthy();
  });

  it("promotion_title header should exist", () => {
    expect(screen.getByText("promotion_title")).toBeInTheDocument();
  });

  it("Previous Button should exist", () => {
    expect(screen.getByText("prev")).toBeInTheDocument();
  });

  it("Next Button should exist", () => {
    expect(screen.getByText("next")).toBeInTheDocument();
  });
});
