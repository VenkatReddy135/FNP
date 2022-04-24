/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import PromotionShow from "..";

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

describe("Promotion Data Layout Create Unit test cases", () => {
  const initialState = {
    edit: false,
    id: 0,
  };

  afterEach(() => {
    cleanup();
  });

  it("should render Promotion Show component", () => {
    render(<PromotionShow {...initialState} />);
    expect(screen.queryByTestId("promotion_show")).not.toBeInTheDocument();
  });
});
