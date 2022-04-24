/* eslint-disable react/jsx-props-no-spreading */
import React from "react";
import { cleanup, render, screen } from "@testing-library/react";
import renderer from "react-test-renderer";
import EditAttribute from "../index";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useMutation: () => [() => {}],
  useQueryWithStore: () => {
    return { loading: false };
  },
  useRefresh: () => {},
  required: () => true,
  useTranslate: () => (label) => label,
  SimpleForm: "SimpleForm",
  TextInput: "TextInput",
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
    render(<EditAttribute {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render list component", () => {
    expect(screen).toBeTruthy();
  });

  it("should include title", () => {
    const label = screen.getByTestId("edit_attribute");
    expect(label).toBeTruthy();
  });

  it("should include title", () => {
    const label = screen.getByTestId("edit_attribute");
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

  it("should include relations_created_by", () => {
    const label = screen.getByTestId("relations_created_by");
    expect(label).toBeTruthy();
  });

  it("should include relations_created_date", () => {
    const label = screen.getByTestId("relations_created_date");
    expect(label).toBeTruthy();
  });

  it("should include last_modified_by", () => {
    const label = screen.getByTestId("last_modified_by");
    expect(label).toBeTruthy();
  });

  it("should include last_modified_date", () => {
    const label = screen.getByTestId("last_modified_date");
    expect(label).toBeTruthy();
  });

  it("should match the snapshot", () => {
    const snap = renderer.create(<EditAttribute {...props} />);
    expect(snap.toJSON()).toMatchSnapshot();
  });
});
