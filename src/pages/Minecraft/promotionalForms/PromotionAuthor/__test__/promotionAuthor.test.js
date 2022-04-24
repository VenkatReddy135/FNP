/* eslint-disable no-console */
/* eslint-disable react/jsx-props-no-spreading */
import * as React from "react";
import { render, screen, cleanup } from "@testing-library/react";
import PromotionAuthor from "..";

jest.mock("react-admin", () => ({
  useMutation: () => [() => console.log("mutate"), { loading: true }],
  useRefresh: () => {},
  useTranslate: () => (label) => label,
}));

describe(`Action Button Component test cases`, () => {
  const props = {
    formValues: {},
  };

  beforeEach(() => {
    render(<PromotionAuthor {...props} />);
  });

  afterEach(() => {
    cleanup();
  });

  it(`should render the component without crashing `, () => {
    expect(screen.getAllByTestId("promotion-author")).toBeTruthy();
  });

  it("should render CustomNumberInput with label Created by", () => {
    expect(screen.findByLabelText("Created by")).toBeTruthy();
  });

  it("should render CustomNumberInput with label Created date", () => {
    expect(screen.findByLabelText("Created date")).toBeTruthy();
  });

  it("should render CustomNumberInput with label Last modified by", () => {
    expect(screen.findByLabelText("Last modified by")).toBeTruthy();
  });

  it("should render CustomNumberInput with label Last modified date", () => {
    expect(screen.findByLabelText("Last modified date")).toBeTruthy();
  });
});
