import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import DateTimeInput from "../index";

jest.mock("react-admin", () => ({
  useInput: () => {},
  useTranslate: () => (label) => label,
}));

describe("CustomDateTime testcases", () => {
  beforeEach(() => {
    render(<DateTimeInput source="fromDate" label="From date" />);
  });

  test("test for render", () => {
    expect.assertions(1);
    expect(screen.getByTestId("CustomDateTimeInput")).toBeTruthy();
  });

  test("test for label", () => {
    expect.assertions(1);
    expect(screen.queryByText("From date")).toBeTruthy();
  });

  test("test for error on date select", () => {
    const date = screen.getByTestId("date");
    const time = screen.getByTestId("time");
    fireEvent.mouseDown(date);
    fireEvent.change(date, { target: { value: "2021-06-29" } });
    fireEvent.mouseDown(time);
    fireEvent.change(time, { target: { value: "11:50" } });
    expect(screen.getByDisplayValue("2021-06-29")).toBeTruthy();
    expect(screen.getByDisplayValue("11:50")).toBeTruthy();
  });

  test("tree for DateTimeInput", () => {
    const domTree = renderer.create(<DateTimeInput source="fromDate" label="From date" onChange={() => {}} />).toJSON();
    expect(domTree).toMatchSnapshot();
  });

  afterEach(() => {
    cleanup();
  });
});
