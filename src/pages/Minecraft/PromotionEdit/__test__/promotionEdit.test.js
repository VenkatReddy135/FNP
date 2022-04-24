/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import PromotionEdit from "..";

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
  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return { isRequired: false, input: { onChange: jest.fn(), onFailure: jest.fn() } };
  },
  SelectInput: "SelectInput",
}));

describe("Promotion Data Layout Create Unit test cases", () => {
  const initialState = {
    edit: true,
    id: 0,
  };

  afterEach(() => {
    cleanup();
  });

  it("should render Promotion Data Layout component", () => {
    render(<PromotionEdit {...initialState} />);
    expect(screen.queryByTestId("promotion_edit")).not.toBeInTheDocument();
  });
});
