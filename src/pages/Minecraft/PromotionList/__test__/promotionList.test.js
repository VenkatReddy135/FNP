/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */
/* eslint:recommended */

import * as React from "react";
import { render, cleanup, screen } from "@testing-library/react";
import PromotionList from "../index";

jest.mock("react-router", () => ({
  useLocation: () => ({
    pathname: "localhost:3000",
  }),
}));

jest.mock("../../../../components/SimpleGrid", () => () => <div>Hello World</div>);

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

  TextInput: "TextInput",
  RadioButtonGroupInput: "RadioButtonGroupInput",
  NumberInput: "NumberInput",
  useInput: () => {
    return { isRequired: false, input: { onChange: jest.fn(), onFailure: jest.fn(), value: "" } };
  },
  SelectInput: "SelectInput",
}));

describe("Promotion List Create Unit test cases", () => {
  const initialState = {};

  beforeEach(() => {
    render(<PromotionList {...initialState} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Promotion List component", () => {
    expect(screen.queryByTestId("promotionList")).not.toBeInTheDocument();
  });

  it("should render component", () => {
    expect(screen.queryByText("Hello World")).toBeInTheDocument();
  });
});
