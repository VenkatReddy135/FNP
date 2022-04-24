/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import AssociateAttribute from "../AssociateAttribute";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useCreate: () => [() => {}],
  useQueryWithStore: () => {
    return { loading: false };
  },
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
  SelectInput: "SelectInput",
}));

describe("Feature List test cases", () => {
  const props = {
    match: {
      params: {
        id: "P_00000133",
      },
    },
  };
  beforeEach(() => {
    render(<AssociateAttribute {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render list component", () => {
    expect(screen).toBeTruthy();
  });

  it("should include title", () => {
    const label = screen.getByTestId("associate_attribute");
    expect(label).toBeTruthy();
  });

  it("should include attribute_type", () => {
    const label = screen.getByTestId("attribute_type");
    expect(label).toBeTruthy();
  });

  it("should include attribute_name", () => {
    const label = screen.getByTestId("attribute_name");
    expect(label).toBeTruthy();
  });

  it("should include attribute_value", () => {
    const label = screen.getByTestId("attribute_value");
    expect(label).toBeTruthy();
  });

  it("should include is_enabled", () => {
    const label = screen.getByTestId("is_enabled");
    expect(label).toBeTruthy();
  });

  it("should match the snapshot", () => {
    const snap = renderer.create(<AssociateAttribute {...props} />);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});
