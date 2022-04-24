/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import CriteriaCondition from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useCreate: () => [() => {}],
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
    create: true,
    formValues: { geoId: [], criteria: [0, 1], domainId: 0 },
    updateMasterForm: () => console.log("UpdateMasterForm"),
    updateMasterFormValidity: () => console.log("UpdateMasterFormValidity"),
    addConditionData: () => console.log("addConditionData"),
  };

  afterEach(() => {
    cleanup();
  });

  it("should render CodesData component", () => {
    render(<CriteriaCondition {...initialState} />);
    expect(screen.getAllByTestId("criteriaCondition")).toBeTruthy();
  });

  it("promotion_geo  should exist", () => {
    const updatedState = { ...initialState, edit: false };
    render(<CriteriaCondition {...updatedState} />);
    expect(screen.getByText("promotion_geo")).toBeInTheDocument();
  });

  it("promotion_geo from Typography", () => {
    const updatedState = { ...initialState, edit: false };
    render(<CriteriaCondition {...updatedState} />);
    expect(screen.queryByText("promotion_domain")).toBeInTheDocument();
  });

  it("Dropdown with label promotion_domain  should exist", () => {
    render(<CriteriaCondition {...initialState} />);
    expect(screen.findAllByLabelText("promotion_domain")).toBeTruthy();
  });

  it("BoundedCheckBoxDropdown with label promotion_geo should exist when edit is true", () => {
    render(<CriteriaCondition {...initialState} />);
    expect(screen.findByLabelText("promotion_geo")).toBeTruthy();
  });
});
