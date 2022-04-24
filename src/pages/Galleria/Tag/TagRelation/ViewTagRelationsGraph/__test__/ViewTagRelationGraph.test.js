/* eslint-disable no-console */
import React from "react";
import { cleanup, render, screen, fireEvent } from "@testing-library/react";
import renderer from "react-test-renderer";
import ViewTagRelationGraph from "../ViewTagRelationsGraph";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  useQueryWithStore: () => ({ loading: false }),
  useNotify: jest.fn(),
  useRedirect: () => () => console.log("redirected"),
}));

describe("Tag realtion Graph test cases", () => {
  const match = {
    params: {
      id: "anniversary",
    },
  };
  beforeEach(() => {
    render(<ViewTagRelationGraph match={match} />);
  });

  afterEach(() => {
    cleanup();
  });

  it("should render Tag Relation Graph UI component", () => {
    expect(screen).toBeTruthy();
  });

  it("should render element with given text", () => {
    expect(screen.getByText("view_tag_relation")).toBeInTheDocument();
  });

  it("should trigger close button ", () => {
    const consoleSpy = jest.spyOn(console, "log");
    const button = screen.getByText(/close/i);
    fireEvent.click(button);
    expect(consoleSpy).toHaveBeenCalledWith("redirected");
  });

  it("should match snapshot", () => {
    const tree = renderer.create(<ViewTagRelationGraph match={match} />).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
