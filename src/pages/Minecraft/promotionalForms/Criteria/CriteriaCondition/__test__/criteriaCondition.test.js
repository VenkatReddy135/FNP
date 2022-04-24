/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-extraneous-dependencies */

import React from "react";
import { cleanup, render, fireEvent, screen } from "@testing-library/react";
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

describe("CriteriaCondition Unit test cases", () => {
  const initialState = {
    edit: true,
    create: true,
    formValues: {},
    updateConditionData: () => console.log("UpdateConditionData"),
    deleteCondition: () => console.log("DeleteCondition"),
    allSelectedCondition: [],
    id: "",
    index: 0,
    criteriaConfigs: [],
    conditionId: "",
    operator: "",
    updateSubCondition: () => console.log("UpdateSubCondition"),
    childIndex: 0,
    subConditionCount: 0,
    parentId: "",
    showSubConditionBtn: () => true,
  };

  beforeEach(() => {
    render(<CriteriaCondition {...initialState} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render CriteriaCondition component", () => {
    expect(screen.getByTestId("criteriaCondition")).toBeTruthy();
  });

  it("should render DropDown with label promotion_condition name", () => {
    expect(screen.findByLabelText("promotion_condition")).toBeTruthy();
  });

  it("should render DropDown with label promotion_condition name", () => {
    expect(screen.findByLabelText("promotion_operator")).toBeTruthy();
  });

  it("should trigger OnClick function deleteCondition when edit is true ", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("DeleteCondition");
  });
});
