/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import FCComponentPriceMaster from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useRedirect: jest.fn(),
  useQueryWithStore: jest.fn(),
  useCreate: () => [() => {}],
  useTranslate: () => (label) => label,
  required: () => true,
  useMutation: () => [() => {}],
  FormWithRedirect: jest.fn(),
  SelectInput: jest.fn(),
  NumberInput: jest.fn(),
  BooleanInput: jest.fn(),
  TextInput: jest.fn(),
  DateInput: jest.fn(),
  FormDataConsumer: jest.fn(),
}));

describe("FC-Component Price Master Form", () => {
  let result;
  let form;
  let firstFormRow;
  let secondFormRow;
  let thirdFormRow;
  let fourthFormRow;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<FCComponentPriceMaster mode="create" />);
    result = renderer1.getRenderOutput();
    const handleSubmitWithRedirect = jest.fn();
    const rest = {};
    const formRenderer = result.props.children[3].props.children.props.render;
    form = formRenderer({ handleSubmitWithRedirect, ...rest });
    firstFormRow = form.props.children[0].props;
    secondFormRow = form.props.children[1].props;
    thirdFormRow = form.props.children[2].props;
    fourthFormRow = form.props.children[3].props;
  });

  test("FC-Component price master form component should exist", () => {
    expect(result).toBeTruthy();
  });

  it("should have fulFillmentGeo as data-test-id", () => {
    const fulFillmentGeo = firstFormRow.children[0].props.children.props["data-test-id"];
    expect(fulFillmentGeo).toEqual("fulFillmentGeo");
  });

  it("should have fcGroupName as data-test-id", () => {
    const fcGroupName = firstFormRow.children[1].props.children.props["data-test-id"];
    expect(fcGroupName).toEqual("fcGroupName");
  });

  it("should have fcGroupId as data-test-id", () => {
    const fcGroupId = firstFormRow.children[2].props.children.props["data-test-id"];
    expect(fcGroupId).toEqual("fcGroupId");
  });

  it("should have componentName as data-test-id", () => {
    const componentName = secondFormRow.children[0].props.children.props["data-test-id"];
    expect(componentName).toEqual("componentName");
  });

  it("should have price as data-test-id", () => {
    const price = secondFormRow.children[1].props.children.props["data-test-id"];
    expect(price).toEqual("price");
  });

  it("should have currency as data-test-id", () => {
    const formData = { currencyOptions: [] };
    const formDataConsumer = secondFormRow.children[2].props.children;
    const currency = formDataConsumer(formData).props.children.props["data-test-id"];
    expect(currency).toEqual("currency");
  });

  it("should have status as data-test-id", () => {
    const status = thirdFormRow.children[0].props.children.props["data-test-id"];
    expect(status).toEqual("status");
  });

  it("should have fromDate as data-test-id", () => {
    const fromDate = thirdFormRow.children[1].props.children.props["data-test-id"];
    expect(fromDate).toEqual("fromDate");
  });

  it("should have toDate as data-test-id", () => {
    const toDate = thirdFormRow.children[2].props.children.props["data-test-id"];
    expect(toDate).toEqual("toDate");
  });

  test("FC-Component price master form component should have cancel button", () => {
    const cancelButtonLabel = fourthFormRow.children[0].props.children;
    expect(cancelButtonLabel).toEqual("cancel");
  });

  test("FC-Component price master form component should have add button", () => {
    const addButtonLabel = fourthFormRow.children[1].props.children;
    expect(addButtonLabel).toEqual("add");
  });

  afterEach(() => {
    cleanup();
  });
});
