/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import GeoLaunchDate from "../GeoLaunchDate";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useQueryWithStore: () => {},
  useRefresh: () => {},
  required: () => true,
  useInput: () => {
    return { isRequired: false, input: { value: "", onChange: jest.fn() }, meta: {} };
  },
  useTranslate: () => (label) => label,
  SelectInput: "SelectInput",
  DateInput: "DateInput",
}));

describe(`GeoLaunchDate Component test cases`, () => {
  const props = { isEditable: true, formData: {} };

  beforeEach(() => {
    render(<GeoLaunchDate {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the geo_launch_date without crashing `, () => {
    expect(screen.getByTestId("geo_launch_date")).toBeTruthy();
  });
  it(`should render the geo_details without crashing `, () => {
    expect(screen.getByTestId("geo_details")).toBeTruthy();
  });
});
