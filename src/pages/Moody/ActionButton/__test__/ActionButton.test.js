/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import ActionButton from "..";

jest.mock("react-admin", () => ({
  useNotify: jest.fn(),
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
  useUnselectAll: jest.fn(),
}));

describe(`Action Button Component test cases`, () => {
  const props = {
    record: {
      approvalStatus: "pending",
    },
  };

  beforeEach(() => {
    render(<ActionButton {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getAllByTestId("action-button")).toBeTruthy();
  });

  it("should trigger onReject function ", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/reject/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("mutate");
  });

  it("should trigger onApprove function ", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/approve/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("mutate");
  });
});
