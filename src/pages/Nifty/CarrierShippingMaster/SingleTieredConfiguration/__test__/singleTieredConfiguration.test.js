import React from "react";
import { cleanup } from "@testing-library/react";
import ShallowRenderer from "react-test-renderer/shallow";
import SingleTieredConfiguration from "..";

jest.mock("react-admin", () => ({
  useTranslate: () => (label) => label,
  required: () => true,
  BooleanInput: jest.fn(),
  NumberInput: jest.fn(),
}));

describe("Single Tiered Configuration", () => {
  let result;
  beforeEach(() => {
    const renderer1 = new ShallowRenderer();
    renderer1.render(<SingleTieredConfiguration mode="create" formRef={{}} />);
    result = renderer1.getRenderOutput();
  });

  it("should render Single Tiered Configuration UI component", () => {
    expect(result).toBeTruthy();
  });

  it("should have rate as data-test-id", () => {
    expect(result.props.children.props.children[0].props.children.props["data-test-id"]).toEqual("rate");
  });

  it("should have isEnabled as data-test-id", () => {
    expect(result.props.children.props.children[1].props.children.props["data-test-id"]).toEqual("isEnabled");
  });

  afterEach(() => {
    cleanup();
  });
});
